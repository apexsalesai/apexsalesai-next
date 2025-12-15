import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Minimal pass-through to llm-verify; validated POST handler to clear 405.
  try {
    const body = (await req.json()) as { claim?: string; link?: string };
    const claim = (body?.claim || "").trim();
    const link = body?.link;
    if (!claim) {
      return NextResponse.json({ error: "Claim is required" }, { status: 400 });
    }

    // Use the current origin for upstream call; fallback to env base.
    const baseFromReq = (() => {
      try {
        return new URL(req.url).origin;
      } catch {
        return "";
      }
    })();
    const baseEnv = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const targetBase = (baseFromReq || baseEnv).replace(/\/$/, "");
    const target = `${targetBase}/api/llm-verify`;

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
      return NextResponse.json({ error: "Upstream verifier returned invalid JSON" }, { status: 502 });
    }

    if (!upstream.ok) {
      return NextResponse.json({ error: json?.error || "Verification failed" }, { status: upstream.status });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Verification failed" }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
