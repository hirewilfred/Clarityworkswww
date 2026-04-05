-- CRM Pipeline Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql

-- ═══════════════════════════════════════════════════════════
-- 1. COMPANIES
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.crm_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT DEFAULT '',
    industry TEXT DEFAULT '',
    size TEXT DEFAULT '',
    location TEXT DEFAULT '',
    website TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- 2. CONTACTS
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
    linkedin_lead_id UUID REFERENCES public.linkedin_leads(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    title TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    location TEXT DEFAULT '',
    source TEXT DEFAULT 'manual',
    tags TEXT[] DEFAULT '{}',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- 3. DEALS (Sales Pipeline)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.crm_deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    value NUMERIC(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'CAD',
    stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    expected_close_date DATE,
    closed_at TIMESTAMPTZ,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- 4. ACTIVITIES (Notes, Calls, Emails, Meetings)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
    type TEXT NOT NULL DEFAULT 'note' CHECK (type IN ('note', 'call', 'email', 'meeting', 'linkedin', 'task')),
    subject TEXT DEFAULT '',
    body TEXT DEFAULT '',
    completed BOOLEAN DEFAULT false,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- 5. INDEXES
-- ═══════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_crm_companies_owner ON public.crm_companies (owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_owner ON public.crm_contacts (owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company ON public.crm_contacts (company_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_owner ON public.crm_deals (owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON public.crm_deals (stage);
CREATE INDEX IF NOT EXISTS idx_crm_deals_contact ON public.crm_deals (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_owner ON public.crm_activities (owner_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON public.crm_activities (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_deal ON public.crm_activities (deal_id);

-- ═══════════════════════════════════════════════════════════
-- 6. ENABLE RLS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════
-- 7. RLS POLICIES — each user sees only their own data
-- ═══════════════════════════════════════════════════════════

-- Companies
CREATE POLICY "Users manage own crm_companies" ON public.crm_companies FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Contacts
CREATE POLICY "Users manage own crm_contacts" ON public.crm_contacts FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Deals
CREATE POLICY "Users manage own crm_deals" ON public.crm_deals FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Activities
CREATE POLICY "Users manage own crm_activities" ON public.crm_activities FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
