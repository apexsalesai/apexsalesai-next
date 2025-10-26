import { NextResponse } from "next/server";

/**
 * POST /api/publish/email
 * Email publishing adapter (Resend/SendGrid)
 * 
 * Status: NOT IMPLEMENTED
 * TODO: Integrate with Resend or SendGrid API
 * Required env vars: RESEND_API_KEY or SENDGRID_API_KEY, EMAIL_FROM
 */
export async function POST(req: Request) {
  return NextResponse.json(
    { 
      ok: false, 
      message: "Email publishing not yet implemented. Requires Resend or SendGrid integration.",
      requiredEnvVars: ["RESEND_API_KEY", "EMAIL_FROM"],
      status: "pending_integration"
    },
    { status: 501 }
  );
}
