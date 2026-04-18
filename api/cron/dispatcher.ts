import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { isCronRequest } from "../_lib/auth.js";

export const config = { maxDuration: 60 };

const BASE_URL = process.env.PUBLIC_BASE_URL || "https://clarityworksstudio.com";
const INTERNAL_KEY = process.env.INTERNAL_API_KEY || "";

interface PlanStep {
  agent: "lead-hunter" | "lead-enricher" | "outreach-strategist" | "campaign-manager";
  params: Record<string, unknown>;
  rationale?: string;
}

interface RunState {
  plan?: { summary: string; steps: PlanStep[] };
  cursor?: number;
  context?: { lastContactIds?: string[]; lastStrategistRunId?: string | null };
  step_state?: Record<string, unknown>;
}

function internalHeaders(ownerId: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${INTERNAL_KEY}`,
    "X-Owner-Id": ownerId,
  };
}

async function callAgent(path: string, ownerId: string, body: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: internalHeaders(ownerId),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: any;
  try { parsed = text ? JSON.parse(text) : {}; } catch { parsed = { _raw: text }; }
  if (!res.ok) throw new Error(parsed.error || `${path} failed (${res.status})`);
  return parsed;
}

function resolvePlaceholders(params: Record<string, unknown>, ctx: RunState["context"]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === "from_previous" && (k === "contactIds" || k === "leadIds")) {
      out[k] = ctx?.lastContactIds || [];
    } else if (v === "from_previous_strategist" && k === "draftsRunId") {
      out[k] = ctx?.lastStrategistRunId;
    } else {
      out[k] = v;
    }
  }
  return out;
}

function computeNextRun(frequency: string, hourUtc: number, dayOfWeek?: number, dayOfMonth?: number): Date {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hourUtc, 0, 0));
  if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
  if (frequency === "daily") return next;
  if (frequency === "weekly" && dayOfWeek !== undefined) {
    const diff = (dayOfWeek - next.getUTCDay() + 7) % 7;
    next.setUTCDate(next.getUTCDate() + diff);
    if (next <= now) next.setUTCDate(next.getUTCDate() + 7);
    return next;
  }
  if (frequency === "monthly" && dayOfMonth !== undefined) {
    next.setUTCDate(dayOfMonth);
    if (next <= now) next.setUTCMonth(next.getUTCMonth() + 1);
    return next;
  }
  return next;
}

async function startMission(missionRow: any) {
  const planResp = await callAgent("/api/agents/orchestrator", missionRow.owner_id, {
    action: "plan",
    goal: missionRow.goal,
    context: { source: "cron", missionRowId: missionRow.id },
  });

  await supabaseAdmin
    .from("marketing_agent_runs")
    .update({
      input: {
        plan: planResp.plan,
        cursor: 0,
        context: { lastContactIds: [], lastStrategistRunId: null },
        step_state: {},
        source: "cron",
        marketing_mission_id: missionRow.id,
      },
    })
    .eq("id", planResp.runId);

  const next_run_at = computeNextRun(missionRow.frequency, missionRow.hour_utc, missionRow.day_of_week ?? undefined, missionRow.day_of_month ?? undefined);
  await supabaseAdmin
    .from("marketing_missions")
    .update({
      last_run_at: new Date().toISOString(),
      next_run_at: missionRow.frequency === "manual" ? null : next_run_at.toISOString(),
      last_run_status: "running",
    })
    .eq("id", missionRow.id);

  return planResp.missionId;
}

async function advanceRun(runRow: any, deadline: number): Promise<{ status: string; advanced: number }> {
  let advanced = 0;
  const ownerId = runRow.owner_id;
  let state: RunState = (runRow.input as RunState) || {};
  const plan = state.plan;
  if (!plan || !Array.isArray(plan.steps)) {
    return { status: "no_plan", advanced };
  }
  let cursor = state.cursor ?? 0;
  let context = state.context || { lastContactIds: [], lastStrategistRunId: null };
  let stepState = state.step_state || {};

  while (cursor < plan.steps.length && Date.now() < deadline) {
    const step = plan.steps[cursor];
    const params = resolvePlaceholders(step.params, context);

    try {
      if (step.agent === "lead-hunter") {
        const hunterRunId = (stepState as any).leadHunterRunId;
        if (!hunterRunId) {
          const start = await callAgent("/api/agents/lead-hunter", ownerId, {
            action: "start",
            missionId: runRow.mission_id,
            goal: plan.summary,
            ...params,
          });
          stepState = { ...stepState, leadHunterRunId: start.runId };
          await persistState(runRow.id, plan, cursor, context, stepState);
        }
        // Poll until done or deadline
        while (Date.now() < deadline) {
          await new Promise(r => setTimeout(r, 5000));
          const poll = await callAgent("/api/agents/lead-hunter", ownerId, {
            action: "poll",
            runId: (stepState as any).leadHunterRunId,
          });
          if (poll.status === "succeeded") {
            context = { ...context, lastContactIds: poll.newContactIds || [] };
            stepState = {};
            cursor++;
            advanced++;
            break;
          }
          if (poll.status === "failed") throw new Error("lead-hunter failed");
          // still running, loop back
        }
        if ((stepState as any).leadHunterRunId) {
          // Hit deadline mid-poll, persist and exit
          await persistState(runRow.id, plan, cursor, context, stepState);
          return { status: "running", advanced };
        }
      } else if (step.agent === "lead-enricher") {
        const result = await callAgent("/api/agents/lead-enricher", ownerId, { missionId: runRow.mission_id, goal: plan.summary, ...params });
        if (Array.isArray(result.enrichedIds) && result.enrichedIds.length > 0) {
          context = { ...context, lastContactIds: result.enrichedIds };
        }
        stepState = {};
        cursor++;
        advanced++;
      } else if (step.agent === "outreach-strategist") {
        const result = await callAgent("/api/agents/outreach-strategist", ownerId, { missionId: runRow.mission_id, goal: plan.summary, ...params });
        context = { ...context, lastStrategistRunId: result.runId };
        stepState = {};
        cursor++;
        advanced++;
      } else if (step.agent === "campaign-manager") {
        const cmParams: any = { missionId: runRow.mission_id, goal: plan.summary, ...params };
        if (cmParams.draftsRunId === undefined && context.lastStrategistRunId) cmParams.draftsRunId = context.lastStrategistRunId;
        await callAgent("/api/agents/campaign-manager", ownerId, cmParams);
        stepState = {};
        cursor++;
        advanced++;
      } else {
        throw new Error(`Unknown agent: ${step.agent}`);
      }
      await persistState(runRow.id, plan, cursor, context, stepState);
    } catch (err: any) {
      await callAgent("/api/agents/orchestrator", ownerId, {
        action: "complete",
        missionId: runRow.mission_id,
        status: "failed",
        error: err.message,
        summary: { failedAt: step.agent, cursor },
      });
      if ((state as any).marketing_mission_id) {
        await supabaseAdmin
          .from("marketing_missions")
          .update({ last_run_status: "failed" })
          .eq("id", (state as any).marketing_mission_id);
      }
      return { status: "failed", advanced };
    }
  }

  if (cursor >= plan.steps.length) {
    await callAgent("/api/agents/orchestrator", ownerId, {
      action: "complete",
      missionId: runRow.mission_id,
      status: "succeeded",
      summary: { finalContactIds: context.lastContactIds, lastStrategistRunId: context.lastStrategistRunId },
    });
    const missionId = (state as any).marketing_mission_id;
    if (missionId) {
      await supabaseAdmin
        .from("marketing_missions")
        .update({ last_run_status: "succeeded" })
        .eq("id", missionId);
    }
    return { status: "succeeded", advanced };
  }

  return { status: "running", advanced };
}

async function persistState(runId: string, plan: any, cursor: number, context: any, stepState: any) {
  const { data: row } = await supabaseAdmin
    .from("marketing_agent_runs")
    .select("input")
    .eq("id", runId)
    .single();
  const merged = { ...(row?.input || {}), plan, cursor, context, step_state: stepState };
  await supabaseAdmin.from("marketing_agent_runs").update({ input: merged }).eq("id", runId);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isCron = isCronRequest(req);
  const isManual = req.headers["x-internal-trigger"] === INTERNAL_KEY && INTERNAL_KEY;
  if (!isCron && !isManual) return res.status(401).json({ error: "Unauthorized" });

  const startedAt = Date.now();
  const deadline = startedAt + 50_000; // leave 10s buffer under 60s maxDuration

  try {
    // 1. Start any due missions
    const { data: dueMissions } = await supabaseAdmin
      .from("marketing_missions")
      .select("*")
      .eq("enabled", true)
      .neq("frequency", "manual")
      .lte("next_run_at", new Date().toISOString());

    const started: string[] = [];
    for (const m of dueMissions || []) {
      try {
        const mid = await startMission(m);
        started.push(mid);
      } catch (e: any) {
        console.error("startMission failed for", m.id, e.message);
      }
    }

    // 2. Advance any in-progress orchestrator runs
    const { data: inflight } = await supabaseAdmin
      .from("marketing_agent_runs")
      .select("*")
      .eq("agent_name", "marketing-orchestrator")
      .eq("status", "running")
      .order("created_at", { ascending: true })
      .limit(20);

    const advanced: any[] = [];
    for (const run of inflight || []) {
      if (Date.now() >= deadline) break;
      const result = await advanceRun(run, deadline);
      advanced.push({ runId: run.id, ...result });
    }

    return res.status(200).json({
      durationMs: Date.now() - startedAt,
      started,
      advanced,
      remaining: (inflight?.length || 0) - advanced.length,
    });
  } catch (err: any) {
    console.error("dispatcher error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
