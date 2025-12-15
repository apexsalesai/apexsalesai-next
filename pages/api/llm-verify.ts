import type { NextApiRequest, NextApiResponse } from "next";
import { randomUUID } from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { claim } = req.body || {};
    if (!claim || typeof claim !== "string" || !claim.trim()) {
      return res.status(400).json({ error: "Missing or invalid claim" });
    }

    // Diagnostic stub to keep pipeline alive; replace with real LLM call when ready.
    const verificationId = randomUUID();
    return res.status(200).json({
      verificationId,
      verdict: "UNVERIFIABLE",
      confidence: 0,
      summary: "Verification could not be completed.",
      sources: [],
      whatDataShows: [],
      spreadFactors: [],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Internal server error" });
  }
}
