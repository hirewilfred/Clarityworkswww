-- Google OAuth tokens for Gmail send (and future read for reply tracking)
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.google_configs (
    owner_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    email_address TEXT NOT NULL,
    scopes TEXT NOT NULL DEFAULT '',
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_send_at TIMESTAMPTZ
);

ALTER TABLE public.google_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own google_configs"
    ON public.google_configs FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Add Gmail message ID column to crm_activities so we can link sends back to Gmail
ALTER TABLE public.crm_activities ADD COLUMN IF NOT EXISTS gmail_message_id TEXT;
ALTER TABLE public.crm_activities ADD COLUMN IF NOT EXISTS gmail_thread_id TEXT;
ALTER TABLE public.crm_activities ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
