import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

interface Body {
  activityIds: string[];
  missionId?: string | null;
  goal?: string;
  dryRun?: boolean;
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Token refresh failed: ${t}`);
  }
  const j = await res.json();
  return j.access_token;
}

function encodeHeader(value: string): string {
  // RFC 2047 encoded-word for non-ASCII subjects
  if (/^[\x20-\x7E]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function buildRawEmail(opts: { from: string; to: string; subject: string; body: string }): string {
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${encodeHeader(opts.subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    opts.body,
  ];
  const message = headers.join("\r\n");
  return Buffer.from(message, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sendOne(accessToken: string, raw: string) {
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gmail send failed (${res.status}): ${t}`);
  }
  return res.json() as Promise<{ id: string; threadId: string }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as Body;
  if (!body.activityIds || body.activityIds.length === 0) {
    return res.status(400).json({ error: "activityIds required" });
  }

  const { data: gcfg, error: gErr } = await supabaseAdmin
    .from("google_configs")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (gErr || !gcfg) return res.status(400).json({ error: "Gmail not connected. Connect in Automations tab." });

  const runId = await startRun({
    ownerId,
    missionId: body.missionId,
    agentName: "campaign-manager", // reuse existing channel; future could be its own agent name if migration allows
    goal: body.goal,
    task: `Send ${body.activityIds.length} email(s) via Gmail`,
    input: { activityIds: body.activityIds, dryRun: !!body.dryRun },
  });

  try {
    const { data: activities, error: aErr } = await supabaseAdmin
      .from("crm_activities")
      .select("id, contact_id, subject, body, completed, type, crm_contacts(email, first_name, last_name)")
      .eq("owner_id", ownerId)
      .in("id", body.activityIds);
    if (aErr) throw aErr;

    const accessToken = body.dryRun ? "" : await getAccessToken(gcfg.refresh_token);
    const fromHeader = `${gcfg.email_address.split("@")[0]} <${gcfg.email_address}>`;

    const results: any[] = [];
    let sentCount = 0;
    for (const a of activities || []) {
      try {
        if (a.completed) {
          results.push({ activityId: a.id, skipped: "already sent" });
          continue;
        }
        if (a.type !== "email") {
          results.push({ activityId: a.id, skipped: `type=${a.type} (not email)` });
          continue;
        }
        const contact = (a as any).crm_contacts;
        const to = contact?.email;
        if (!to || !to.includes("@")) {
          results.push({ activityId: a.id, skipped: "contact has no valid email" });
          continue;
        }
        // Strip the "(drafted)" suffix from the subject for the actual send
        const subject = (a.subject || "").replace(/\s*\(drafted\)\s*$/i, "").trim() || "Quick question";
        const raw = buildRawEmail({ from: fromHeader, to, subject, body: a.body || "" });

        if (body.dryRun) {
          results.push({ activityId: a.id, dryRun: true, to, subject, bodyPreview: (a.body || "").slice(0, 200) });
          continue;
        }

        const sent = await sendOne(accessToken, raw);
        sentCount++;
        await supabaseAdmin
          .from("crm_activities")
          .update({
            completed: true,
            subject: subject + " (sent)",
            gmail_message_id: sent.id,
            gmail_thread_id: sent.threadId,
            sent_at: new Date().toISOString(),
          })
          .eq("id", a.id);
        results.push({ activityId: a.id, sent: true, to, gmail_message_id: sent.id });
      } catch (e: any) {
        results.push({ activityId: a.id, error: e.message });
      }
    }

    if (!body.dryRun && sentCount > 0) {
      await supabaseAdmin
        .from("google_configs")
        .update({ last_send_at: new Date().toISOString() })
        .eq("owner_id", ownerId);
    }

    await completeRun({
      runId,
      affectedTable: "crm_activities",
      affectedCount: sentCount,
      output: { sentCount, results },
    });

    return res.status(200).json({ runId, sentCount, results });
  } catch (err: any) {
    console.error("email-sender error:", err);
    await failRun(runId, err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
