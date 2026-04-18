import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!url || !serviceKey) {
  console.warn("supabase-admin: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export const SUPABASE_URL = url;
export const SUPABASE_SERVICE_KEY = serviceKey;
