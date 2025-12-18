/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type Verdict = "true" | "false" | "misleading" | "unverified";

type Source = {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  published?: string | null;
  tier: "tier1" | "tier2" | "tier3" | "tier4";
  score: number; // internal ranking
  reason: string; // why it was placed in this tier
};

type VerifyRequest = {
  claim?: string;
  url?: string; // optional: claim source url for context (not required)
  contextUrl?: string; // alias
  maxSources?: number; // optional: default 12
};

type VerifyResponse = {
  verificationId: string;
  verdict: Verdict;
  confidence: number; // 0..1
  summary: string;

  bottomLine: string;

  whatDataShows: string[];
  spreadFactors: string[];

  sources: {
    tier1: Source[];
    tier2: Source[];
    tier3: Source[];
    // tier4 intentionally omitted from "proof" sources; social can be returned separately if you want later
  };

  searchQueries: string[];
  model: string;
  generatedAt: string;

  // Optional helper fields (safe)
  warnings?: string[];
};

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

const DEFAULT_MODEL = "claude-3-5-sonnet-20241022";
const MAX_QUERY_COUNT = 4;
const DEFAULT_MAX_SOURCES = 12;

const OFFICIAL_ORGS = new Set([
  "who.int",
  "un.org",
  "oecd.org",
  "worldbank.org",
  "imf.org",
  "europa.eu",
  "cdc.gov",
  "nih.gov",
  "nasa.gov",
  "noaa.gov",
  "census.gov",
  "bls.gov",
  "bea.gov",
  "fda.gov",
  "sec.gov",
  "justice.gov",
  "whitehouse.gov",
  "state.gov",
  "uscis.gov",
  "cbp.gov",
  "dhs.gov",
]);

// Tier2 examples (non-exhaustive). This is NOT a whitelist — it's a biasing set.
const REPUTABLE_NEWS_OR_RESEARCH = new Set([
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "nytimes.com",
  "wsj.com",
  "ft.com",
  "economist.com",
  "bloomberg.com",
  "washingtonpost.com",
  "cnn.com",
  "nbcnews.com",
  "cbsnews.com",
  "abcnews.go.com",
  "theguardian.com",
  "propublica.org",
  "factcheck.org",
  "politifact.com",
  "snopes.com",
  "pewresearch.org",
  "rand.org",
  "brookings.edu",
  "cfr.org",
]);

const SOCIAL_DOMAINS = new Set([
  "x.com",
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "youtube.com",
  "youtu.be",
  "reddit.com",
  "truthsocial.com",
  "rumble.com",
  "telegram.me",
  "t.me",
]);

function isString(x: any): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function toDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function domainIsGovEduMil(domain: string): boolean {
  return (
    domain.endsWith(".gov") ||
    domain.endsWith(".mil") ||
    domain.endsWith(".edu") ||
    domain.includes(".gov.") ||
    domain.includes(".mil.") ||
    domain.includes(".edu.")
  );
}

function classifyTier(domain: string): { tier: Source["tier"]; reason: string } {
  if (!domain) return { tier: "tier3", reason: "Unknown domain" };

  if (domainIsGovEduMil(domain)) {
    return { tier: "tier1", reason: "Government / military / academic domain" };
  }

  if (OFFICIAL_ORGS.has(domain) || [...OFFICIAL_ORGS].some((d) => domain.endsWith("." + d))) {
    return { tier: "tier1", reason: "Official institution / international org" };
  }

  if (SOCIAL_DOMAINS.has(domain) || [...SOCIAL_DOMAINS].some((d) => domain.endsWith("." + d))) {
    return { tier: "tier4", reason: "Social / UGC platform (supporting only)" };
  }

  if (
    REPUTABLE_NEWS_OR_RESEARCH.has(domain) ||
    [...REPUTABLE_NEWS_OR_RESEARCH].some((d) => domain.endsWith("." + d))
  ) {
    return { tier: "tier2", reason: "Reputable news / research / fact-check outlet" };
  }

  // Wikipedia is useful context but not decisive.
  if (domain === "wikipedia.org" || domain.endsWith(".wikipedia.org")) {
    return { tier: "tier3", reason: "Encyclopedic context (not decisive evidence)" };
  }

  // Default: tier3
  return { tier: "tier3", reason: "General web source (context unless corroborated)" };
}

function scoreSource(tier: Source["tier"], domain: string, title: string, snippet: string): number {
  // Tier weight dominates.
  const tierWeight =
    tier === "tier1" ? 1000 : tier === "tier2" ? 700 : tier === "tier3" ? 350 : 50;

  // Favor "fact check" / "report" language modestly (still tier-dominant)
  const text = `${domain} ${title} ${snippet}`.toLowerCase();
  const bonus =
    (text.includes("report") ? 25 : 0) +
    (text.includes("data") ? 20 : 0) +
    (text.includes("statistics") ? 20 : 0) +
    (text.includes("fact check") || text.includes("fact-check") ? 35 : 0) +
    (text.includes("press release") ? 15 : 0);

  // Slightly penalize obviously low-signal "blog" vibes
  const penalty =
    (text.includes("opinion") ? 20 : 0) +
    (text.includes("blog") ? 15 : 0) +
    (text.includes("forum") ? 15 : 0);

  return tierWeight + bonus - penalty;
}

function dedupeByUrl<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of items) {
    const key = it.url.trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

async function braveWebSearch(query: string, count: number): Promise<any[]> {
  // STEP 3: Harden Brave Search (NEVER THROW)
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) return []; // Fail silently - env guard catches this upstream

  try {
    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.set("q", query);
    url.searchParams.set("count", String(Math.min(Math.max(count, 3), 10)));
    url.searchParams.set("safesearch", "moderate");
    url.searchParams.set("freshness", "year");

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!res.ok) return []; // Network error - return empty, don't throw

    const json = await res.json();
    const results = json?.web?.results ?? [];
    return Array.isArray(results) ? results : [];
  } catch {
    return []; // ANY error - return empty array
  }
}

async function safeReadText(res: Response): Promise<string | null> {
  try {
    return await res.text();
  } catch {
    return null;
  }
}

function buildSearchQueries(claim: string): string[] {
  const clean = claim.trim().replace(/\s+/g, " ");

  // Hard-coded "gold" query set: official-first + fact-check assist
  const q1 = `${clean} site:.gov OR site:.mil OR site:.edu`;
  const q2 = `${clean} data report statistics`;
  const q3 = `${clean} fact check`;
  const q4 = `${clean} Pew Research OR CDC OR Census OR BLS OR UN OR WHO`;

  return [q1, q2, q3, q4].slice(0, MAX_QUERY_COUNT);
}

function normalizeBraveResult(r: any): { title: string; url: string; snippet: string; published?: string | null } | null {
  const url = r?.url;
  const title = r?.title;
  const snippet = r?.description ?? r?.snippet ?? "";
  const published = r?.page_age ?? r?.age ?? r?.published ?? null;

  if (!isString(url) || !isString(title)) return null;
  return { title: String(title), url: String(url), snippet: String(snippet ?? ""), published };
}

function splitTiers(sources: Source[]) {
  const tier1 = sources.filter((s) => s.tier === "tier1");
  const tier2 = sources.filter((s) => s.tier === "tier2");
  const tier3 = sources.filter((s) => s.tier === "tier3");

  // tier4 intentionally excluded from proof sources
  return { tier1, tier2, tier3 };
}

async function callAnthropic(args: {
  system: string;
  user: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  // GOLD STANDARD: Verify key is loaded
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Anthropic API key not loaded");
  }

  console.log("Anthropic key loaded:", !!apiKey);
  console.log("Anthropic key prefix:", apiKey.slice(0, 15));
  console.log("Requesting model:", args.model);

  // STEP 1: Hard-set headers (Messages API ONLY)
  const requestBody = {
    model: args.model,
    max_tokens: args.maxTokens ?? 1200,
    temperature: args.temperature ?? 0.3,
    system: args.system,
    messages: [
      {
        role: "user",
        content: args.user,
      },
    ],
  };

  console.log("Request body:", JSON.stringify(requestBody).slice(0, 200));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const body = await safeReadText(res);
    console.error("=== FULL ANTHROPIC ERROR ===");
    console.error("Status:", res.status);
    console.error("Body:", body);
    console.error("=== END ERROR ===");
    throw new Error(`Anthropic failed (${res.status}): ${body?.slice(0, 400) ?? ""}`);
  }

  const json = await res.json();
  
  // STEP 2: Extract text ONLY - support both SDK formats
  const text = 
    json?.content?.[0]?.text ?? 
    json?.message?.content?.[0]?.text ?? 
    "";
  
  if (!text) {
    console.error("Anthropic response structure:", JSON.stringify(json).slice(0, 500));
    throw new Error("Empty Claude response");
  }
  
  return text;
}

function safeJsonParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function ensureArrayOfStrings(x: any, fallback: string[]): string[] {
  if (!Array.isArray(x)) return fallback;
  const cleaned = x.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
  return cleaned.length ? cleaned.slice(0, 10) : fallback;
}

function normalizeVerdict(v: any): Verdict {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "true") return "true";
  if (s === "false") return "false";
  if (s === "misleading") return "misleading";
  return "unverified";
}

function stripJsonFence(s: string): string {
  // If model wraps in ```json ... ```
  const trimmed = s.trim();
  const m = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return m ? m[1].trim() : trimmed;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // STEP 1: Hard wrap entire handler (NO 500s)
  try {
    // Environment guards
    if (!process.env.ANTHROPIC_API_KEY || !process.env.BRAVE_SEARCH_API_KEY) {
      return res.status(200).json({
        verdict: "unknown",
        confidence: 0,
        summary: "Verification unavailable due to missing API configuration.",
        bottomLine: "Unable to verify at this time.",
        whatDataShows: [],
        spreadFactors: [],
        sources: { tier1: [], tier2: [], tier3: [] },
        verificationId: crypto.randomUUID(),
        generatedAt: new Date().toISOString(),
        model: DEFAULT_MODEL,
        searchQueries: [],
        error: "env_missing"
      });
    }

    // Only POST
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const verificationId = crypto.randomUUID();
    const generatedAt = new Date().toISOString();
    const warnings: string[] = [];
    const body: VerifyRequest = typeof req.body === "string" ? safeJsonParse(req.body) ?? {} : (req.body ?? {});
    const claim = isString(body.claim) ? body.claim.trim() : "";
    const contextUrl = isString(body.url) ? body.url.trim() : isString(body.contextUrl) ? body.contextUrl.trim() : "";
    const maxSources = Number.isFinite(body.maxSources as any) ? Math.max(6, Math.min(18, Number(body.maxSources))) : DEFAULT_MAX_SOURCES;

    if (!claim) {
      return res.status(400).json({
        error: { code: "bad_request", message: "Missing claim." },
      });
    }

    // 1) Build deterministic queries (official-first bias)
    const searchQueries = buildSearchQueries(claim);

    // 2) Brave search in parallel
    const braveResultsNested = await Promise.all(
      searchQueries.map(async (q) => {
        try {
          return await braveWebSearch(q, 6);
        } catch (e: any) {
          warnings.push(`Search query failed: "${q}" (${String(e?.message ?? e)})`);
          return [];
        }
      })
    );

    const braveResults = braveResultsNested.flat().map(normalizeBraveResult).filter(Boolean) as Array<{
      title: string;
      url: string;
      snippet: string;
      published?: string | null;
    }>;

    // 3) Normalize → classify → score → dedupe
    const sourcesAll: Source[] = dedupeByUrl(
      braveResults.map((r) => {
        const domain = toDomain(r.url);
        const { tier, reason } = classifyTier(domain);
        const score = scoreSource(tier, domain, r.title, r.snippet);
        return {
          title: r.title,
          url: r.url,
          domain,
          snippet: r.snippet,
          published: r.published ?? null,
          tier,
          score,
          reason,
        };
      })
    )
      // Drop obvious junk (no domain, etc.)
      .filter((s) => !!s.domain && !!s.url);

    // 4) Rank sources: tier first, then score
    sourcesAll.sort((a, b) => b.score - a.score);

    // 5) Construct proof-grade set: exclude tier4 from the evidence set
    const proofSources = sourcesAll.filter((s) => s.tier !== "tier4").slice(0, maxSources);

    const { tier1, tier2, tier3 } = splitTiers(proofSources);

    if (tier1.length === 0) {
      warnings.push("No Tier 1 (official) sources found. Verdict confidence will be constrained.");
    }

    // 6) Call Claude with strict JSON contract
    const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

    const system = `
You are ProofLayer, an evidence-first verification engine.

CRITICAL OUTPUT RULES:
You MUST return valid JSON only.
Do not include markdown.
Do not include explanations outside JSON.
Do not wrap in \`\`\` blocks.

SOURCE HIERARCHY:
- Tier 1: .gov/.mil/.edu and official institutions (DECISIVE)
- Tier 2: reputable news/research/fact-check outlets (SUPPORTING)
- Tier 3: general web context only (NEVER decisive by itself)
- Social/UGC is NEVER decisive evidence

If Tier 1 conflicts with Tier 2 or Tier 3, Tier 1 wins.
Do not hallucinate citations. Only cite URLs provided.

OUTPUT JSON SCHEMA:
{
  "verdict": "true|false|misleading|unverified",
  "confidence": 0.0 to 1.0,
  "summary": "1-3 sentences",
  "bottomLine": "one decisive sentence",
  "whatDataShows": ["bullet 1", "bullet 2", "bullet 3"],
  "spreadFactors": ["reason 1", "reason 2", "reason 3"]
}
`.trim();

    const sourcesForModel = {
      claim,
      contextUrl: contextUrl || null,
      sources: {
        tier1: tier1.map((s) => ({ title: s.title, url: s.url, snippet: s.snippet })),
        tier2: tier2.map((s) => ({ title: s.title, url: s.url, snippet: s.snippet })),
        tier3: tier3.map((s) => ({ title: s.title, url: s.url, snippet: s.snippet })),
      },
      policy: {
        decisiveEvidence: "Tier1 > Tier2 > Tier3",
        neverDecisive: "Social/UGC (not provided here)",
      },
    };

    const user = `
Verify this claim:
"${claim}"

If a context URL exists, it is only context:
${contextUrl ? contextUrl : "(none)"}

Evidence sources by tier (use in order; do not invent anything):
${JSON.stringify(sourcesForModel, null, 2)}

Return STRICT JSON only, matching the required output shape.
`.trim();

    // Call Anthropic (outer catch handles errors)
    const raw = await callAnthropic({
      system,
      user,
      model,
      temperature: 0.3,
      maxTokens: 1200,
    });

    const jsonText = stripJsonFence(raw);
    const parsed = safeJsonParse<{
      verdict: any;
      confidence: any;
      summary: any;
      bottomLine: any;
      whatDataShows: any;
      spreadFactors: any;
      citations?: { tier1?: any; tier2?: any; tier3?: any };
    }>(jsonText);

    if (!parsed) {
      // If Claude returned malformed JSON, fail safely with constrained output
      warnings.push("Model output was not valid JSON; returning constrained unverified response.");
      const resp: VerifyResponse = {
        verificationId,
        verdict: "unverified",
        confidence: 0.2,
        summary: "Unable to parse the verification response. Please retry.",
        bottomLine: "Verification incomplete due to response formatting issues.",
        whatDataShows: ["Evidence extraction succeeded, but synthesis formatting failed."],
        spreadFactors: ["Claims often spread faster than corrections when phrased as absolutes."],
        sources: { tier1, tier2, tier3 },
        searchQueries,
        model,
        generatedAt,
        warnings,
      };
      return res.status(200).json(resp);
    }

    const verdict = normalizeVerdict(parsed.verdict);
    const confidence = clamp01(Number(parsed.confidence));

    // Confidence constraint: no Tier 1 sources => cap confidence
    const constrainedConfidence = tier1.length === 0 ? Math.min(confidence, 0.65) : confidence;

    const summary = isString(parsed.summary) ? parsed.summary.trim() : "Verification completed.";
    const bottomLine = isString(parsed.bottomLine) ? parsed.bottomLine.trim() : "Review the evidence and sources.";

    const whatDataShows = ensureArrayOfStrings(parsed.whatDataShows, [
      "Multiple sources were reviewed, but the available evidence is limited.",
      "Consider checking primary (official) data for a definitive answer.",
      "Some sources may be interpreting the same data differently.",
    ]);

    const spreadFactors = ensureArrayOfStrings(parsed.spreadFactors, [
      "High-emotion framing increases sharing even when details are unclear.",
      "Short, absolute claims often omit definitions and timeframes.",
      "Repetition across channels can create a false sense of certainty.",
    ]);

    const resp: VerifyResponse = {
      verificationId,
      verdict,
      confidence: constrainedConfidence,
      summary,
      bottomLine,
      whatDataShows,
      spreadFactors,
      sources: { tier1, tier2, tier3 },
      searchQueries,
      model,
      generatedAt,
      ...(warnings.length ? { warnings } : {}),
    };

    return res.status(200).json(resp);
  } catch (err: any) {
    // STEP 1: Final catch - return 200 with fallback JSON (NO 500s)
    console.error("LLM VERIFY ERROR:", err);

    return res.status(200).json({
      verdict: "unknown",
      confidence: 0,
      summary: "Verification failed due to an internal error.",
      bottomLine: "Unable to verify at this time.",
      whatDataShows: [],
      spreadFactors: [],
      sources: { tier1: [], tier2: [], tier3: [] },
      verificationId: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      model: DEFAULT_MODEL,
      searchQueries: [],
      error: "verifier_runtime_error",
      debug: err?.message?.slice(0, 500) // Include error message for debugging
    });
  }
}
