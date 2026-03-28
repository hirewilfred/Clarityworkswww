import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "You are the Clarity Works Studio AI assistant. " +
  "Clarity Works Studio is an AI consulting agency specializing in: " +
  "AI Consulting (helping businesses adopt AI), " +
  "AI Agents (building custom autonomous agents), and " +
  "Website Design (fast, modern websites). " +
  "Answer questions about services. " +
  "If a visitor expresses interest in working with us, collect their name and email. " +
  "After they provide both, confirm receipt and include on a separate line: " +
  "LEAD_CAPTURE:name=<their name>&email=<their email> " +
  "(replace with actual values, no angle brackets). " +
  "For pricing questions, invite them to book a free discovery call. " +
  "Stay on topic. Keep responses to 2-4 sentences. " +
  "Tone: professional, confident, friendly.";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
  if (!Array.isArray(messages) || messages.length === 0)
    return res.status(400).json({ error: "messages array required" });

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages as Parameters<typeof client.messages.create>[0]["messages"],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract and email lead capture data
    const leadMatch = text.match(/LEAD_CAPTURE:name=([^&\n]+)&email=([^\s\n]+)/);
    if (leadMatch) {
      const [, name, email] = leadMatch;
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        fetch("https://api.resend.com/emails", {
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
        }).catch(() => {});
      }
    }

    const visibleText = text.replace(/LEAD_CAPTURE:[^\n]*/g, "").trim();
    return res.status(200).json({ content: visibleText });
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Failed to get response" });
  }
}
