import { prisma } from "@lib/telemetry-phase2";
import { NextResponse } from "next/server";
import { publishEmail } from "@lib/validators";
import { Resend } from "resend";

/**
 * POST /api/publish/email
 * Email publishing adapter via Resend
 * 
 * Body:
 * - assetId: string (required)
 * - to: string | string[] (required) - recipient email(s)
 * - subject: string (optional, uses asset title if not provided)
 * - scheduledAt: Date (optional, sends immediately if not provided)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request
    const validation = publishEmail.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { assetId, to, subject, scheduledAt } = validation.data;

    // Check for Resend API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Fetch the ContentAsset
    const asset = await prisma.contentAsset.findUnique({
      where: { id: assetId },
      include: { campaign: true },
    });

    if (!asset) {
      return NextResponse.json(
        { ok: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    if (asset.type !== "email") {
      return NextResponse.json(
        { ok: false, error: "Asset type must be 'email'" },
        { status: 400 }
      );
    }

    // If scheduled, create ScheduledPublish record
    if (scheduledAt) {
      const scheduled = await prisma.scheduledPublish.create({
        data: {
          assetId,
          channel: "email",
          scheduledAt: new Date(scheduledAt),
          status: "pending",
          payload: {
            to,
            subject: subject || asset.title,
            campaignId: asset.campaignId,
          },
        },
      });

      return NextResponse.json({
        ok: true,
        scheduled: true,
        scheduledPublish: scheduled,
        message: `Email scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      }, { status: 202 });
    }

    // Otherwise, send immediately via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailData = await resend.emails.send({
      from: process.env.EMAIL_FROM || "ApexStudio <no-reply@apexsalesai.com>",
      to: Array.isArray(to) ? to : [to],
      subject: subject || asset.title,
      html: asset.body || "",
    });

    if (!emailData.data) {
      throw new Error("Resend API returned no data");
    }

    // Update asset status
    await prisma.contentAsset.update({
      where: { id: assetId },
      data: {
        status: "published",
        publishedAt: new Date(),
        metadata: {
          ...((asset.metadata as any) || {}),
          emailId: emailData.data.id,
          recipients: Array.isArray(to) ? to : [to],
        },
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        tenantId: 1, // TODO: Get from auth session
        actorId: "system",
        action: "send_email",
        targetType: "asset",
        targetId: assetId,
        externalId: emailData.data.id,
        after: {
          emailId: emailData.data.id,
          campaignId: asset.campaignId,
          recipients: Array.isArray(to) ? to : [to],
          sentAt: new Date(),
        },
        status: "success",
      },
    });

    return NextResponse.json({
      ok: true,
      scheduled: false,
      email: {
        id: emailData.data.id,
        subject: subject || asset.title,
        recipients: Array.isArray(to) ? to : [to],
        sentAt: new Date(),
      },
      asset: {
        id: asset.id,
        status: "published",
        publishedAt: asset.publishedAt,
      },
    });

  } catch (error: any) {
    console.error("Email publish failed:", error);
    
    // Log failure to audit
    try {
      const body = await req.json();
      await prisma.auditLog.create({
        data: {
          tenantId: 1,
          actorId: "system",
          action: "send_email",
          targetType: "asset",
          targetId: body.assetId,
          status: "error",
          details: error.message,
        },
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return NextResponse.json(
      { ok: false, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
