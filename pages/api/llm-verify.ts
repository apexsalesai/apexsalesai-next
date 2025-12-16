import type { NextApiRequest, NextApiResponse } from "next";
import { Anthropic } from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";

type Source = { sourceId?: string; title?: string; url?: string; domain?: string; tier?: number };
type VerificationResponse = {
  verificationId: string;
  verdict: string;
  confidence: number;
  summary: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources: Source[];
  error?: string;
};

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const BRAVE_KEY = process.env.BRAVE_SEARCH_API_KEY || "";
const MAX_SOURCES = 5;

function parseDomain(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

async function braveSearch(query: string): Promise<Source[]> {
  if (!BRAVE_KEY) return [];
  try {
    const resp = await fetch("https://api.search.brave.com/res/v1/web/search", {
      method: "GET",
      headers: {
        "X-Subscription-Token": BRAVE_KEY,
        Accept: "application/json",
      },
      // Brave expects query params on URL; use fetch with encoded query
    });
    // If fetch without params fails, fall back to constructing URL with query
    if (!resp.ok) {
      const fallback = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${MAX_SOURCES}`,
        {
          method: "GET",
          headers: {
            "X-Subscription-Token": BRAVE_KEY,
            Accept: "application/json",
          },
        }
      );
      if (!fallback.ok) return [];
      const data = (await fallback.json()) as any;
      const web = data?.web?.results || [];
      return web.slice(0, MAX_SOURCES).map((r: any, idx: number) => ({
        sourceId: r.id || `src-${idx + 1}`,
        title: r.title || r.url,
        url: r.url,
        domain: parseDomain(r.url),
        tier: r.rank ? Math.max(1, Math.min(3, Math.round(r.rank))) : 2,
      }));
    }
    const data = (await resp.json()) as any;
    const web = data?.web?.results || [];
    return web.slice(0, MAX_SOURCES).map((r: any, idx: number) => ({
      sourceId: r.id || `src-${idx + 1}`,
      title: r.title || r.url,
      url: r.url,
      domain: parseDomain(r.url),
      tier: r.rank ? Math.max(1, Math.min(3, Math.round(r.rank))) : 2,
    }));
  } catch {
    return [];
  }
}

async function callAnthropic(claim: string, sources: Source[]): Promise<Omit<VerificationResponse, "verificationId">> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }
  const client = new Anthropic({ apiKey });

  const sourceText =
    sources && sources.length
      ? sources
          .map(
            (s, idx) =>
              `${idx + 1}. ${s.title || s.url || "Source"} (${s.domain || "unknown"}) - ${s.url || "no url"}`
          )
          .join("\n")
      : "No external sources available.";

  const prompt = `
You are ProofLayer, returning a structured fact-check. Analyze the claim using the provided sources.

Claim:
${claim}

Sources:
${sourceText}

Return JSON with keys: verdict (one of true, false, misleading, disputed), confidence (0-1), summary, bottomLine, spreadFactors (array), whatDataShows (array), and sources (preserve provided, add or adjust titles/domains if helpful).
Only return JSON.`;

  const msg = await client.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 800,
    temperature: 0.3,
    system:
      "You are a neutral, evidence-first fact checker. Be concise, avoid sensationalism, and ground outputs in the provided sources.",
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg?.content?.[0]?.type === "text" ? msg.content[0].text : "";
  if (!text) {
    throw new Error("No response from Anthropic");
  }

  // Attempt to parse JSON from the model; if it fails, wrap into a safe object.
  let parsed: any = {};
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    parsed = {
      verdict: "disputed",
      confidence: 0.4,
      summary: text.slice(0, 400),
      bottomLine: "Further review required.",
      spreadFactors: [],
      whatDataShows: [],
      sources,
    };
  }

  const verdict = (parsed.verdict || "disputed").toString().toLowerCase();
  const allowed = ["true", "false", "misleading", "disputed"];
  const normalizedVerdict = allowed.includes(verdict) ? verdict : "disputed";
  const confidence =
    typeof parsed.confidence === "number" && parsed.confidence >= 0 && parsed.confidence <= 1
      ? parsed.confidence
      : 0.5;

  const cleanedSources: Source[] =
    Array.isArray(parsed.sources) && parsed.sources.length
      ? parsed.sources.map((s: any, idx: number) => ({
          sourceId: s.sourceId || `src-${idx + 1}`,
          title: s.title || s.url || sources[idx]?.title || "Source",
          url: s.url || sources[idx]?.url,
          domain: s.domain || parseDomain(s.url || sources[idx]?.url),
          tier: typeof s.tier === "number" ? s.tier : sources[idx]?.tier || 2,
        }))
      : sources;

  return {
    verdict: normalizedVerdict,
    confidence,
    summary: parsed.summary || "Evidence review completed.",
    bottomLine: parsed.bottomLine || parsed.summary || "Evidence review completed.",
    spreadFactors: Array.isArray(parsed.spreadFactors) ? parsed.spreadFactors : [],
    whatDataShows: Array.isArray(parsed.whatDataShows) ? parsed.whatDataShows : [],
    sources: cleanedSources,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VerificationResponse | { error: string }>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const claim = typeof req.body?.claim === "string" ? req.body.claim.trim() : "";
    const link = typeof req.body?.link === "string" ? req.body.link.trim() : "";
    if (!claim) {
      return res.status(400).json({ error: "Claim is required" });
    }

    // Step 1: fetch external sources
    const sources = await braveSearch(claim);

    // Step 2: call Anthropic with claim + sources
    const llmResult = await callAnthropic(claim, sources);

    // Step 3: assemble response
    const verificationId = randomUUID();
    return res.status(200).json({
      verificationId,
      ...llmResult,
      sources: llmResult.sources || [],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Verification failed" });
  }
}
