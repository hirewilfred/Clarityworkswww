import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";
import { randomUUID } from "node:crypto";

interface PlanBody {
  action: "plan";
  goal: string;
  context?: Record<string, unknown>;
}
interface CompleteBody {
  action: "complete";
  missionId: string;
  summary: Record<string, unknown>;
  status?: "succeeded" | "failed";
  error?: string;
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "" });

const PLANNER_SYSTEM = `You are the Marketing Orchestrator for ClarityWorks Studio (Toronto-based agentic AI consulting). Decompose a marketing mission into a sequence of specialist agent calls.

Available specialists:
1. lead-hunter — params: { persona: string, geography: string, count?: number (default 25, max 100), actor?: "google-places" | "apollo" | "linkedin" }
2. lead-enricher — params: { contactIds?: string[] | "from_previous", filter?: { missingEmail?: boolean, source?: string }, limit?: number }
3. outreach-strategist — params: { contactIds: string[] | "from_previous", tone?: "conversational" | "formal" | "direct", serviceFocus?: string, channel?: "linkedin" | "email" | "both" }
4. campaign-manager — params: { campaignName: string, contactIds?: string[] | "from_previous", draftsRunId?: "from_previous_strategist", channel?: "linkedin" | "instantly_email" | "both", autoActivate?: boolean }

Rules:
- Use "from_previous" as a placeholder where a step needs IDs produced by the immediately prior step
- Use "from_previous_strategist" for the campaign-manager's draftsRunId
- Default autoActivate to false unless the user explicitly asked to send
- Choose actor based on persona: local services (HVAC, plumbers, salons, lawyers, dentists, contractors) → "google-places". B2B titles (CTO, IT Director, VP Marketing) → "apollo".
- Keep plans tight — usually 2-4 steps. Don't add unrequested steps.

Output ONLY a JSON object (no prose, no code fences):
{
  "summary": "<one-line plain English summary of the plan>",
  "steps": [
    { "agent": "lead-hunter" | "lead-enricher" | "outreach-strategist" | "campaign-manager", "params": { ... }, "rationale": "<one short sentence>" }
  ]
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as PlanBody | CompleteBody;

  try {
    if (body.action === "plan") {
      const missionId = randomUUID();
      const runId = await startRun({
        ownerId,
        missionId,
        agentName: "marketing-orchestrator",
        goal: body.goal,
        task: "Plan and delegate mission",
        input: { context: body.context || {} },
      });

      const resp = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: PLANNER_SYSTEM,
        messages: [{ role: "user", content: `Mission: ${body.goal}` }],
      });
      const text = resp.content
        .filter(b => b.type === "text")
        .map(b => (b as any).text)
        .join("");
      let plan: any = null;
      try {
        const m = text.match(/\{[\s\S]*\}/);
        plan = m ? JSON.parse(m[0]) : null;
      } catch (e) {
        plan = null;
      }
      if (!plan || !Array.isArray(plan.steps)) {
        await failRun(runId, new Error(`Planner returned invalid JSON: ${text.slice(0, 300)}`));
        return res.status(500).json({ error: "Planner returned invalid JSON", raw: text });
      }

      await supabaseAdmin
        .from("marketing_agent_runs")
        .update({
          input: { context: body.context || {}, plan },
        })
        .eq("id", runId);

      return res.status(200).json({ missionId, runId, plan });
    }

    if (body.action === "complete") {
      const { data: missionRows, error: mErr } = await supabaseAdmin
        .from("marketing_agent_runs")
        .select("id, owner_id")
        .eq("mission_id", body.missionId)
        .eq("agent_name", "marketing-orchestrator")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: true })
        .limit(1);
      if (mErr || !missionRows || missionRows.length === 0) {
        return res.status(404).json({ error: "Mission row not found" });
      }
      await completeRun({
        runId: missionRows[0].id,
        status: body.status || "succeeded",
        output: body.summary,
        error: body.error,
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err: any) {
    console.error("orchestrator error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
