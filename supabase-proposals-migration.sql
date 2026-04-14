-- Blog Proposals Table Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql
-- The scheduler inserts rows here instead of sending a Slack message.
-- The admin approves or rejects each proposal from the Blog tab in AdminPortal.

-- 1. Create the blog_proposals table
CREATE TABLE IF NOT EXISTS blog_proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_title TEXT NOT NULL,
  description TEXT NOT NULL,
  suggested_image TEXT,               -- e.g. "blog_sops.png"
  queue_position INT,                 -- position in the topic queue
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proposed_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- 2. Enable RLS
ALTER TABLE blog_proposals ENABLE ROW LEVEL SECURITY;

-- 3. Admins can read and update proposals via the UI
CREATE POLICY "Admins can manage proposals"
  ON blog_proposals FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Note: The scheduler uses the service-role key which bypasses RLS,
-- so INSERT from the scheduler will work without an additional policy.
