import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.claim || typeof body.claim !== "string") {
      return NextResponse.json({ error: "Missing or invalid claim" }, { status: 400 });
    }

    // Diagnostic response to confirm POST wiring; re-enable LLM after verifying 200 here.
    return NextResponse.json({
      status: "ok",
      received: true,
      claim: body.claim,
    });
  } catch (err) {
    console.error("reality-scan POST error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
