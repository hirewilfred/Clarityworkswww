-- Blog Posts Table Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/hpriqujsgrgqqfxhfsix/sql

-- 1. Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'Agentic AI',
  author TEXT NOT NULL DEFAULT 'ClarityWorks Studio',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Public read access for published posts (no auth required)
CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- 4. Admins can do everything
CREATE POLICY "Admins can manage all posts"
  ON blog_posts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 5. Seed 3 cornerstone articles
INSERT INTO blog_posts (slug, title, excerpt, content, cover_image, category, author, published, published_at) VALUES
(
  'what-is-agentic-ai',
  'What Is Agentic AI? A Complete Guide for Business Leaders',
  'Agentic AI represents a fundamental shift in how artificial intelligence operates—moving from passive tools that wait for instructions to autonomous systems that can reason, plan, and take action on their own.',
  '<h2>What Is Agentic AI?</h2>
<p>Agentic AI refers to artificial intelligence systems that can <strong>autonomously perceive their environment, make decisions, and take actions</strong> to achieve specific goals—without requiring step-by-step human instructions. Unlike traditional AI tools that respond only when prompted, agentic AI systems operate with a degree of independence, reasoning through complex tasks the way a skilled employee would.</p>

<h2>How Does Agentic AI Differ from Traditional AI?</h2>
<p>Traditional AI—like basic chatbots or rule-based automation—follows rigid instructions. You ask a question, it gives an answer. You set a rule, it follows it. There is no reasoning, no adaptation, no judgment.</p>
<p>Agentic AI is fundamentally different. These systems can:</p>
<ul>
<li><strong>Observe</strong> their environment and gather context</li>
<li><strong>Reason</strong> about what needs to happen next</li>
<li><strong>Plan</strong> multi-step approaches to complex problems</li>
<li><strong>Act</strong> by using tools, calling APIs, and executing tasks</li>
<li><strong>Learn</strong> from outcomes and adjust their approach</li>
</ul>
<p>Think of it this way: traditional AI is like a calculator—powerful but passive. Agentic AI is like a junior analyst who can research, synthesize, and deliver recommendations while knowing when to escalate to a human.</p>

<h2>Real-World Examples of Agentic AI</h2>
<p>Agentic AI is already transforming how organizations operate across industries:</p>
<ul>
<li><strong>Customer Support:</strong> AI agents that triage tickets, resolve tier-1 issues autonomously, and escalate complex cases with full context to human agents</li>
<li><strong>Sales Operations:</strong> Agents that research prospects, personalize outreach, update CRM records, and schedule follow-ups—all without manual intervention</li>
<li><strong>IT Operations:</strong> Systems that monitor infrastructure, detect anomalies, run diagnostic playbooks, and remediate issues before they impact users</li>
<li><strong>Finance:</strong> Agents that process invoices, reconcile accounts, flag discrepancies, and generate reports on schedule</li>
</ul>

<h2>Why Should Business Leaders Care?</h2>
<p>The shift to agentic AI is not incremental—it is structural. Organizations that adopt agentic AI effectively will:</p>
<ul>
<li>Reduce operational costs by 20-40% on repetitive workflows</li>
<li>Free their best people to focus on strategy, creativity, and relationship-building</li>
<li>Scale operations without proportionally scaling headcount</li>
<li>Respond to market changes faster than competitors relying on manual processes</li>
</ul>
<p>The question is no longer whether AI will change your business—it is whether you will lead that change or react to it.</p>

<h2>Getting Started</h2>
<p>Adopting agentic AI does not mean replacing your team. It means redesigning workflows so that humans and AI agents collaborate effectively. The key is starting with a clear strategy: identify the right use cases, define boundaries for agent autonomy, and build governance frameworks that ensure responsible deployment.</p>
<p>At ClarityWorks Studio, we help organizations navigate this transition with clarity and discipline—strategy before tools, people before automation.</p>',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  'Agentic AI',
  'ClarityWorks Studio',
  true,
  NOW()
),
(
  'agentic-ai-vs-traditional-automation',
  'Agentic AI vs Traditional Automation: What''s the Difference?',
  'Understanding the critical differences between rule-based automation and autonomous AI agents—and why it matters for your organization''s future.',
  '<h2>The Automation Spectrum</h2>
<p>Not all automation is created equal. When business leaders hear "AI automation," they often picture simple if-then workflows—email auto-responders, scheduled reports, or Zapier integrations. These are valuable, but they represent only one end of a much broader spectrum.</p>
<p>On the other end sits <strong>agentic AI</strong>: autonomous systems that can reason, adapt, and handle ambiguity. Understanding where your organization sits on this spectrum—and where it should be heading—is critical for making smart technology investments.</p>

<h2>Traditional Automation: Rules and Triggers</h2>
<p>Traditional automation (RPA, workflow tools, basic bots) operates on a simple principle: <strong>if X happens, do Y.</strong></p>
<ul>
<li>A form submission triggers an email</li>
<li>A new row in a spreadsheet triggers a notification</li>
<li>A scheduled job runs a report every Monday at 9am</li>
</ul>
<p>This works beautifully for predictable, repetitive tasks with clear inputs and outputs. But it breaks down when:</p>
<ul>
<li>The input is ambiguous or unstructured</li>
<li>The process requires judgment or context</li>
<li>Edge cases arise that were not pre-programmed</li>
<li>The workflow needs to adapt based on outcomes</li>
</ul>

<h2>Agentic AI: Reasoning and Autonomy</h2>
<p>Agentic AI systems do not follow scripts. They <strong>reason about goals</strong> and figure out how to achieve them. An agentic AI agent can:</p>
<ul>
<li>Read an unstructured email and determine the appropriate action</li>
<li>Research multiple data sources to answer a complex question</li>
<li>Decide between several approaches based on context</li>
<li>Recover from errors by trying alternative strategies</li>
<li>Know when to escalate to a human instead of proceeding</li>
</ul>

<h2>Side-by-Side Comparison</h2>
<table>
<thead><tr><th>Capability</th><th>Traditional Automation</th><th>Agentic AI</th></tr></thead>
<tbody>
<tr><td>Decision Making</td><td>Pre-programmed rules</td><td>Dynamic reasoning</td></tr>
<tr><td>Input Handling</td><td>Structured data only</td><td>Structured + unstructured</td></tr>
<tr><td>Error Recovery</td><td>Fails or stops</td><td>Adapts and retries</td></tr>
<tr><td>Scalability</td><td>Linear (more rules = more maintenance)</td><td>Compounding (agents learn patterns)</td></tr>
<tr><td>Setup Complexity</td><td>Low (drag-and-drop)</td><td>Medium (requires strategy)</td></tr>
<tr><td>Best For</td><td>Simple, repetitive tasks</td><td>Complex, judgment-heavy workflows</td></tr>
</tbody>
</table>

<h2>When to Use Which</h2>
<p><strong>Use traditional automation</strong> when the task is predictable, the inputs are structured, and the rules never change. Email routing, data entry, scheduled reports—these are perfect candidates.</p>
<p><strong>Use agentic AI</strong> when the task requires interpretation, judgment, or multi-step reasoning. Customer support triage, sales research, document analysis, operational decision-making—these benefit enormously from agentic capabilities.</p>
<p>The smartest organizations use both. They automate the simple stuff with rules and deploy agentic AI where human judgment was previously the bottleneck.</p>

<h2>The Strategic Implications</h2>
<p>Organizations that only invest in traditional automation will hit a ceiling. They will automate the easy 20% and leave the complex 80% untouched. Agentic AI breaks through that ceiling by tackling the workflows that were previously "too complex to automate."</p>
<p>The key is not choosing one over the other—it is knowing which tool fits which problem. That is where strategy matters.</p>',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
  'Agentic AI',
  'ClarityWorks Studio',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'evaluate-ai-readiness',
  'How to Evaluate Your Organization''s AI Readiness',
  'A practical framework for assessing whether your organization is prepared to adopt agentic AI—covering people, processes, data, and governance.',
  '<h2>Why AI Readiness Matters</h2>
<p>Every organization wants to adopt AI. Few are actually ready for it. The gap between enthusiasm and readiness is where most AI initiatives fail—not because the technology does not work, but because the organization was not prepared to absorb it.</p>
<p>AI readiness is not about having the latest tools. It is about having the <strong>right workflows, data practices, team skills, and governance structures</strong> in place to make AI adoption successful and sustainable.</p>

<h2>The Four Pillars of AI Readiness</h2>

<h3>1. Process Readiness</h3>
<p>Before deploying AI agents, you need to understand your current workflows in detail:</p>
<ul>
<li>Which processes are well-documented vs. tribal knowledge?</li>
<li>Where are the bottlenecks and manual handoffs?</li>
<li>Which tasks require judgment vs. which are purely mechanical?</li>
<li>How much time do skilled employees spend on repetitive work?</li>
</ul>
<p><strong>Key indicator:</strong> If you cannot draw your core workflows on a whiteboard, you are not ready to automate them.</p>

<h3>2. Data Readiness</h3>
<p>AI agents need access to reliable, organized data to function effectively:</p>
<ul>
<li>Is your data centralized or scattered across disconnected systems?</li>
<li>Do you have consistent naming conventions and data formats?</li>
<li>Are your knowledge bases current and accurate?</li>
<li>Can systems communicate with each other via APIs?</li>
</ul>
<p><strong>Key indicator:</strong> If your team spends significant time searching for information or reconciling data across systems, your data infrastructure needs work before AI can help.</p>

<h3>3. People Readiness</h3>
<p>Technology adoption is fundamentally a people challenge:</p>
<ul>
<li>Does leadership understand what AI can and cannot do?</li>
<li>Are teams open to changing how they work?</li>
<li>Do you have internal champions who can drive adoption?</li>
<li>Is there a training plan for working alongside AI agents?</li>
</ul>
<p><strong>Key indicator:</strong> If leadership treats AI as a cost-cutting tool rather than a capability amplifier, adoption will face resistance.</p>

<h3>4. Governance Readiness</h3>
<p>Deploying autonomous AI without governance is a risk you cannot afford:</p>
<ul>
<li>Do you have policies for AI usage and data access?</li>
<li>Are there clear boundaries for what AI can and cannot do?</li>
<li>Who is accountable when an AI agent makes a mistake?</li>
<li>How do you ensure compliance with industry regulations?</li>
</ul>
<p><strong>Key indicator:</strong> If you cannot answer "who is responsible when the AI gets it wrong," you need governance before deployment.</p>

<h2>Scoring Your Readiness</h2>
<p>Rate your organization on each pillar from 1 (not ready) to 5 (fully ready):</p>
<ul>
<li><strong>16-20:</strong> Ready for agentic AI deployment</li>
<li><strong>11-15:</strong> Ready for targeted pilots with preparation</li>
<li><strong>6-10:</strong> Foundation work needed before AI adoption</li>
<li><strong>4-5:</strong> Significant organizational change required first</li>
</ul>

<h2>Next Steps</h2>
<p>Regardless of your score, the path forward starts with clarity. Understand where you are, identify the gaps, and build a realistic roadmap. The organizations that succeed with AI are not the ones that move fastest—they are the ones that move most deliberately.</p>
<p>At ClarityWorks Studio, our AI Readiness Assessment gives you a detailed scorecard across all four pillars, with prioritized recommendations for closing the gaps. It is the first step toward adopting AI with confidence.</p>',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
  'Strategy',
  'ClarityWorks Studio',
  true,
  NOW() - INTERVAL '5 days'
);
