import type { VercelRequest, VercelResponse } from "@vercel/node";
import { startRun, completeRun, failRun } from "../_lib/agent-runs.js";
import { supabaseAdmin } from "../_lib/supabase-admin.js";
import { getOwnerIdFromRequest } from "../_lib/auth.js";

interface Body {
  campaignName: string;
  contactIds?: string[];
  leadIds?: string[];
  draftsRunId: string;
  channel?: "linkedin" | "instantly_email" | "both";
  autoActivate?: boolean;
  missionId?: string | null;
  parentRunId?: string | null;
  goal?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ownerId = await getOwnerIdFromRequest(req);
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as Body;
  const channel = body.channel || "linkedin";
  const autoActivate = !!body.autoActivate;

  const runId = await startRun({
    ownerId,
    missionId: body.missionId,
    parentRunId: body.parentRunId,
    agentName: "campaign-manager",
    goal: body.goal,
    task: `Create "${body.campaignName}" (${channel}) and assign leads`,
    input: { ...body },
  });

  try {
    const { data: draftsRun, error: dErr } = await supabaseAdmin
      .from("marketing_agent_runs")
      .select("output, owner_id")
      .eq("id", body.draftsRunId)
      .single();
    if (dErr || !draftsRun) throw new Error("drafts run not found");
    if (draftsRun.owner_id !== ownerId) throw new Error("Forbidden drafts run");

    const drafts = ((draftsRun.output as any)?.drafts || []) as any[];
    const firstMessages = drafts[0]?.messages || {};

    const result: Record<string, unknown> = {};

    if (channel === "linkedin" || channel === "both") {
      const { data: campaign, error: cErr } = await supabaseAdmin
        .from("linkedin_campaigns")
        .insert({
          owner_id: ownerId,
          name: body.campaignName,
          status: autoActivate ? "active" : "draft",
          connection_message: firstMessages.connection || "",
          followup_1: firstMessages.followup_1 || "",
          followup_1_delay_days: 2,
          followup_2: firstMessages.followup_2 || "",
          followup_2_delay_days: 3,
        })
        .select("id")
        .single();
      if (cErr || !campaign) throw new Error(`Create campaign failed: ${cErr?.message}`);

      // Resolve lead IDs from drafts (prefer linkedin_leads where available, else map crm_contacts → leads via linkedin_url)
      let targetLeadIds: string[] = body.leadIds || [];
      if (targetLeadIds.length === 0 && (body.contactIds?.length || drafts.length)) {
        const contactIds = body.contactIds && body.contactIds.length > 0
          ? body.contactIds
          : drafts.map(d => d.contact_id);
        const { data: contacts } = await supabaseAdmin
          .from("crm_contacts")
          .select("linkedin_url")
          .in("id", contactIds)
          .eq("owner_id", ownerId);
        const urls = (contacts || []).map(c => c.linkedin_url).filter(Boolean) as string[];
        if (urls.length > 0) {
          const { data: leads } = await supabaseAdmin
            .from("linkedin_leads")
            .select("id")
            .in("linkedin_url", urls)
            .eq("owner_id", ownerId);
          targetLeadIds = (leads || []).map(l => l.id);
        }
      }

      let leadsAssigned = 0;
      if (targetLeadIds.length > 0) {
        const { error: aErr, count } = await supabaseAdmin
          .from("linkedin_leads")
          .update({
            campaign_id: campaign.id,
            stage: autoActivate ? "connect_sent" : "scraped",
          }, { count: "exact" })
          .in("id", targetLeadIds)
          .eq("owner_id", ownerId);
        if (aErr) throw new Error(`Assign leads failed: ${aErr.message}`);
        leadsAssigned = count || targetLeadIds.length;
      }

      result.linkedin = {
        campaign_id: campaign.id,
        campaign_name: body.campaignName,
        leads_assigned: leadsAssigned,
        status: autoActivate ? "active" : "draft",
      };
    }

    if (channel === "instantly_email" || channel === "both") {
      const instantlyKey = process.env.INSTANTLY_API_KEY || "";
      if (!instantlyKey) {
        result.instantly = { skipped: true, reason: "INSTANTLY_API_KEY not configured" };
      } else {
        const emailLeads = drafts
          .map(d => ({
            email: (d.messages?.email || "").includes("@") ? null : null,
            first_name: (d.contact_name || "").split(" ")[0] || "",
            last_name: (d.contact_name || "").split(" ").slice(1).join(" "),
            company_name: d.company || "",
          }));

        const { data: contactRows } = await supabaseAdmin
          .from("crm_contacts")
          .select("id, first_name, last_name, email, crm_companies(name)")
          .in("id", drafts.map(d => d.contact_id))
          .eq("owner_id", ownerId);
        const validLeads = (contactRows || [])
          .filter(c => c.email && c.email.includes("@"))
          .map(c => ({
            email: c.email,
            first_name: c.first_name || "",
            last_name: c.last_name || "",
            company_name: (c as any).crm_companies?.name || "",
          }));

        if (validLeads.length === 0) {
          result.instantly = { skipped: true, reason: "no leads have valid emails" };
        } else {
          let pushed = 0;
          let instantlyCampaignId: string | null = null;
          // create or fetch instantly campaign (v2)
          const createRes = await fetch("https://api.instantly.ai/api/v2/campaigns", {
            method: "POST",
            headers: { Authorization: `Bearer ${instantlyKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({ name: body.campaignName }),
          });
          if (createRes.ok) {
            const j = await createRes.json();
            instantlyCampaignId = j.id || j.campaign_id || null;
          }
          if (instantlyCampaignId) {
            const pushRes = await fetch("https://api.instantly.ai/api/v2/leads", {
              method: "POST",
              headers: { Authorization: `Bearer ${instantlyKey}`, "Content-Type": "application/json" },
              body: JSON.stringify({ campaign_id: instantlyCampaignId, leads: validLeads }),
            });
            if (pushRes.ok) pushed = validLeads.length;
          }
          result.instantly = { campaign_id: instantlyCampaignId, leads_added: pushed };
        }
      }
    }

    await completeRun({
      runId,
      affectedTable: "linkedin_campaigns",
      affectedCount: ((result.linkedin as any)?.leads_assigned || 0) + ((result.instantly as any)?.leads_added || 0),
      output: result,
    });

    return res.status(200).json({ runId, ...result });
  } catch (err: any) {
    console.error("campaign-manager error:", err);
    await failRun(runId, err);
    return res.status(500).json({ error: err.message || String(err), runId });
  }
}
