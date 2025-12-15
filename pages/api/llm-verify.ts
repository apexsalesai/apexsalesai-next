import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

type VerificationResult = {
  verificationId: string;
  verdict: string;
  confidence: number;
  summary: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources: { sourceId: string; title: string; url: string; domain?: string; tier?: number }[];
};

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

function buildMockResult(claim: string): VerificationResult {
  const baseVerdict = claim.toLowerCase().includes("flat") ? "Misleading" : "Needs Context";
  const confidence = claim ? 62 : 40;

  return {
    verificationId: uuidv4(),
    verdict: baseVerdict,
    confidence,
    summary:
      baseVerdict === "Misleading"
        ? "Available evidence does not support this claim as stated; reputable sources contradict the assertion."
        : "More context is required to establish the accuracy of this claim with confidence.",
    bottomLine: "Evidence review completed via ProofLayer pipeline.",
    spreadFactors: [
      "Emotionally charged phrasing can increase share velocity.",
      "Simplified statistics without source links spread quickly.",
    ],
    whatDataShows: [
      "Independent data from trusted sources does not confirm the numeric claim as stated.",
      "Context from primary sources is needed to validate causal assertions.",
    ],
    sources: [
      {
        sourceId: "src-001",
        title: "Primary reporting from reputable outlet",
        url: "https://example.com/article",
        domain: "example.com",
        tier: 1,
      },
      {
        sourceId: "src-002",
        title: "Official dataset / government source",
        url: "https://data.gov/example",
        domain: "data.gov",
        tier: 1,
      },
      {
        sourceId: "src-003",
        title: "Independent fact review",
        url: "https://factcheck.org/example",
        domain: "factcheck.org",
        tier: 2,
      },
    ],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { claim = "", link = "" } = (req.body || {}) as { claim?: string; link?: string };
    const trimmed = (claim || "").toString().trim();

    if (!trimmed) {
      return res.status(400).json({ error: "Claim is required" });
    }

    const result = buildMockResult(trimmed);

    return res.status(200).json({
      ...result,
      model: DEFAULT_MODEL,
      link,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Verification failed" });
  }
}
