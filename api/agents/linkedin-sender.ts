import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";

interface Body {
  activityIds: string[];
  missionId?: string | null;
  goal?: string;
  dryRun?: boolean;
}

const DELAY_MIN_MS = 8000;
const DELAY_MAX_MS = 15000;

async function getLiCookie(ownerId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(ownerId);
  if (error || !data?.user) return null;
  const meta = (data.user.user_metadata || {}) as Record<string, unknown>;
  const cookie = meta.li_at_cookie;
  return typeof cookie === "string" && cookie.length > 0 ? cookie : null;
}

async function sendConnection(liCookie: string, profileId: string, message: string): Promise<{ ok: boolean; error?: string }> {
  const csrfToken = liCookie.substring(0, 20);
  const headers = {
    cookie: `li_at=${liCookie}`,
    "csrf-token": csrfToken,
    "x-restli-protocol-version": "2.0.0",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  const profileRes = await fetch(`https://www.linkedin.com/voyager/api/identity/profiles/${profileId}`, { headers });
  if (!profileRes.ok) {
    return { ok: false, error: `profile fetch failed (${profileRes.status})` };
  }
  const profileData = (await profileRes.json()) as any;
  const entityUrn = profileData.entityUrn || profileData.miniProfile?.entityUrn || `urn:li:fsd_profile:${profileId}`;
  const memberId = String(entityUrn).split(":").pop();

  const connectRes = await fetch(
    "https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreate",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        inviteeProfileUrn: `urn:li:fsd_profile:${memberId}`,
        customMessage: message.substring(0, 300),
      }),
    },
  );

  if (connectRes.ok || connectRes.status === 201) return { ok: true };
  const txt = await connectRes.text().catch(() => "");
  return { ok: false, error: `send failed (${connectRes.status}): ${txt.slice(0, 120)}` };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as Body;
  if (!body.activityIds || body.activityIds.length === 0) {
    return res.status(400).json({ error: "activityIds required" });
  }

  const liCookie = await getLiCookie(ownerId);
  if (!liCookie) {
    return res.status(400).json({ error: "LinkedIn li_at cookie not configured. Open LinkedIn Outreach tab → paste your cookie." });
  }

  const runId = await startRun({
    ownerId,
    missionId: body.missionId,
    agentName: "campaign-manager",
    goal: body.goal,
    task: `Send ${body.activityIds.length} LinkedIn connection request(s)`,
    input: { activityIds: body.activityIds, dryRun: !!body.dryRun },
  });

  try {
    const { data: activities, error: aErr } = await supabaseAdmin
      .from("crm_activities")
      .select("id, contact_id, subject, body, completed, type, crm_contacts(linkedin_url, first_name, last_name)")
      .eq("owner_id", ownerId)
      .in("id", body.activityIds);
    if (aErr) throw aErr;

    const results: any[] = [];
    let sentCount = 0;
    const eligible = (activities || []).filter(a => {
      if (a.completed) return false;
      if (a.type !== "linkedin") return false;
      // Only auto-send connection requests; followups need manual messaging post-connection
      if (!/connection request/i.test(a.subject || "")) return false;
      const contact = (a as any).crm_contacts;
      return contact?.linkedin_url && contact.linkedin_url.includes("linkedin.com/in/");
    });

    for (let i = 0; i < eligible.length; i++) {
      const a = eligible[i];
      const contact = (a as any).crm_contacts;
      const profileMatch = contact.linkedin_url.match(/linkedin\.com\/in\/([^/?]+)/);
      if (!profileMatch) {
        results.push({ activityId: a.id, error: "invalid LinkedIn URL" });
        continue;
      }
      const profileId = profileMatch[1];

      if (body.dryRun) {
        results.push({ activityId: a.id, dryRun: true, profileId, messagePreview: (a.body || "").slice(0, 100) });
        continue;
      }

      try {
        const r = await sendConnection(liCookie, profileId, a.body || "");
        if (r.ok) {
          sentCount++;
          await supabaseAdmin
            .from("crm_activities")
            .update({
              completed: true,
              subject: (a.subject || "").replace(/\(drafted\)/i, "(sent)"),
              sent_at: new Date().toISOString(),
            })
            .eq("id", a.id);
          // Update linkedin_leads stage if there's a matching row
          await supabaseAdmin
            .from("linkedin_leads")
            .update({ stage: "connect_sent", updated_at: new Date().toISOString() })
            .eq("owner_id", ownerId)
            .eq("linkedin_url", contact.linkedin_url);
          results.push({ activityId: a.id, sent: true, profileId });
        } else {
          results.push({ activityId: a.id, error: r.error });
        }
      } catch (e: any) {
        results.push({ activityId: a.id, error: e.message });
      }

      // Rate limit between sends (skip on last one)
      if (i < eligible.length - 1) {
        const delay = DELAY_MIN_MS + Math.floor(Math.random() * (DELAY_MAX_MS - DELAY_MIN_MS));
        await new Promise(r => setTimeout(r, delay));
      }
    }

    const skipped = (activities || []).length - eligible.length;
    await completeRun({
      runId,
      affectedTable: "crm_activities",
      affectedCount: sentCount,
      output: { sentCount, skipped, results },
    });

    return res.status(200).json({ runId, sentCount, skipped, eligible: eligible.length, results });
  } catch (err: any) {
    console.error("linkedin-sender error:", err);
    await failRun(runId, err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
