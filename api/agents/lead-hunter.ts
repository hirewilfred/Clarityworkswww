import type { VercelRequest, VercelResponse } from "@vercel/node";
import { startApifyRun, getApifyRun, getDatasetItems } from "../_lib/apify.js";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";

interface StartBody {
  action: "start";
  persona: string;
  geography: string;
  count?: number;
  actor?: "google-places" | "apollo" | "linkedin";
  missionId?: string | null;
  parentRunId?: string | null;
  goal?: string;
}
interface PollBody {
  action: "poll";
  runId: string;
}

const ACTOR_IDS: Record<string, string> = {
  "google-places": "compass/crawler-google-places",
  apollo: "curious_coder/apollo-io-scraper",
  linkedin: "apify/linkedin-profile-scraper",
};

function pickActor(persona: string, override?: string) {
  if (override && ACTOR_IDS[override]) return { key: override, id: ACTOR_IDS[override] };
  const p = persona.toLowerCase();
  const localServiceTerms = ["plumber", "hvac", "electrician", "salon", "lawyer", "dentist", "contractor", "restaurant", "shop"];
  if (localServiceTerms.some(t => p.includes(t))) return { key: "google-places", id: ACTOR_IDS["google-places"] };
  return { key: "apollo", id: ACTOR_IDS.apollo };
}

function buildActorInput(actorKey: string, persona: string, geography: string, count: number) {
  if (actorKey === "google-places") {
    return {
      searchStringsArray: [`${persona} ${geography}`],
      maxCrawledPlacesPerSearch: count,
      language: "en",
    };
  }
  if (actorKey === "apollo") {
    return {
      personTitles: [persona],
      location: geography,
      maxResults: count,
    };
  }
  return {
    searchTerms: [`${persona} ${geography}`],
    maxItems: count,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as StartBody | PollBody;

  try {
    if (body.action === "start") {
      const count = Math.min(body.count || 25, 100);
      const actor = pickActor(body.persona, body.actor);
      const runId = await startRun({
        ownerId,
        missionId: body.missionId,
        parentRunId: body.parentRunId,
        agentName: "lead-hunter",
        goal: body.goal,
        task: `Scrape ${count} ${body.persona} in ${body.geography}`,
        input: { persona: body.persona, geography: body.geography, count, actor: actor.key },
      });

      const apifyRun = await startApifyRun(actor.id, buildActorInput(actor.key, body.persona, body.geography, count));

      await supabaseAdmin
        .from("marketing_agent_runs")
        .update({
          input: {
            persona: body.persona,
            geography: body.geography,
            count,
            actor: actor.key,
            apify_run_id: apifyRun.id,
            apify_actor_id: actor.id,
          },
        })
        .eq("id", runId);

      return res.status(200).json({ runId, apifyRunId: apifyRun.id, actor: actor.key });
    }

    if (body.action === "poll") {
      const { data: runRow, error: runErr } = await supabaseAdmin
        .from("marketing_agent_runs")
        .select("id, owner_id, status, input")
        .eq("id", body.runId)
        .single();
      if (runErr || !runRow) return res.status(404).json({ error: "Run not found" });
      if (runRow.owner_id !== ownerId) return res.status(403).json({ error: "Forbidden" });
      if (runRow.status !== "running") {
        return res.status(200).json({ status: runRow.status, runId: body.runId });
      }

      const apifyRunId = (runRow.input as any)?.apify_run_id;
      const actorKey = (runRow.input as any)?.actor;
      if (!apifyRunId) {
        await failRun(body.runId, new Error("Missing apify_run_id"));
        return res.status(500).json({ status: "failed", error: "Missing apify_run_id" });
      }

      const apifyRun = await getApifyRun(apifyRunId);
      if (apifyRun.status === "RUNNING" || apifyRun.status === "READY") {
        return res.status(200).json({ status: "running", apifyStatus: apifyRun.status });
      }
      if (apifyRun.status !== "SUCCEEDED") {
        await failRun(body.runId, new Error(`Apify run ${apifyRun.status}`));
        return res.status(200).json({ status: "failed", apifyStatus: apifyRun.status });
      }

      const items = (await getDatasetItems(apifyRun.defaultDatasetId!)) as any[];
      const ingestResult = await ingestItems(ownerId, actorKey, items);

      await completeRun({
        runId: body.runId,
        affectedTable: "crm_contacts",
        affectedCount: ingestResult.contactsAdded,
        output: ingestResult,
      });

      return res.status(200).json({ status: "succeeded", ...ingestResult });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err: any) {
    console.error("lead-hunter error:", err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}

async function ingestItems(ownerId: string, actorKey: string, items: any[]) {
  let companiesAdded = 0;
  let contactsAdded = 0;
  let leadsAdded = 0;
  const newContactIds: string[] = [];
  const today = new Date().toISOString().slice(0, 10);

  if (actorKey === "google-places") {
    for (const it of items) {
      if (!it.title) continue;
      const { data: company, error: cErr } = await supabaseAdmin
        .from("crm_companies")
        .insert({
          owner_id: ownerId,
          name: it.title,
          industry: it.categoryName || "",
          location: [it.city, it.state].filter(Boolean).join(", "),
          website: it.website || "",
          phone: it.phone || "",
          notes: `Source: google-places on ${today}${it.totalScore ? ` · Rating ${it.totalScore} (${it.reviewsCount || 0} reviews)` : ""}`,
        })
        .select("id")
        .single();
      if (cErr || !company) continue;
      companiesAdded++;
      const { data: contact, error: ctErr } = await supabaseAdmin
        .from("crm_contacts")
        .insert({
          owner_id: ownerId,
          company_id: company.id,
          first_name: "",
          last_name: "",
          title: "Owner / Manager",
          phone: it.phone || "",
          email: it.emails?.[0] || "",
          location: [it.city, it.state].filter(Boolean).join(", "),
          source: "google-places",
          notes: `${it.title}${it.address ? " · " + it.address : ""}`,
        })
        .select("id")
        .single();
      if (!ctErr && contact) {
        contactsAdded++;
        newContactIds.push(contact.id);
      }
    }
  } else {
    // apollo / linkedin
    for (const it of items) {
      const linkedinUrl = it.linkedinUrl || it.linkedin_url || "";
      const { data: company } = linkedinUrl
        ? await supabaseAdmin
            .from("crm_companies")
            .insert({
              owner_id: ownerId,
              name: it.organization?.name || it.company || it.companyName || "",
              industry: it.organization?.industry || it.industry || "",
              website: it.organization?.website_url || it.companyWebsite || "",
              location: it.location || "",
              notes: `Source: ${actorKey} on ${today}`,
            })
            .select("id")
            .single()
        : { data: null };
      if (company) companiesAdded++;
      const { data: contact, error: ctErr } = await supabaseAdmin
        .from("crm_contacts")
        .insert({
          owner_id: ownerId,
          company_id: company?.id || null,
          first_name: it.firstName || it.first_name || "",
          last_name: it.lastName || it.last_name || "",
          email: it.email || "",
          title: it.title || it.headline || "",
          linkedin_url: linkedinUrl,
          location: it.location || "",
          source: actorKey,
          notes: it.headline || "",
        })
        .select("id")
        .single();
      if (!ctErr && contact) {
        contactsAdded++;
        newContactIds.push(contact.id);
      }
      if (linkedinUrl) {
        const { error: lErr } = await supabaseAdmin.from("linkedin_leads").insert({
          owner_id: ownerId,
          first_name: it.firstName || it.first_name || "",
          last_name: it.lastName || it.last_name || "",
          title: it.title || "",
          company: it.organization?.name || it.company || "",
          location: it.location || "",
          linkedin_url: linkedinUrl,
          email: it.email || "",
          headline: it.headline || "",
          industry: it.organization?.industry || it.industry || "",
          stage: "scraped",
        });
        if (!lErr) leadsAdded++;
      }
    }
  }

  return { companiesAdded, contactsAdded, leadsAdded, newContactIds, totalScraped: items.length };
}
