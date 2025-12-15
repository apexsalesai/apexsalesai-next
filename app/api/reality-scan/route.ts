import { NextResponse } from "next/server";

const DEFAULT_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { claim?: string; link?: string };
    const claim = (body?.claim || "").trim();
    if (!claim) {
      return NextResponse.json({ error: "Claim is required" }, { status: 400 });
    }

    const base = (() => {
      try {
        return new URL(req.url).origin;
      } catch {
        return DEFAULT_BASE.replace(/\/$/, "");
      }
    })();

    // Forward to the verifier if available
    const target = `${base.replace(/\/$/, "")}/api/llm-verify`;
    const res = await fetch(target, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ claim, link: body?.link }),
    }).catch((err: any) => {
      return NextResponse.json({ error: err?.message || "Verification service unavailable" }, { status: 502 });
    });

    // If fetch failed and returned a Response from catch, short-circuit
    if (res instanceof NextResponse) {
      return res;
    }

    const text = await res.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      return NextResponse.json({ error: "Upstream verifier returned invalid JSON" }, { status: 502 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: json?.error || "Verification failed" }, { status: res.status });
    }

    return NextResponse.json(json, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
