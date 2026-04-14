-- Archive Column Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql
-- This adds an `archived` flag so posts can be hidden from the main listing
-- while remaining publicly accessible at their URLs for SEO.

-- 1. Add the archived column (defaults to false so all existing posts are unaffected)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- 2. Update the public read policy to allow reading archived posts by direct URL
--    (the frontend Blog listing filters archived=false; BlogPost page loads by slug only)
--    No policy change needed — archived posts are still published=true, so they remain readable.

-- To archive a post (hides from listing, keeps URL live):
--   UPDATE blog_posts SET archived = true WHERE slug = 'your-post-slug';

-- To restore an archived post to the listing:
--   UPDATE blog_posts SET archived = false WHERE slug = 'your-post-slug';
