import type { VercelRequest } from "@vercel/node";
import { supabaseAdmin } from "./supabase-admin.js";

export async function getOwnerIdFromRequest(req: VercelRequest): Promise<string | null> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
}
