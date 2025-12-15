import { NextResponse } from "next/server";

const DEFAULT_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { claim?: string; link?: string };
    const claim = (body?.claim || "").trim();
    if (!claim) {
      return NextResponse.json({ error: "Claim is required" }, { status: 400 });
    }

    // Forward to the verifier if available
    try {
      const res = await fetch(`${DEFAULT_BASE.replace(/\/$/, "")}/api/llm-verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ claim, link: body?.link }),
      });
      const json = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: json?.error || "Verification failed" }, { status: res.status });
      }
      return NextResponse.json(json, { status: 200 });
    } catch (err: any) {
      return NextResponse.json({ error: err?.message || "Verification service unavailable" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
