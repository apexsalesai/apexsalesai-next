import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { claim, link } = req.body || {};
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.apexsalesai.com";

    const upstream = await fetch(`${base.replace(/\/$/, "")}/api/llm-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim, link }),
    });

    const text = await upstream.text();
    const json = text ? JSON.parse(text) : {};

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: json?.error || "Verification failed",
      });
    }

    return res.status(200).json(json);
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || "Internal server error",
    });
  }
}
