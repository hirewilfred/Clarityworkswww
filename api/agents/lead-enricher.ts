import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runApifyActorSync } from "../_lib/apify.js";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";

interface Body {
  contactIds?: string[];
  filter?: { missingEmail?: boolean; source?: string };
  limit?: number;
  missionId?: string | null;
  parentRunId?: string | null;
  goal?: string;
}

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const BLOCK_EMAIL_PREFIXES = ["info@", "noreply@", "no-reply@", "support@", "admin@", "contact@"];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as Body;
  const limit = Math.min(body.limit || 50, 100);

  const runId = await startRun({
    ownerId,
    missionId: body.missionId,
    parentRunId: body.parentRunId,
    agentName: "lead-enricher",
    goal: body.goal,
    task: `Enrich up to ${limit} contacts`,
    input: { contactIds: body.contactIds, filter: body.filter, limit },
  });

  try {
    let query = supabaseAdmin
      .from("crm_contacts")
      .select("id, first_name, last_name, email, linkedin_url, title, company_id, crm_companies(name, domain, website)")
      .eq("owner_id", ownerId)
      .limit(limit);

    if (body.contactIds && body.contactIds.length > 0) {
      query = query.in("id", body.contactIds);
    } else {
      if (body.filter?.missingEmail !== false) query = query.or("email.is.null,email.eq.");
      if (body.filter?.source) query = query.eq("source", body.filter.source);
    }

    const { data: candidates, error: cErr } = await query;
    if (cErr) throw cErr;

    let enriched = 0;
    let notFound = 0;
    const enrichedIds: string[] = [];

    for (const c of candidates || []) {
      const company = (c as any).crm_companies;
      const companyName = company?.name;
      if (!companyName) {
        notFound++;
        continue;
      }
      const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
      const apolloInput: Record<string, unknown> = { maxResults: 3 };
      if (fullName) apolloInput.personNames = [fullName];
      apolloInput.companyDomains = company?.domain ? [company.domain] : [];
      if (!apolloInput.companyDomains || (apolloInput.companyDomains as string[]).length === 0) {
        apolloInput.companyNames = [companyName];
      }

      let items: any[] = [];
      try {
        items = (await runApifyActorSync("curious_coder/apollo-io-scraper", apolloInput, 50)) as any[];
      } catch (e) {
        console.warn("Apollo lookup failed for", companyName, e);
        continue;
      }

      const match = items.find(i => {
        if (!i.email) return false;
        if (!EMAIL_RE.test(i.email)) return false;
        if (BLOCK_EMAIL_PREFIXES.some(p => i.email.toLowerCase().startsWith(p))) return false;
        return true;
      }) || items[0];

      if (!match) {
        notFound++;
        continue;
      }

      const updates: Record<string, unknown> = {};
      if (!c.email && match.email && EMAIL_RE.test(match.email)) updates.email = match.email;
      if (!c.linkedin_url && (match.linkedinUrl || match.linkedin_url)) updates.linkedin_url = match.linkedinUrl || match.linkedin_url;
      if (!c.title && match.title) updates.title = match.title;
      if (Object.keys(updates).length === 0) {
        notFound++;
        continue;
      }
      updates.updated_at = new Date().toISOString();

      const { error: uErr } = await supabaseAdmin.from("crm_contacts").update(updates).eq("id", c.id);
      if (!uErr) {
        enriched++;
        enrichedIds.push(c.id);
      }
    }

    const result = {
      candidatesChecked: candidates?.length || 0,
      enriched,
      notFound,
      enrichedIds,
    };

    await completeRun({
      runId,
      affectedTable: "crm_contacts",
      affectedCount: enriched,
      output: result,
    });

    return res.status(200).json({ runId, ...result });
  } catch (err: any) {
    console.error("lead-enricher error:", err);
    await failRun(runId, err);
    return res.status(500).json({ error: err.message || String(err), runId });
  }
}
