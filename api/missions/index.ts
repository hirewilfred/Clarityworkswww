import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";

interface SavePayload {
  id?: string;
  name: string;
  goal: string;
  frequency?: "manual" | "daily" | "weekly" | "monthly";
  hour_utc?: number;
  day_of_week?: number;
  day_of_month?: number;
  enabled?: boolean;
}

function computeNextRun(frequency: string, hourUtc: number, dayOfWeek?: number, dayOfMonth?: number): Date | null {
  if (frequency === "manual") return null;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("marketing_missions")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ missions: data });
  }

  if (req.method === "POST" || req.method === "PUT") {
    const body = req.body as SavePayload;
    if (!body.name || !body.goal) return res.status(400).json({ error: "name and goal required" });
    const frequency = body.frequency || "manual";
    const hour_utc = body.hour_utc ?? 13;
    const next_run_at = computeNextRun(frequency, hour_utc, body.day_of_week, body.day_of_month);

    const payload: any = {
      owner_id: ownerId,
      name: body.name,
      goal: body.goal,
      frequency,
      hour_utc,
      day_of_week: body.day_of_week ?? null,
      day_of_month: body.day_of_month ?? null,
      enabled: body.enabled ?? true,
      next_run_at: next_run_at?.toISOString() ?? null,
      updated_at: new Date().toISOString(),
    };

    if (body.id) {
      const { data, error } = await supabaseAdmin
        .from("marketing_missions")
        .update(payload)
        .eq("id", body.id)
        .eq("owner_id", ownerId)
        .select()
        .single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ mission: data });
    }

    const { data, error } = await supabaseAdmin
      .from("marketing_missions")
      .insert(payload)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ mission: data });
  }

  if (req.method === "DELETE") {
    const id = (req.query.id as string) || (req.body as any)?.id;
    if (!id) return res.status(400).json({ error: "id required" });
    const { error } = await supabaseAdmin
      .from("marketing_missions")
      .delete()
      .eq("id", id)
      .eq("owner_id", ownerId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
