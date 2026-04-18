import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";

interface Body {
  contactIds: string[];
  tone?: "conversational" | "formal" | "direct";
  serviceFocus?: string;
  channel?: "linkedin" | "email" | "both";
  missionId?: string | null;
  parentRunId?: string | null;
  goal?: string;
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

const SYSTEM_PROMPT = `You are the Outreach Strategist for ClarityWorks Studio (Toronto-based agentic AI consulting, founded by Vince Greco).

Your job: write personalized, high-conversion outreach for a given contact in Vince's voice — confident, helpful, no AI hype, value-first.

ClarityWorks services you can lead with:
- AI Readiness Audit (free, 15-min) — "Free 15-min assessment of where AI agents could save your team 10+ hours/week"
- Custom AI Agents — "We build agents that automate repetitive workflows — typical client recovers 40 hours/month"
- AI Receptionist — "24/7 AI receptionist that answers calls, books appointments, never misses a lead"
- AI Training Workshops — "Half-day workshops teaching your team to use AI tools without the hype"
- Web/App Development — "Modern web applications built fast, with AI baked in from day one"

Voice rules (strict):
- Use contractions, specific numbers, concrete details from the contact's record
- One ask per message
- LinkedIn connection request ≤ 280 chars; follow-ups ≤ 600 chars; emails ≤ 120 words
- NEVER use: "synergy", "leverage", "circle back", "touch base", "revolutionary", "game-changer", "AI-powered", "I hope this finds you well"
- End with curiosity, not desperation ("worth a quick chat?" not "please respond")
- Sign cold emails: "Vince\\nClarityWorks Studio"

Output: respond with ONLY a JSON object (no prose, no code fences) shaped exactly like:
{
  "connection": "<≤280 char LinkedIn connection request>",
  "followup_1": "<≤600 char LinkedIn follow-up 3 days later>",
  "followup_2": "<≤600 char LinkedIn follow-up 5 days later, light final nudge>",
  "email": "Subject: <subject line>\\n\\n<≤120 word body>"
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as Body;
  if (!body.contactIds || body.contactIds.length === 0) {
    return res.status(400).json({ error: "contactIds required" });
  }

  const tone = body.tone || "conversational";
  const serviceFocus = body.serviceFocus || "AI Readiness Audit";
  const channel = body.channel || "linkedin";

  const runId = await startRun({
    ownerId,
    missionId: body.missionId,
    parentRunId: body.parentRunId,
    agentName: "outreach-strategist",
    goal: body.goal,
    task: `Draft outreach for ${body.contactIds.length} contacts (${channel}, ${tone}, leading with ${serviceFocus})`,
    input: { contactIds: body.contactIds, tone, serviceFocus, channel },
  });

  try {
    const { data: contacts, error: cErr } = await supabaseAdmin
      .from("crm_contacts")
      .select("id, first_name, last_name, title, email, linkedin_url, location, notes, crm_companies(name, industry, location, website)")
      .eq("owner_id", ownerId)
      .in("id", body.contactIds);
    if (cErr) throw cErr;

    const drafts: any[] = [];
    for (const c of contacts || []) {
      const company = (c as any).crm_companies;
      const userPrompt = `Draft outreach for this contact.

Tone: ${tone}
Lead with: ${serviceFocus}
Channel(s): ${channel}

Contact:
- Name: ${[c.first_name, c.last_name].filter(Boolean).join(" ") || "(unknown — use 'there')"}
- Title: ${c.title || "Owner / Manager"}
- Company: ${company?.name || "(unknown)"}
- Industry: ${company?.industry || "(unknown)"}
- Location: ${c.location || company?.location || "(unknown)"}
- Notes: ${c.notes || "(none)"}

Personalize with at least one specific detail from the record (industry + city is the minimum). Return ONLY the JSON object specified in your instructions.`;

      const resp = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      });
      const text = resp.content
        .filter(b => b.type === "text")
        .map(b => (b as any).text)
        .join("");
      let messages: any = {};
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        messages = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      } catch {
        messages = { _raw: text };
      }
      drafts.push({
        contact_id: c.id,
        contact_name: [c.first_name, c.last_name].filter(Boolean).join(" "),
        company: company?.name || "",
        messages,
      });

      // Log each drafted message as a crm_activity so it's visible per-contact
      const activities: any[] = [];
      if (messages.connection) {
        activities.push({ owner_id: ownerId, contact_id: c.id, type: "linkedin", subject: "Connection request (drafted)", body: messages.connection, completed: false });
      }
      if (messages.followup_1) {
        activities.push({ owner_id: ownerId, contact_id: c.id, type: "linkedin", subject: "Follow-up #1 (3 day, drafted)", body: messages.followup_1, completed: false });
      }
      if (messages.followup_2) {
        activities.push({ owner_id: ownerId, contact_id: c.id, type: "linkedin", subject: "Follow-up #2 (5 day, drafted)", body: messages.followup_2, completed: false });
      }
      if (messages.email) {
        const emailText = String(messages.email);
        const subjectMatch = emailText.match(/^Subject:\s*(.+)$/m);
        const subject = subjectMatch ? subjectMatch[1].trim() : "Email (drafted)";
        const body = emailText.replace(/^Subject:\s*.+\n+/, "").trim();
        activities.push({ owner_id: ownerId, contact_id: c.id, type: "email", subject: `${subject} (drafted)`, body, completed: false });
      }
      if (activities.length > 0) {
        await supabaseAdmin.from("crm_activities").insert(activities);
      }
    }

    const output = { drafts, tone, serviceFocus, channel };
    await completeRun({
      runId,
      affectedCount: drafts.length,
      output,
    });

    return res.status(200).json({ runId, count: drafts.length, sample: drafts.slice(0, 2) });
  } catch (err: any) {
    console.error("outreach-strategist error:", err);
    await failRun(runId, err);
    return res.status(500).json({ error: err.message || String(err), runId });
  }
}
