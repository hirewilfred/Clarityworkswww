-- Blog Proposals — Scheduler inserts topic proposals; admins approve/reject via UI
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql

CREATE TABLE IF NOT EXISTS public.blog_proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    suggested_image TEXT,
    queue_position INTEGER,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    proposed_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_proposals_status ON public.blog_proposals (status, proposed_at DESC);

ALTER TABLE public.blog_proposals ENABLE ROW LEVEL SECURITY;

-- Admins can manage all proposals; the scheduler inserts via service role key (bypasses RLS)
CREATE POLICY "Admins manage blog_proposals"
    ON public.blog_proposals FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
