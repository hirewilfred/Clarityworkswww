# ClarityWorks Studio — Claude Code Instructions

## Blog Content Scheduler

Run this workflow when asked to schedule or propose the next blog topic.

### Topic Queue (in order)
1. SaaS Is Dead: How Agent-as-a-Service Is Replacing Software Subscriptions
2. Multi-Model Routing: Why Smart Businesses Never Rely on a Single AI Provider
3. 6 Principles for Building AI Agents That Actually Work in Production
4. MCP and A2A: The Two Protocols Reshaping How AI Agents Communicate
5. AI Agent Micropayments: How Billing Infrastructure Must Change for Autonomous Systems
6. Agentic Process Automation: Why SOPs Beat Full Autonomy
7. Data Quality Is the Bottleneck: Semantic Layers and Knowledge Graphs for AI Agents
8. NVIDIA's Play for the Agent Economy: Infrastructure for the AaaS Era
9. AI Agent Governance: Where Human Oversight Still Matters Most
10. How to Monetize AI Agents: Platforms, Pricing Models, and Revenue Strategies

### Suggested Cover Image Filenames (one per post, drop into /public/images/)
1. blog_saas.png ✅
2. blog_routing.png ✅
3. blog_principles.png ✅
4. blog_mcp.png ✅
5. blog_billing.png ✅
6. blog_sops.png ✅
7. blog_data_quality.png ✅
8. blog_nvidia.png ✅
9. blog_governance.png ✅
10. blog_monetize.png ✅

### Steps

1. **Query published posts** to find what is already live:
   ```bash
   curl -s 'https://hpriqujsgrgqqfxhfsix.supabase.co/rest/v1/blog_posts?select=title,slug,published&published=eq.true' \
     -H 'apikey: $SUPABASE_SERVICE_KEY' \
     -H 'Authorization: Bearer $SUPABASE_SERVICE_KEY'
   ```

2. **Check for pending proposals** so we don't duplicate one already awaiting approval:
   ```bash
   curl -s 'https://hpriqujsgrgqqfxhfsix.supabase.co/rest/v1/blog_proposals?select=topic_title,status&status=eq.pending' \
     -H 'apikey: $SUPABASE_SERVICE_KEY' \
     -H 'Authorization: Bearer $SUPABASE_SERVICE_KEY'
   ```

3. **Find the next topic** — the first item in the queue above that has no matching published post AND no matching pending proposal (compare by title similarity).

4. **If all 10 are published or pending**, insert a special proposal noting the queue is empty:
   ```bash
   curl -s -X POST 'https://hpriqujsgrgqqfxhfsix.supabase.co/rest/v1/blog_proposals' \
     -H 'apikey: $SUPABASE_SERVICE_KEY' \
     -H 'Authorization: Bearer $SUPABASE_SERVICE_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"topic_title":"⚠️ Queue Empty — New Topics Needed","description":"All 10 topics in the queue have been published or are pending approval. Please add new topics to the queue in CLAUDE.md before the next publish cycle.","queue_position":0}'
   ```

5. **Otherwise**, insert a proposal for the next topic. Write a 2–3 sentence description based on the topic name, assign the suggested image filename, and set the queue position:
   ```bash
   curl -s -X POST 'https://hpriqujsgrgqqfxhfsix.supabase.co/rest/v1/blog_proposals' \
     -H 'apikey: $SUPABASE_SERVICE_KEY' \
     -H 'Authorization: Bearer $SUPABASE_SERVICE_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "topic_title": "<TITLE>",
       "description": "<2-3 sentence description>",
       "suggested_image": "<blog_xxx.png>",
       "queue_position": <N>
     }'
   ```

6. **Confirm** by reporting back: topic proposed, queue position, and image filename needed.

### After Approval
When Vince approves a proposal in the admin UI, a draft blog_post is automatically created. The content still needs to be written. 
**IMPORTANT**: Generate the image using your `generate_image` tool. Do not just create an SVG. Use the `generate_image` tool to create a high-quality PNG image for the blog post, and save it to `/public/images/blog_xxx.png` before publishing.

---

## Blog Archive

To hide a post from the main listing while keeping its URL live for SEO:
```bash
curl -s -X PATCH 'https://hpriqujsgrgqqfxhfsix.supabase.co/rest/v1/blog_posts?slug=eq.<slug>' \
  -H 'apikey: $SUPABASE_SERVICE_KEY' \
  -H 'Authorization: Bearer $SUPABASE_SERVICE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"archived": true}'
```
