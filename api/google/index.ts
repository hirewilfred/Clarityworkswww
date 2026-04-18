import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";
import { createHmac } from "node:crypto";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const BASE_URL = process.env.PUBLIC_BASE_URL || "https://clarityworksstudio.com";
const REDIRECT_URI = `${BASE_URL}/api/google`;
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
];

function signState(ownerId: string): string {
  const sig = createHmac("sha256", process.env.INTERNAL_API_KEY || "fallback")
    .update(ownerId)
    .digest("hex")
    .slice(0, 32);
  return `${ownerId}.${sig}`;
}

function verifyState(state: string): string | null {
  const [ownerId, sig] = state.split(".");
  if (!ownerId || !sig) return null;
  const expected = createHmac("sha256", process.env.INTERNAL_API_KEY || "fallback")
    .update(ownerId)
    .digest("hex")
    .slice(0, 32);
  return sig === expected ? ownerId : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // OAuth callback (Google redirects here with ?code=...&state=...)
  if (req.method === "GET" && req.query.code) {
    const code = req.query.code as string;
    const state = (req.query.state as string) || "";
    const ownerId = verifyState(state);
    if (!ownerId) {
      res.setHeader("Location", "/admin?googleError=invalid_state");
      return res.status(302).end();
    }

    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      });
      const tokens = await tokenRes.json();
      if (!tokens.refresh_token) {
        res.setHeader("Location", `/admin?googleError=${encodeURIComponent("No refresh token. Revoke at myaccount.google.com/permissions and reconnect.")}`);
        return res.status(302).end();
      }

      let email = "";
      try {
        const ui = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }).then(r => r.json());
        email = ui.email || "";
      } catch {}

      await supabaseAdmin
        .from("google_configs")
        .upsert({
          owner_id: ownerId,
          refresh_token: tokens.refresh_token,
          email_address: email,
          scopes: SCOPES.join(" "),
          connected_at: new Date().toISOString(),
        }, { onConflict: "owner_id" });

      res.setHeader("Location", "/admin?googleConnected=1");
      return res.status(302).end();
    } catch (err: any) {
      res.setHeader("Location", `/admin?googleError=${encodeURIComponent(err.message)}`);
      return res.status(302).end();
    }
  }

  // OAuth error from Google
  if (req.method === "GET" && req.query.error) {
    res.setHeader("Location", `/admin?googleError=${encodeURIComponent(String(req.query.error))}`);
    return res.status(302).end();
  }

  // Status (current user's connection info)
  if (req.method === "GET") {
    const ownerId = await getOwnerIdFromRequest(req);
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    const { data } = await supabaseAdmin
      .from("google_configs")
      .select("email_address, connected_at, last_send_at")
      .eq("owner_id", ownerId)
      .maybeSingle();
    return res.status(200).json({ config: data });
  }

  // Initiate OAuth: returns the redirect URL
  if (req.method === "POST") {
    const ownerId = await getOwnerIdFromRequest(req);
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: "GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not configured on Vercel" });
    }
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("redirect_uri", REDIRECT_URI);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", SCOPES.join(" "));
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent");
    url.searchParams.set("state", signState(ownerId));
    return res.status(200).json({ url: url.toString() });
  }

  // Disconnect
  if (req.method === "DELETE") {
    const ownerId = await getOwnerIdFromRequest(req);
    if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
    const { data: cfg } = await supabaseAdmin
      .from("google_configs")
      .select("refresh_token")
      .eq("owner_id", ownerId)
      .maybeSingle();
    if (cfg?.refresh_token) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(cfg.refresh_token)}`, { method: "POST" });
      } catch {}
    }
    await supabaseAdmin.from("google_configs").delete().eq("owner_id", ownerId);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
