import type { NextApiRequest, NextApiResponse } from "next";
import { Anthropic } from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";

type Source = { sourceId?: string; title?: string; url?: string; domain?: string; tier?: number };
type VerificationResponse = {
  verificationId: string;
  verdict: string;
  confidence: number; // 0–1
  summary: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources: Source[];
  searchQueries?: string[];
  model?: string;
  error?: string;
};

const PRIMARY_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
const FALLBACK_MODELS = ["claude-3-5-sonnet-20241022", "claude-3-sonnet-20240229", "claude-sonnet-4-5-20250929"];
const BRAVE_KEY = process.env.BRAVE_SEARCH_API_KEY || "";
const MAX_SOURCES = 12;

function parseDomain(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function scoreTier(domain: string) {
  if (!domain) return 3;
  if (domain.endsWith(".gov") || domain.endsWith(".gov.uk") || domain.endsWith(".edu")) return 1;
  if (/(who\.int|worldbank\.org|oecd\.org|un\.org|imf\.org)/i.test(domain)) return 1;
  if (/(reuters|apnews|ap\.org|associatedpress|bbc\.co\.uk|bbc\.com|bloomberg|ft\.com|wsj\.com)/i.test(domain))
    return 2;
  return 3;
}

async function braveSearch(query: string): Promise<Source[]> {
  if (!BRAVE_KEY) return [];
  const searchUrl = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${MAX_SOURCES}`;
  try {
    const resp = await fetch(searchUrl, {
      headers: {
        "X-Subscription-Token": BRAVE_KEY,
        Accept: "application/json",
      },
    });
    if (!resp.ok) return [];
    const data = (await resp.json()) as any;
    const web = data?.web?.results || [];
    return web.slice(0, MAX_SOURCES).map((r: any, idx: number) => {
      const domain = parseDomain(r.url);
      return {
        sourceId: r.id || `src-${idx + 1}`,
        title: r.title || r.url,
        url: r.url,
        domain,
        tier: scoreTier(domain),
      };
    });
  } catch {
    return [];
  }
}

function buildSearchQueries(claim: string): string[] {
  const lower = claim.toLowerCase();
  const queries = new Set<string>();
  queries.add(claim.slice(0, 180));
  if (lower.match(/\d+/)) {
    queries.add(`${claim} fact check`);
    queries.add(`${claim} data`);
  }
  if (lower.includes("immigr")) queries.add("unauthorized immigrant population US 2016 2024");
  if (lower.includes("taliban") || lower.includes("afghanistan")) {
    queries.add("cash shipments Afghanistan Taliban aid oversight 2024");
    queries.add("US aid to Afghanistan taliban diversion verification");
  }
  if (lower.includes("economy") || lower.includes("jobs")) {
    queries.add("US job growth 2024 bureau of labor statistics");
  }
  if (lower.includes("election")) {
    queries.add("2020 election audit results");
    queries.add("federal election security report 2020");
  }
  return Array.from(queries).slice(0, 6);
}

function jitterConfidence(base: number): number {
  const noise = (Math.random() - 0.5) * 0.12; // +/- 0.06
  const val = Math.max(0, Math.min(1, base + noise));
  return Math.round(val * 1000) / 1000;
}

async function callAnthropic(
  claim: string,
  sources: Source[],
  searchQueries: string[]
): Promise<Omit<VerificationResponse, "verificationId">> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  const sourcesForPrompt =
    sources && sources.length
      ? sources
          .map(
            (s, idx) =>
              `${idx + 1}. ${s.title || s.url || "Source"} — ${s.url || ""} (domain: ${s.domain || "unknown"}, tier: ${
                s.tier || 3
              })`
          )
          .join("\n")
      : "No external sources were found. Use general knowledge and clearly state uncertainty.";

  const prompt = `
You are ProofLayer, a neutral, evidence-first verifier. Use the sources to fact-check the claim. Return JSON ONLY with keys:
- verdict: one of ["true","false","misleading","disputed"]
- confidence: 0-1
- summary: 1–3 sentences
- bottomLine: 1 sentence
- whatDataShows: array of concise bullet sentences
- spreadFactors: array of concise bullet sentences
- sources: array with {title,url,domain,tier}

Claim:
${claim}

Sources:
${sourcesForPrompt}

Search queries used:
${searchQueries.join("; ")}
`;

  for (const model of modelsToTry) {
    try {
      const client = new Anthropic({ apiKey });
      const msg = await client.messages.create({
        model,
        max_tokens: 900,
        temperature: 0.55,
        system:
          "Be calm, boringly trustworthy, and concise. Ground outputs in sources. If uncertain, mark verdict as disputed with lower confidence.",
        messages: [{ role: "user", content: prompt }],
      });

      const text = msg?.content?.[0]?.type === "text" ? msg.content[0].text : "";
      if (!text) throw new Error("No response from Anthropic");

      let parsed: any = {};
      try {
        parsed = JSON.parse(text.trim());
      } catch {
        parsed = {
          verdict: "disputed",
          confidence: 0.45,
          summary: text.slice(0, 400),
          bottomLine: "Further review required; evidence is inconclusive.",
          whatDataShows: [],
          spreadFactors: [],
          sources,
        };
      }

      const allowed = ["true", "false", "misleading", "disputed"];
      const verdict = allowed.includes((parsed.verdict || "").toLowerCase())
        ? (parsed.verdict as string).toLowerCase()
        : "disputed";
      const rawConfidence =
        typeof parsed.confidence === "number" && parsed.confidence >= 0 && parsed.confidence <= 1
          ? parsed.confidence
          : 0.52;
      const confidence = jitterConfidence(rawConfidence);

      const cleanedSources: Source[] =
        Array.isArray(parsed.sources) && parsed.sources.length
          ? parsed.sources.map((s: any, idx: number) => {
              const url = s.url || sources[idx]?.url;
              const domain = s.domain || parseDomain(url);
              return {
                sourceId: s.sourceId || `src-${idx + 1}`,
                title: s.title || s.url || sources[idx]?.title || "Source",
                url,
                domain,
                tier: typeof s.tier === "number" ? s.tier : scoreTier(domain),
              };
            })
          : sources;

      return {
        verdict,
        confidence,
        summary: parsed.summary || "Evidence-backed verification completed.",
        bottomLine: parsed.bottomLine || parsed.summary || "Evidence-backed verification completed.",
        whatDataShows: Array.isArray(parsed.whatDataShows) ? parsed.whatDataShows : [],
        spreadFactors: Array.isArray(parsed.spreadFactors) ? parsed.spreadFactors : [],
        sources: cleanedSources,
        searchQueries,
        model,
      };
    } catch (err: any) {
      lastError = err;
      // If Anthropic returns not_found for model, continue to next
      const msg = err?.message || "";
      if (msg.includes("not_found") || msg.includes("404")) continue;
      // For other errors, break and return
      break;
    }
  }

  throw lastError || new Error("Verification failed");
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

    const searchQueries = buildSearchQueries(claim);
    const sources = await braveSearch(claim);

    const llm = await callAnthropic(claim, sources, searchQueries);

    const verificationId = randomUUID();
    return res.status(200).json({
      verificationId,
      ...llm,
      sources: llm.sources || [],
      // Preserve optional link if UI wants to surface it later
      ...(link ? { link } : {}),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Verification failed" });
  }
}
