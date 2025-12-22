/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type Verdict = "true" | "false" | "misleading" | "unverified";
type VerdictClassification = "SUBSTANTIATED" | "CONTEXTUALLY_INCOMPLETE" | "NOT_SUPPORTED";
type ActionReadiness = "READY" | "LIMITED" | "NOT_RECOMMENDED";
type DecisionConfidence = "HIGH" | "MODERATE" | "LOW";
type TimeSensitivity = "LOW" | "MEDIUM" | "HIGH";
type PrimaryRisk = "REPUTATIONAL" | "LEGAL" | "REGULATORY" | "NONE";
type EvidenceStrength = "STRONG" | "MIXED" | "WEAK";
type ConfidenceColor = "GREEN" | "YELLOW" | "RED";
type ScenarioType = "PUBLISH" | "WAIT" | "IGNORE";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

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

type DecisionIntelligenceResult = {
  verificationId: string;
  verifiedAt: string;

  decisionPanel: {
    actionReadiness: ActionReadiness;
    decisionConfidence: DecisionConfidence;
    timeSensitivity: TimeSensitivity;
    primaryRisk: PrimaryRisk;
    recommendedAction: {
      headline: string;
      summary: string;
      do: string[];
      avoid: string[];
    };
  };

  verdict: {
    classification: VerdictClassification;
    confidenceBand: string;
    confidenceValue: number;
    confidenceColor: ConfidenceColor;
    evidenceStrength: EvidenceStrength;
    sourceConsensus: {
      tier1Count: number;
      tier2Count: number;
      tier3Count: number;
      summary: string;
    };
  };

  whatTheEvidenceShows: string[];
  whyThisNarrativeSpread: string[];

  actionScenarios: Array<{
    scenario: ScenarioType;
    risk: RiskLevel;
    impact: RiskLevel;
    notes: string;
  }>;

  sources: {
    tier1: Source[];
    tier2: Source[];
    tier3: Source[];
  };

  methodology: {
    approach: string;
    rankingLogic: string;
    limitations: string[];
  };

  // Internal fields
  searchQueries?: string[];
  model?: string;
  warnings?: string[];
};

// Legacy type for backward compatibility during migration
type VerifyResponse = DecisionIntelligenceResult;

type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: any;
  };
};

const DEFAULT_MODEL = "claude-sonnet-4-5";
const MAX_QUERY_COUNT = 6; // Increased from 4 to 6 for comprehensive coverage
const DEFAULT_MAX_SOURCES = 18; // Increased from 12 to 18
const MIN_TIER1_SOURCES = 2; // Minimum Tier 1 sources before accepting results
const MIN_TIER2_SOURCES = 3; // Minimum Tier 2 sources before accepting results
const RESULTS_PER_QUERY = 10; // Increased from 6 to 10 per query

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
  "loc.gov", // Library of Congress
  "archives.gov", // National Archives
  "si.edu", // Smithsonian Institution
  "nist.gov", // National Institute of Standards and Technology
  "usgs.gov", // US Geological Survey
  "energy.gov", // Department of Energy
  "epa.gov", // Environmental Protection Agency
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
  "britannica.com",
  "smithsonianmag.com",
  "nationalgeographic.com",
  "scientificamerican.com",
  "nature.com",
  "science.org",
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

  // Enhanced query strategy: official sources + historical records + fact-checking
  const queries: string[] = [];
  
  // Query 1: Government, military, and academic sources (highest authority)
  queries.push(`${clean} site:.gov OR site:.mil OR site:.edu`);
  
  // Query 2: Historical and archival sources (for historical claims)
  queries.push(`${clean} history archive museum library congress`);
  
  // Query 3: Official data and statistics
  queries.push(`${clean} data report statistics official`);
  
  // Query 4: Fact-checking organizations
  queries.push(`${clean} fact check OR factcheck OR snopes OR politifact`);
  
  // Query 5: Reputable news and research (Reuters, AP, BBC, etc.)
  queries.push(`${clean} site:reuters.com OR site:apnews.com OR site:bbc.com OR site:britannica.com`);
  
  // Query 6: International organizations and institutions
  queries.push(`${clean} site:un.org OR site:who.int OR site:worldbank.org OR site:oecd.org`);

  return queries.slice(0, MAX_QUERY_COUNT);
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
  console.log("API Key present:", !!apiKey);
  console.log("API Key length:", apiKey.length);

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

function getConfidenceBand(confidence: number): string {
  if (confidence >= 0.85) return "85–100%";
  if (confidence >= 0.75) return "75–84%";
  if (confidence >= 0.62) return "62–74%";
  if (confidence >= 0.50) return "50–61%";
  if (confidence >= 0.20) return "20–49%";
  return "0–19%";
}

function getConfidenceColor(confidence: number): ConfidenceColor {
  if (confidence >= 0.85) return "GREEN";
  if (confidence >= 0.50) return "YELLOW";
  return "RED";
}

function getDecisionConfidence(confidence: number): DecisionConfidence {
  if (confidence >= 0.85) return "HIGH";
  if (confidence >= 0.50) return "MODERATE";
  return "LOW";
}

function mapVerdictToClassification(verdict: Verdict, confidence: number): VerdictClassification {
  if (verdict === "true" && confidence >= 0.70) return "SUBSTANTIATED";
  if (verdict === "false" && confidence >= 0.70) return "NOT_SUPPORTED";
  if (verdict === "misleading" || (confidence >= 0.40 && confidence < 0.70)) return "CONTEXTUALLY_INCOMPLETE";
  return "NOT_SUPPORTED";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // STEP 1: Hard wrap entire handler (NO 500s)
  try {
    // Environment guards
    if (!process.env.ANTHROPIC_API_KEY || !process.env.BRAVE_SEARCH_API_KEY) {
      return res.status(200).json({
        verificationId: crypto.randomUUID(),
        verifiedAt: new Date().toISOString(),
        decisionPanel: {
          actionReadiness: "NOT_RECOMMENDED",
          decisionConfidence: "LOW",
          timeSensitivity: "LOW",
          primaryRisk: "NONE",
          recommendedAction: {
            headline: "Verification unavailable due to missing API configuration",
            summary: "System configuration error. Please contact administrator.",
            do: ["Contact system administrator"],
            avoid: ["Attempting verification until configuration is resolved"]
          }
        },
        verdict: {
          classification: "NOT_SUPPORTED",
          confidenceBand: "0–19%",
          confidenceValue: 0,
          confidenceColor: "RED",
          evidenceStrength: "WEAK",
          sourceConsensus: {
            tier1Count: 0,
            tier2Count: 0,
            tier3Count: 0,
            summary: "Configuration error prevented analysis"
          }
        },
        whatTheEvidenceShows: [],
        whyThisNarrativeSpread: [],
        actionScenarios: [],
        sources: { tier1: [], tier2: [], tier3: [] },
        methodology: {
          approach: "Multi-source consensus analysis",
          rankingLogic: "Tier 1 (official) > Tier 2 (reputable) > Tier 3 (context)",
          limitations: ["Missing API configuration"]
        },
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

    // 2) Brave search in parallel - COMPREHENSIVE SEARCH
    const braveResultsNested = await Promise.all(
      searchQueries.map(async (q) => {
        try {
          return await braveWebSearch(q, RESULTS_PER_QUERY);
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

    // 🔒 QUALITY GATE: Check if we have sufficient authoritative sources
    const qualityGateWarnings: string[] = [];
    
    if (tier1.length === 0) {
      qualityGateWarnings.push("⚠️ CRITICAL: No Tier 1 (official government/academic) sources found");
      warnings.push("No Tier 1 (official) sources found. Verdict confidence will be constrained.");
    } else if (tier1.length < MIN_TIER1_SOURCES) {
      qualityGateWarnings.push(`⚠️ WARNING: Only ${tier1.length} Tier 1 source(s) found (minimum recommended: ${MIN_TIER1_SOURCES})`);
    }
    
    if (tier2.length < MIN_TIER2_SOURCES) {
      qualityGateWarnings.push(`⚠️ WARNING: Only ${tier2.length} Tier 2 source(s) found (minimum recommended: ${MIN_TIER2_SOURCES})`);
    }
    
    // Log quality gate status
    if (qualityGateWarnings.length > 0) {
      console.warn("=== QUALITY GATE WARNINGS ===");
      qualityGateWarnings.forEach(w => console.warn(w));
      console.warn(`Total sources found: ${sourcesAll.length} (Tier1: ${tier1.length}, Tier2: ${tier2.length}, Tier3: ${tier3.length})`);
      console.warn("Search queries used:", searchQueries);
      console.warn("=== END QUALITY GATE ===");
    } else {
      console.log(`✅ Quality gate passed: ${tier1.length} Tier 1, ${tier2.length} Tier 2, ${tier3.length} Tier 3 sources`);
    }

    // 6) Call Claude with strict JSON contract
    const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

    const system = `
You are ProofLayer, a decision-grade intelligence system for high-trust environments.

Your role: Transform uncertain claims into clear, defensible decisions.

CRITICAL OUTPUT RULES:
- Return ONLY valid JSON
- No markdown, no explanations outside JSON
- No \`\`\` code blocks
- Use calm, institutional language (never sensational)
- Focus on actionability, not just truth

FAILURE & FALLBACK BEHAVIOR:
- Never guess
- Never hedge language
- NEVER default to "Inconclusive" or "CONTEXTUALLY_INCOMPLETE" if Tier-1 sources exist and align
- If data is missing or ambiguous, output: "No authoritative Tier-1 data exists to substantiate this claim at this time."
- Calm. Defensible. Final.

NON-NEGOTIABLE EVIDENCE HIERARCHY:
TIER-1 (ABSOLUTE PRIORITY):
- Official government sources (.gov, .mil)
- Government statistical agencies (Census, BLS, DHS, CBP, etc.)
- Court records
- Primary regulatory bodies

If Tier-1 sources exist and align:
- They override ALL other sources
- The verdict CANNOT be "Inconclusive" or "CONTEXTUALLY_INCOMPLETE"
- You MUST choose either SUBSTANTIATED or NOT_SUPPORTED based on Tier-1 evidence

TIER-2 (SUPPORTING):
- Reputable research institutions
- Peer-reviewed studies
- Major non-partisan fact-checking orgs (AP, Reuters, Snopes, PolitiFact)

TIER-3 (CONTEXT ONLY):
- Media articles
- Think tanks
- Wikipedia
- Commentary

Tier-3 sources may NEVER determine verdicts.

Do not hallucinate. Only cite provided URLs.

OUTPUT JSON SCHEMA:
{
  "decisionPanel": {
    "actionReadiness": "READY|LIMITED|NOT_RECOMMENDED",
    "decisionConfidence": "HIGH|MODERATE|LOW",
    "timeSensitivity": "LOW|MEDIUM|HIGH",
    "primaryRisk": "REPUTATIONAL|LEGAL|REGULATORY|NONE",
    "recommendedAction": {
      "headline": "One decisive sentence",
      "summary": "2-3 sentences explaining the recommended action",
      "do": ["Action 1", "Action 2"],
      "avoid": ["Risk 1", "Risk 2"]
    }
  },
  "verdictClassification": "SUBSTANTIATED|CONTEXTUALLY_INCOMPLETE|NOT_SUPPORTED",
  "confidenceValue": 0.0 to 1.0,
  "evidenceStrength": "STRONG|MIXED|WEAK",
  "whatTheEvidenceShows": ["Finding 1", "Finding 2", "Finding 3"],
  "whyThisNarrativeSpread": ["Reason 1", "Reason 2"],
  "actionScenarios": [
    {
      "scenario": "PUBLISH|WAIT|IGNORE",
      "risk": "LOW|MEDIUM|HIGH",
      "impact": "LOW|MEDIUM|HIGH",
      "notes": "Brief explanation"
    }
  ]
}

CONFIDENCE MODEL (NO FAKE PRECISION):
You must NEVER output raw percentages like "1%".
You MUST output:

A. Confidence Band:
- HIGH (85-100%) - Strong Tier-1 consensus
- MODERATE (50-84%) - Some Tier-1 support or strong Tier-2 consensus
- LOW (0-49%) - No Tier-1, weak evidence

B. Evidence Strength:
- STRONG - Multiple aligned Tier-1 sources
- MIXED - Conflicting Tier-1 or Tier-1 + Tier-2 conflict
- WEAK - No Tier-1 sources

C. Source Consensus:
Example: "Aligned across 3 Tier-1 government sources"

DECISION LOGIC:
- actionReadiness: 
  * READY (🟢 SAFE TO PUBLISH) - High confidence + strong Tier-1 evidence
  * LIMITED (🟡 PUBLISH WITH CONTEXT) - Moderate confidence or missing context
  * NOT_RECOMMENDED (🔴 DO NOT PUBLISH) - Low confidence or contradictory evidence

- decisionConfidence: HIGH/MODERATE/LOW (as defined above)

- verdictClassification: 
  * SUBSTANTIATED: Tier-1 sources directly support the claim with high confidence
  * NOT_SUPPORTED: Tier-1 sources directly contradict the claim OR claim is factually false based on official data
  * CONTEXTUALLY_INCOMPLETE: ONLY use if NO Tier-1 exists OR Tier-1 is ambiguous/incomplete

- evidenceStrength: STRONG/MIXED/WEAK (as defined above)

- confidenceValue: 0.0 to 1.0 (be decisive - if Tier-1 clearly contradicts, use 0.85+)

CRITICAL RULES:
1. When official government sources (.gov) provide clear data that contradicts a claim:
   - verdictClassification: "NOT_SUPPORTED"
   - confidenceValue: 0.85 or higher
   - evidenceStrength: "STRONG"
   - decisionConfidence: "HIGH"

2. When Tier-1 sources exist and align, you CANNOT use "CONTEXTUALLY_INCOMPLETE"

3. Decision Panel is MANDATORY in every response

ACTION SCENARIOS:
Always provide 2-3 scenarios (PUBLISH, WAIT, IGNORE) with risk/impact assessment.
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
      decisionPanel?: any;
      verdictClassification?: any;
      confidenceValue?: any;
      evidenceStrength?: any;
      whatTheEvidenceShows?: any;
      whyThisNarrativeSpread?: any;
      actionScenarios?: any;
      // Legacy fields for backward compatibility
      verdict?: any;
      confidence?: any;
      whatDataShows?: any;
      spreadFactors?: any;
    }>(jsonText);

    if (!parsed) {
      // If Claude returned malformed JSON, fail safely with constrained output
      warnings.push("Model output was not valid JSON; returning constrained unverified response.");
      const resp: VerifyResponse = {
        verificationId,
        verifiedAt: generatedAt,
        decisionPanel: {
          actionReadiness: "NOT_RECOMMENDED",
          decisionConfidence: "LOW",
          timeSensitivity: "LOW",
          primaryRisk: "NONE",
          recommendedAction: {
            headline: "Verification incomplete due to response formatting issues",
            summary: "Unable to parse the verification response. Please retry or contact support.",
            do: ["Retry verification", "Check claim formatting"],
            avoid: ["Publishing without verification", "Making decisions based on incomplete data"]
          }
        },
        verdict: {
          classification: "NOT_SUPPORTED",
          confidenceBand: "0–19%",
          confidenceValue: 0.2,
          confidenceColor: "RED",
          evidenceStrength: "WEAK",
          sourceConsensus: {
            tier1Count: tier1.length,
            tier2Count: tier2.length,
            tier3Count: tier3.length,
            summary: "Evidence extraction succeeded, but synthesis formatting failed"
          }
        },
        whatTheEvidenceShows: ["Evidence extraction succeeded, but synthesis formatting failed."],
        whyThisNarrativeSpread: ["Claims often spread faster than corrections when phrased as absolutes."],
        actionScenarios: [
          {
            scenario: "IGNORE",
            risk: "LOW",
            impact: "LOW",
            notes: "Cannot act on incomplete verification"
          }
        ],
        sources: { tier1, tier2, tier3 },
        methodology: {
          approach: "Multi-source consensus analysis",
          rankingLogic: "Tier 1 (official) > Tier 2 (reputable) > Tier 3 (context)",
          limitations: ["Response formatting error prevented full analysis"]
        },
        searchQueries,
        model,
        warnings,
      };
      return res.status(200).json(resp);
    }

    // Extract confidence value (try new format first, fall back to legacy)
    const rawConfidence = parsed.confidenceValue !== undefined 
      ? Number(parsed.confidenceValue)
      : (parsed.confidence !== undefined ? Number(parsed.confidence) : 0.5);
    const confidence = clamp01(rawConfidence);

    // Confidence constraint: no Tier 1 sources => cap confidence
    const constrainedConfidence = tier1.length === 0 ? Math.min(confidence, 0.65) : confidence;

    // Extract verdict classification (try new format first, fall back to legacy)
    const verdictClassification: VerdictClassification = 
      parsed.verdictClassification || 
      mapVerdictToClassification(normalizeVerdict(parsed.verdict), constrainedConfidence);

    // Extract evidence strength (try new format first, calculate from tiers as fallback)
    const evidenceStrength: EvidenceStrength = 
      parsed.evidenceStrength || 
      (tier1.length >= 2 ? "STRONG" : tier1.length >= 1 ? "MIXED" : "WEAK");

    // Extract decision panel (with intelligent defaults)
    const decisionPanel = parsed.decisionPanel || {
      actionReadiness: constrainedConfidence >= 0.85 ? "READY" : constrainedConfidence >= 0.50 ? "LIMITED" : "NOT_RECOMMENDED",
      decisionConfidence: getDecisionConfidence(constrainedConfidence),
      timeSensitivity: "MEDIUM",
      primaryRisk: "REPUTATIONAL",
      recommendedAction: {
        headline: constrainedConfidence >= 0.70 
          ? "This claim can be referenced with appropriate caveats"
          : "Additional verification recommended before publication",
        summary: constrainedConfidence >= 0.70
          ? "Evidence provides reasonable support for this claim, though context and limitations should be noted."
          : "Current evidence is insufficient for confident publication. Consider waiting for additional authoritative sources.",
        do: constrainedConfidence >= 0.70 
          ? ["Reference with attribution", "Include source links", "Note any limitations"]
          : ["Seek additional Tier 1 sources", "Verify with subject matter experts", "Monitor for updates"],
        avoid: constrainedConfidence >= 0.70
          ? ["Absolute language", "Omitting caveats", "Overgeneralizing"]
          : ["Publishing as fact", "Amplifying without verification", "Making definitive statements"]
      }
    };

    // Extract evidence findings
    const whatTheEvidenceShows = ensureArrayOfStrings(
      parsed.whatTheEvidenceShows || parsed.whatDataShows,
      [
        "Multiple sources were reviewed, but the available evidence is limited.",
        "Consider checking primary (official) data for a definitive answer.",
        "Some sources may be interpreting the same data differently.",
      ]
    );

    // Extract narrative spread factors
    const whyThisNarrativeSpread = ensureArrayOfStrings(
      parsed.whyThisNarrativeSpread || parsed.spreadFactors,
      [
        "High-emotion framing increases sharing even when details are unclear.",
        "Short, absolute claims often omit definitions and timeframes.",
        "Repetition across channels can create a false sense of certainty.",
      ]
    );

    // Extract or generate action scenarios
    const actionScenarios = Array.isArray(parsed.actionScenarios) && parsed.actionScenarios.length > 0
      ? parsed.actionScenarios.map((s: any) => ({
          scenario: s.scenario || "WAIT",
          risk: s.risk || "MEDIUM",
          impact: s.impact || "MEDIUM",
          notes: isString(s.notes) ? s.notes : "Review evidence before deciding"
        }))
      : [
          {
            scenario: "PUBLISH" as ScenarioType,
            risk: constrainedConfidence >= 0.85 ? "LOW" as RiskLevel : "MEDIUM" as RiskLevel,
            impact: "MEDIUM" as RiskLevel,
            notes: constrainedConfidence >= 0.85 
              ? "Strong evidence supports publication with standard attribution"
              : "Moderate evidence; include caveats and limitations"
          },
          {
            scenario: "WAIT" as ScenarioType,
            risk: "LOW" as RiskLevel,
            impact: "LOW" as RiskLevel,
            notes: "Waiting for additional authoritative sources reduces risk"
          },
          {
            scenario: "IGNORE" as ScenarioType,
            risk: "NONE" as RiskLevel,
            impact: "NONE" as RiskLevel,
            notes: "No action required if claim is not relevant to your audience"
          }
        ];

    // Build final response
    const resp: VerifyResponse = {
      verificationId,
      verifiedAt: generatedAt,
      decisionPanel,
      verdict: {
        classification: verdictClassification,
        confidenceBand: getConfidenceBand(constrainedConfidence),
        confidenceValue: constrainedConfidence,
        confidenceColor: getConfidenceColor(constrainedConfidence),
        evidenceStrength,
        sourceConsensus: {
          tier1Count: tier1.length,
          tier2Count: tier2.length,
          tier3Count: tier3.length,
          summary: tier1.length >= 2 
            ? `${tier1.length} authoritative sources provide strong consensus`
            : tier1.length === 1
            ? "Single authoritative source; additional corroboration recommended"
            : "No authoritative sources found; evidence is limited to secondary sources"
        }
      },
      whatTheEvidenceShows,
      whyThisNarrativeSpread,
      actionScenarios,
      sources: { tier1, tier2, tier3 },
      methodology: {
        approach: "Multi-source consensus analysis",
        rankingLogic: "Tier 1 (official) > Tier 2 (reputable) > Tier 3 (context)",
        limitations: tier1.length === 0 
          ? ["No official sources available", "Confidence capped at 65%"]
          : []
      },
      searchQueries,
      model,
      ...(warnings.length ? { warnings } : {}),
    };

    return res.status(200).json(resp);
  } catch (err: any) {
    // STEP 1: Final catch - return 200 with fallback JSON (NO 500s)
    console.error("=== LLM VERIFY ERROR ===");
    console.error("Error message:", err?.message);
    console.error("Error stack:", err?.stack);
    console.error("Full error:", JSON.stringify(err, null, 2));
    console.error("=== END ERROR ===");

    return res.status(200).json({
      verificationId: crypto.randomUUID(),
      verifiedAt: new Date().toISOString(),
      decisionPanel: {
        actionReadiness: "NOT_RECOMMENDED",
        decisionConfidence: "LOW",
        timeSensitivity: "LOW",
        primaryRisk: "NONE",
        recommendedAction: {
          headline: "Verification failed due to an internal error",
          summary: "Unable to complete verification at this time. Please retry or contact support.",
          do: ["Retry verification", "Contact support if issue persists"],
          avoid: ["Publishing without verification", "Making decisions based on incomplete data"]
        }
      },
      verdict: {
        classification: "NOT_SUPPORTED",
        confidenceBand: "0–19%",
        confidenceValue: 0,
        confidenceColor: "RED",
        evidenceStrength: "WEAK",
        sourceConsensus: {
          tier1Count: 0,
          tier2Count: 0,
          tier3Count: 0,
          summary: "Verification system error prevented analysis"
        }
      },
      whatTheEvidenceShows: ["Verification system error prevented analysis"],
      whyThisNarrativeSpread: [],
      actionScenarios: [
        {
          scenario: "IGNORE",
          risk: "LOW",
          impact: "LOW",
          notes: "Cannot act on failed verification"
        }
      ],
      sources: { tier1: [], tier2: [], tier3: [] },
      methodology: {
        approach: "Multi-source consensus analysis",
        rankingLogic: "Tier 1 (official) > Tier 2 (reputable) > Tier 3 (context)",
        limitations: ["System error prevented analysis"]
      },
      model: DEFAULT_MODEL,
      searchQueries: [],
      error: "verifier_runtime_error",
      debug: err?.message?.slice(0, 500) // Include error message for debugging
    });
  }
}
