import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

type ApiResponse = {
  verificationId?: string;
  verdict?: string;
  confidence?: number;
  summary?: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources?: { sourceId?: string; title?: string; url?: string; domain?: string; tier?: number }[];
  error?: string;
  model?: string;
};

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://apexsalesai.com").replace(/\/$/, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { claim = "", link = "" } = (req.body || {}) as { claim?: string; link?: string };
    const trimmedClaim = (claim || "").toString().trim();

    if (!trimmedClaim) {
      return res.status(400).json({ error: "Claim is required" });
    }

    // Call local verifier to keep a single source of truth for the verdict payload.
    const upstream = await fetch(`${BASE_URL}/api/llm-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: trimmedClaim, link }),
    });

    const text = await upstream.text();
    const json = text ? (JSON.parse(text) as ApiResponse) : {};

    if (!upstream.ok || json.error) {
      return res
        .status(upstream.status || 500)
        .json({ error: json.error || "Verification failed", verdict: json.verdict, confidence: json.confidence });
    }

    const verificationId = json.verificationId || uuidv4();

    return res.status(200).json({
      ...json,
      verificationId,
      model: DEFAULT_MODEL,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Verification failed" });
  }
}
