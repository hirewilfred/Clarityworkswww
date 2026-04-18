import type { VercelRequest } from "@vercel/node";
import { supabaseAdmin } from "./supabase-admin.js";

export async function getOwnerIdFromRequest(req: VercelRequest): Promise<string | null> {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);

  // Internal server-to-server (cron dispatcher, telegram webhook)
  const internalKey = process.env.INTERNAL_API_KEY;
  if (internalKey && token === internalKey) {
    const ownerId = (req.headers["x-owner-id"] || req.headers["X-Owner-Id"]) as string | undefined;
    return ownerId || null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
}

export function isCronRequest(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization;
  return auth === `Bearer ${secret}`;
}
