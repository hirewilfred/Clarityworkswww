-- Auto-followup scheduler: track when a contact has replied so we don't keep
-- pestering them, and index activities by due_date for the cron release pass.

ALTER TABLE public.crm_activities ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE public.crm_activities ADD COLUMN IF NOT EXISTS reply_thread_id TEXT;

CREATE INDEX IF NOT EXISTS idx_crm_activities_due
    ON public.crm_activities (owner_id, type, completed, due_date)
    WHERE completed = false AND due_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_crm_activities_reply_polling
    ON public.crm_activities (owner_id, gmail_thread_id, replied_at)
    WHERE completed = true AND gmail_thread_id IS NOT NULL AND replied_at IS NULL;
