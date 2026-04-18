import { supabaseAdmin } from "./supabase-admin.js";

export type AgentName =
  | "marketing-orchestrator"
  | "lead-hunter"
  | "lead-enricher"
  | "outreach-strategist"
  | "campaign-manager";

export interface StartRunInput {
  ownerId: string;
  missionId?: string | null;
  parentRunId?: string | null;
  agentName: AgentName;
  goal?: string;
  task: string;
  input?: Record<string, unknown>;
}

export async function startRun(i: StartRunInput): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("marketing_agent_runs")
    .insert({
      owner_id: i.ownerId,
      mission_id: i.missionId ?? null,
      parent_run_id: i.parentRunId ?? null,
      agent_name: i.agentName,
      status: "running",
      goal: i.goal ?? "",
      task: i.task,
      input: i.input ?? {},
    })
    .select("id")
    .single();
  if (error) throw new Error(`startRun failed: ${error.message}`);
  return data.id as string;
}

export interface CompleteRunInput {
  runId: string;
  status?: "succeeded" | "failed";
  output?: Record<string, unknown>;
  affectedTable?: string;
  affectedCount?: number;
  error?: string;
}

export async function completeRun(i: CompleteRunInput): Promise<void> {
  const { error } = await supabaseAdmin
    .from("marketing_agent_runs")
    .update({
      status: i.status ?? "succeeded",
      output: i.output ?? {},
      affected_table: i.affectedTable ?? null,
      affected_count: i.affectedCount ?? 0,
      error: i.error ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", i.runId);
  if (error) throw new Error(`completeRun failed: ${error.message}`);
}

export async function failRun(runId: string, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  await completeRun({ runId, status: "failed", error: message });
}
