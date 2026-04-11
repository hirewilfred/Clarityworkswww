-- Marketing Agent Runs — Activity log for the Marketing OS
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql

CREATE TABLE IF NOT EXISTS public.marketing_agent_runs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mission_id UUID,
    parent_run_id UUID REFERENCES public.marketing_agent_runs(id) ON DELETE SET NULL,
    agent_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed')),
    goal TEXT DEFAULT '',
    task TEXT DEFAULT '',
    input JSONB DEFAULT '{}'::jsonb,
    output JSONB DEFAULT '{}'::jsonb,
    affected_table TEXT,
    affected_count INTEGER DEFAULT 0,
    error TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mar_runs_owner ON public.marketing_agent_runs (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mar_runs_mission ON public.marketing_agent_runs (mission_id);
CREATE INDEX IF NOT EXISTS idx_mar_runs_agent ON public.marketing_agent_runs (agent_name);
CREATE INDEX IF NOT EXISTS idx_mar_runs_status ON public.marketing_agent_runs (status);

ALTER TABLE public.marketing_agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own marketing_agent_runs"
    ON public.marketing_agent_runs FOR ALL
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);
