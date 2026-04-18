-- Saved missions for cron-based and Telegram-triggered execution
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.marketing_missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT NOT NULL,
    frequency TEXT NOT NULL DEFAULT 'manual' CHECK (frequency IN ('manual','daily','weekly','monthly')),
    hour_utc INTEGER DEFAULT 13 CHECK (hour_utc >= 0 AND hour_utc <= 23),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 28),
    enabled BOOLEAN DEFAULT true,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    last_run_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_missions_owner ON public.marketing_missions (owner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_missions_due ON public.marketing_missions (enabled, next_run_at);

ALTER TABLE public.marketing_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own marketing_missions"
    ON public.marketing_missions FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Telegram bot config per user (chat_id is whitelisted recipient)
CREATE TABLE IF NOT EXISTS public.telegram_configs (
    owner_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    bot_token TEXT NOT NULL,
    chat_id TEXT NOT NULL,
    webhook_secret TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.telegram_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own telegram_configs"
    ON public.telegram_configs FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);
