/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005").replace(/\/$/, "");

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // STEP 4: Reality Scan MUST Catch Everything (NO RAW THROWS)
  try {
    const { claim = "", url = "" } = (req.body || {}) as { claim?: string; url?: string };
    const trimmedClaim = (claim || "").toString().trim();

    if (!trimmedClaim) {
      return res.status(400).json({ error: "Claim is required" });
    }

    // Call llm-verify (orchestrator pattern)
    const verifyResp = await fetch(`${BASE_URL}/api/llm-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: trimmedClaim, url }),
    });

    const data = await verifyResp.json();

    if (!verifyResp.ok) {
      return res.status(500).json({
        error: "Verification failed",
        upstream: data
      });
    }

    return res.status(200).json(data);

  } catch (err: any) {
    return res.status(500).json({
      error: "Reality scan crashed",
      message: err?.message ?? "Unknown error",
      stage: "reality-scan"
    });
  }
}
