import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_lib/supabase-admin.js";

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { username?: string; first_name?: string };
  };
}

async function sendTelegram(botToken: string, chatId: string | number, text: string, parseMode = "Markdown") {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secretFromHeader = req.headers["x-telegram-bot-api-secret-token"] as string | undefined;
  const secretFromQuery = req.query.secret as string | undefined;
  const secret = secretFromHeader || secretFromQuery;
  if (!secret) return res.status(401).json({ error: "Missing secret" });

  const { data: cfg, error: cfgErr } = await supabaseAdmin
    .from("telegram_configs")
    .select("*")
    .eq("webhook_secret", secret)
    .eq("enabled", true)
    .single();
  if (cfgErr || !cfg) return res.status(401).json({ error: "Invalid secret" });

  const update = req.body as TelegramUpdate;
  const msg = update.message;
  if (!msg || !msg.text) return res.status(200).json({ ok: true });

  // Whitelist: only the owner's chat_id is allowed
  if (String(msg.chat.id) !== cfg.chat_id) {
    await sendTelegram(cfg.bot_token, msg.chat.id, "Sorry, this bot only responds to its owner.");
    return res.status(200).json({ ok: true });
  }

  const text = msg.text.trim();
  const ownerId = cfg.owner_id;
  const botToken = cfg.bot_token;
  const chatId = cfg.chat_id;

  try {
    if (text.startsWith("/start") || text.startsWith("/help")) {
      await sendTelegram(botToken, chatId, [
        "*ClarityWorks Marketing OS*",
        "",
        "Commands:",
        "`/missions` — list saved missions",
        "`/run <name>` — trigger a saved mission now",
        "`/status` — recent run summary",
        "",
        "Or just send a goal as plain text and the orchestrator will plan it.",
      ].join("\n"));
      return res.status(200).json({ ok: true });
    }

    if (text === "/missions") {
      const { data: missions } = await supabaseAdmin
        .from("marketing_missions")
        .select("name, frequency, last_run_at, last_run_status, enabled")
        .eq("owner_id", ownerId)
        .order("name");
      const lines = (missions || []).map(m => {
        const flag = m.enabled ? "✅" : "⏸";
        const last = m.last_run_at ? `last ${new Date(m.last_run_at).toISOString().slice(0, 10)} (${m.last_run_status || "n/a"})` : "never run";
        return `${flag} *${m.name}* — ${m.frequency} — ${last}`;
      });
      await sendTelegram(botToken, chatId, lines.length > 0 ? lines.join("\n") : "No saved missions yet.");
      return res.status(200).json({ ok: true });
    }

    if (text.startsWith("/run ")) {
      const name = text.slice(5).trim();
      const { data: mission } = await supabaseAdmin
        .from("marketing_missions")
        .select("*")
        .eq("owner_id", ownerId)
        .ilike("name", name)
        .single();
      if (!mission) {
        await sendTelegram(botToken, chatId, `Couldn't find a mission named *${name}*.`);
        return res.status(200).json({ ok: true });
      }
      // Force it due so the next dispatcher run picks it up
      await supabaseAdmin
        .from("marketing_missions")
        .update({ next_run_at: new Date(Date.now() - 1000).toISOString(), enabled: true })
        .eq("id", mission.id);
      await sendTelegram(botToken, chatId, `Queued *${mission.name}*. The dispatcher will start it on the next cycle.`);
      return res.status(200).json({ ok: true });
    }

    if (text === "/status") {
      const { data: runs } = await supabaseAdmin
        .from("marketing_agent_runs")
        .select("agent_name, status, task, created_at")
        .eq("owner_id", ownerId)
        .order("created_at", { ascending: false })
        .limit(8);
      const lines = (runs || []).map(r => {
        const icon = r.status === "succeeded" ? "✅" : r.status === "failed" ? "❌" : "⏳";
        return `${icon} *${r.agent_name}* — ${r.task || "—"}`;
      });
      await sendTelegram(botToken, chatId, lines.length > 0 ? lines.join("\n") : "No runs yet.");
      return res.status(200).json({ ok: true });
    }

    // Free text — treat as ad-hoc mission
    const baseUrl = process.env.PUBLIC_BASE_URL || "https://clarityworksstudio.com";
    const planRes = await fetch(`${baseUrl}/api/agents/orchestrator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY || ""}`,
        "X-Owner-Id": ownerId,
      },
      body: JSON.stringify({ action: "plan", goal: text, context: { source: "telegram" } }),
    });
    const plan = await planRes.json();
    if (!planRes.ok) {
      await sendTelegram(botToken, chatId, `Plan failed: ${plan.error || "unknown error"}`);
      return res.status(200).json({ ok: true });
    }

    const stepLines = (plan.plan?.steps || []).map((s: any, i: number) => `${i + 1}. *${s.agent}* — ${s.rationale || ""}`).join("\n");
    await sendTelegram(botToken, chatId, `📋 *Plan:* ${plan.plan?.summary || ""}\n\n${stepLines}\n\n_Queued for execution. Run /status to check progress._`);

    // Inject plan into the orchestrator row so dispatcher can pick it up
    await supabaseAdmin
      .from("marketing_agent_runs")
      .update({
        input: {
          plan: plan.plan,
          cursor: 0,
          context: { lastContactIds: [], lastStrategistRunId: null },
          step_state: {},
          source: "telegram",
        },
      })
      .eq("id", plan.runId);

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("telegram webhook error:", err);
    try { await sendTelegram(botToken, chatId, `Error: ${err.message}`); } catch {}
    return res.status(200).json({ ok: true });
  }
}
