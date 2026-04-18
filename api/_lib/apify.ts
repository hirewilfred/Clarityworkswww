const APIFY_TOKEN = process.env.APIFY_TOKEN || process.env.VITE_APIFY_API_KEY || "";

export interface ApifyRun {
  id: string;
  actId: string;
  status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMING-OUT" | "TIMED-OUT" | "ABORTING" | "ABORTED";
  defaultDatasetId?: string;
  startedAt?: string;
  finishedAt?: string;
}

export async function startApifyRun(actorId: string, input: unknown): Promise<ApifyRun> {
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/runs?token=${APIFY_TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Apify start failed (${res.status}): ${txt}`);
  }
  const json = await res.json();
  return json.data as ApifyRun;
}

export async function getApifyRun(runId: string): Promise<ApifyRun> {
  const url = `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Apify get-run failed: ${res.status}`);
  const json = await res.json();
  return json.data as ApifyRun;
}

export async function getDatasetItems(datasetId: string, limit = 500): Promise<unknown[]> {
  const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=${limit}&clean=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Apify dataset fetch failed: ${res.status}`);
  return (await res.json()) as unknown[];
}

export async function runApifyActorSync(actorId: string, input: unknown, timeoutSecs = 55): Promise<unknown[]> {
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=${timeoutSecs}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Apify sync run failed (${res.status}): ${txt}`);
  }
  return (await res.json()) as unknown[];
}
