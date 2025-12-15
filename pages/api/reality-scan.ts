import type { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const claim = typeof req.body?.claim === "string" ? req.body.claim.trim() : "";
    const link = typeof req.body?.link === "string" ? req.body.link : undefined;
    if (!claim) {
      return res.status(400).json({ error: "Claim is required" });
    }

    const base = (() => {
      try {
        return new URL(DEFAULT_BASE).origin;
      } catch {
        return DEFAULT_BASE.replace(/\/$/, "");
      }
    })();
    const target = `${base.replace(/\/$/, "")}/api/llm-verify`;

    const upstream = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ claim, link }),
    });

    const text = await upstream.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      return res.status(502).json({ error: "Upstream verifier returned invalid JSON" });
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: json?.error || "Verification failed" });
    }

    return res.status(200).json(json);
  } catch (err: any) {
    return res.status(502).json({ error: err?.message || "Verification failed" });
  }
}
