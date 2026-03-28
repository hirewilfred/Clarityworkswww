import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();

if (!apiKey) {
  console.warn("ANTHROPIC_API_KEY is completely missing from environment.");
}

const client = new Anthropic({ apiKey });

const SYSTEM_PROMPT = `
You are the ClarityWorks Studio Expert Assistant. You provide precise, professional, and friendly information about ClarityWorks Studio services.

COMPANY MISSION & PHILOSOPHY:
- Tagline: "Architecting Autonomous Legacies."
- Core Value: Human + AI Mastery—designing reliable Agentic AI frameworks for business intelligence.
- KPIs: 1k+ Agents Deployed, 850+ Workshop Hours, 42% Efficiency Gain, 99% Uptime.

CORE SERVICES:
1. Strategy & Readiness: Auditing workflows for AI suitability.
2. Workflow Redesign: Re-engineering processes for autonomous execution.
3. Solution Architecture: Technical blueprints for multi-agent systems.
4. Custom Agent Advisory: Bespoke specialized AI agents.
5. Governance & Risk: Enterprise-grade safety and hallucination control.
6. AgentOps Advisory: Managed service for monitoring and upgrading deployed agents.

SPECIALIZED AI AGENTS:
- AI Receptionists: 24/7 visitor greeting, call routing, and CRM scheduling.
- Executive Orchestrator: Long-term planning and high-level reasoning.
- Data Sentinel: Privacy, governance, and compliance.
- Client Concierge: High-EQ communication and support.

INVESTMENT & PRICING:
- Foundation Essentials ($2,500): 2 weeks, 1 Custom Agent, AI Readiness Assessment, Staff Training.
- Operational Catalyst ($6,500): 4-6 weeks, 2-3 Custom Agents, CRM Integration, Analytics Dashboard.
- Digital Workforce ($12,500+): 8-12 weeks, 4-7 Agents, Multi-agent systems, Unlimited Vector KB, AgentOps monitoring.

TRAINING & WORKSHOPS:
- The Briefing (2h): Exec sessions on ROI/feasibility.
- The Blueprint (1-2 days): Technical mapping and department-level redesign.
- The Workforce (Weekly): Continuous enablement and adoption support.

GUIDELINES:
- If a visitor wants to work with us, collect their Name and Email.
- Once both are collected, include this on its own line: LEAD_CAPTURE:name=<name>&email=<email>
- For pricing questions, invite them to book a discovery call.
- Keep responses professional, confident, and 2-4 sentences long.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: "messages array required" });

  try {
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages as any,
    });

    const text = response.content.map(c => c.type === "text" ? c.text : "").join("");

    // Extract and email lead capture data
    const leadMatch = text.match(/LEAD_CAPTURE:name=([^&\n]+)&email=([^\s\n]+)/);
    if (leadMatch) {
      const [, name, email] = leadMatch;
      const resendKey = process.env.RESEND_API_KEY;
      console.log("Lead captured:", { name, email, resendKeyFound: !!resendKey });
      
      if (resendKey) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: "Bearer " + resendKey, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "chatbot@clarityworksstudio.com",
              to: "vgreco@clarityworksstudio.com",
              subject: "New website lead: " + name,
              html:
                "<p>New lead from website chatbot:</p>" +
                "<ul><li><strong>Name:</strong> " + name + "</li>" +
                "<li><strong>Email:</strong> <a href='mailto:" + email + "'>" + email + "</a></li></ul>",
            }),
          });
        } catch (e) {
          console.error("Resend error:", e);
        }
      }
    }

    const visibleText = text.replace(/LEAD_CAPTURE:[^\n]*/g, "").trim();
    return res.status(200).json({ content: visibleText });
  } catch (err: any) {
    console.error("Chat API error details:", {
      message: err.message,
      name: err.name,
      status: err.status,
      stack: err.stack
    });
    return res.status(500).json({ 
      error: "Failed to get response", 
      details: err.message, // Temporarily include message in production to debug
      errorType: err.name
    });
  }
}
