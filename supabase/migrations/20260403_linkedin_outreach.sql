-- LinkedIn Outreach Pipeline Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql

-- 1. LinkedIn Campaigns table
CREATE TABLE IF NOT EXISTS public.linkedin_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    connection_message TEXT DEFAULT '',
    followup_1 TEXT DEFAULT '',
    followup_1_delay_days INTEGER DEFAULT 2,
    followup_2 TEXT DEFAULT '',
    followup_2_delay_days INTEGER DEFAULT 3,
    leads_count INTEGER DEFAULT 0,
    connected_count INTEGER DEFAULT 0,
    replied_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LinkedIn Leads table
CREATE TABLE IF NOT EXISTS public.linkedin_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    title TEXT DEFAULT '',
    company TEXT DEFAULT '',
    location TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    headline TEXT DEFAULT '',
    profile_image_url TEXT DEFAULT '',
    industry TEXT DEFAULT '',
    connections INTEGER DEFAULT 0,
    stage TEXT NOT NULL DEFAULT 'scraped' CHECK (stage IN ('scraped', 'enriched', 'connect_sent', 'connected', 'message_sent', 'replied', 'converted')),
    campaign_id UUID REFERENCES public.linkedin_campaigns(id) ON DELETE SET NULL,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Unique constraint to prevent duplicate scrapes per user
CREATE UNIQUE INDEX IF NOT EXISTS linkedin_leads_owner_url_unique
    ON public.linkedin_leads (owner_id, linkedin_url)
    WHERE linkedin_url IS NOT NULL AND linkedin_url != '';

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_owner ON public.linkedin_leads (owner_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_stage ON public.linkedin_leads (stage);
CREATE INDEX IF NOT EXISTS idx_linkedin_leads_campaign ON public.linkedin_leads (campaign_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_campaigns_owner ON public.linkedin_campaigns (owner_id);

-- 5. Enable RLS
ALTER TABLE public.linkedin_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_campaigns ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies — users can only access their own data
CREATE POLICY "Users can view own linkedin_leads"
    ON public.linkedin_leads FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own linkedin_leads"
    ON public.linkedin_leads FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own linkedin_leads"
    ON public.linkedin_leads FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own linkedin_leads"
    ON public.linkedin_leads FOR DELETE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can view own linkedin_campaigns"
    ON public.linkedin_campaigns FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own linkedin_campaigns"
    ON public.linkedin_campaigns FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own linkedin_campaigns"
    ON public.linkedin_campaigns FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own linkedin_campaigns"
    ON public.linkedin_campaigns FOR DELETE
    USING (auth.uid() = owner_id);
