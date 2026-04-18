import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";
import { randomBytes } from "node:crypto";

interface Body {
  botToken: string;
  chatId: string;
  enabled?: boolean;
}

const BASE_URL = process.env.PUBLIC_BASE_URL || "https://clarityworksstudio.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data } = await supabaseAdmin
      .from("telegram_configs")
      .select("chat_id, enabled, created_at")
      .eq("owner_id", ownerId)
      .maybeSingle();
    return res.status(200).json({ config: data });
  }

  if (req.method === "DELETE") {
    const { data: existing } = await supabaseAdmin
      .from("telegram_configs")
      .select("bot_token")
      .eq("owner_id", ownerId)
      .maybeSingle();
    if (existing?.bot_token) {
      try {
        await fetch(`https://api.telegram.org/bot${existing.bot_token}/deleteWebhook`, { method: "POST" });
      } catch {}
    }
    await supabaseAdmin.from("telegram_configs").delete().eq("owner_id", ownerId);
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body as Body;
  if (!body.botToken || !body.chatId) {
    return res.status(400).json({ error: "botToken and chatId required" });
  }

  const verify = await fetch(`https://api.telegram.org/bot${body.botToken}/getMe`);
  if (!verify.ok) {
    return res.status(400).json({ error: "Telegram rejected the bot token" });
  }
  const meJson = await verify.json();

  const webhookSecret = randomBytes(24).toString("hex");
  const webhookUrl = `${BASE_URL}/api/telegram/webhook`;

  const setRes = await fetch(`https://api.telegram.org/bot${body.botToken}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: webhookSecret,
      allowed_updates: ["message"],
    }),
  });
  if (!setRes.ok) {
    const errText = await setRes.text();
    return res.status(500).json({ error: `setWebhook failed: ${errText}` });
  }

  const { error: upsertErr } = await supabaseAdmin
    .from("telegram_configs")
    .upsert({
      owner_id: ownerId,
      bot_token: body.botToken,
      chat_id: body.chatId,
      webhook_secret: webhookSecret,
      enabled: body.enabled ?? true,
    }, { onConflict: "owner_id" });
  if (upsertErr) return res.status(500).json({ error: upsertErr.message });

  // Confirmation ping
  await fetch(`https://api.telegram.org/bot${body.botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: body.chatId,
      text: `✅ ClarityWorks Marketing OS connected. Send /help for commands.`,
    }),
  });

  return res.status(200).json({ ok: true, bot: meJson.result });
}
