import { NextResponse } from "next/server";

/**
 * POST /api/publish/linkedin
 * LinkedIn publishing adapter (UGC Posts API)
 * 
 * Status: NOT IMPLEMENTED
 * TODO: Integrate with LinkedIn UGC Posts API
 * Required env vars: LINKEDIN_ACCESS_TOKEN, LINKEDIN_ACTOR_URN
 * Character limit: 3000
 */
export async function POST(req: Request) {
  return NextResponse.json(
    { 
      ok: false, 
      message: "LinkedIn publishing not yet implemented. Requires LinkedIn OAuth integration.",
      requiredEnvVars: ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_ACTOR_URN"],
      characterLimit: 3000,
      status: "pending_integration"
    },
    { status: 501 }
  );
}
