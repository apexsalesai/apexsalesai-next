import { prisma } from "@lib/telemetry-phase2";
import { NextResponse } from "next/server";
import { publishSocial } from "@lib/validators";

/**
 * POST /api/publish/x
 * X/Twitter publishing adapter via API v2
 * 
 * Body:
 * - assetId: string (required)
 * - text: string (optional, uses asset body if not provided)
 * - scheduledAt: Date (optional, posts immediately if not provided)
 * 
 * Character limit: 280
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request
    const validation = publishSocial.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { assetId, text, scheduledAt } = validation.data;

    // Check for Twitter credentials
    if (!process.env.TWITTER_BEARER_TOKEN) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Twitter credentials not configured",
          required: ["TWITTER_BEARER_TOKEN"]
        },
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

    if (asset.type !== "social") {
      return NextResponse.json(
        { ok: false, error: "Asset type must be 'social'" },
        { status: 400 }
      );
    }

    const tweetText = text || asset.body || "";
    
    // Check character limit
    if (tweetText.length > 280) {
      return NextResponse.json(
        { ok: false, error: "Content exceeds X/Twitter limit of 280 characters", length: tweetText.length },
        { status: 400 }
      );
    }

    // If scheduled, create ScheduledPublish record
    if (scheduledAt) {
      const scheduled = await prisma.scheduledPublish.create({
        data: {
          assetId,
          channel: "x",
          scheduledAt: new Date(scheduledAt),
          status: "pending",
          payload: {
            text: tweetText,
            campaignId: asset.campaignId,
          },
        },
      });

      return NextResponse.json({
        ok: true,
        scheduled: true,
        scheduledPublish: scheduled,
        message: `X post scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      }, { status: 202 });
    }

    // Otherwise, post immediately via Twitter API v2
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: tweetText,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Twitter API error: ${response.status} - ${errorText}`);
    }

    const tweetData = await response.json();
    const tweetId = tweetData.data.id;

    // Update asset status
    await prisma.contentAsset.update({
      where: { id: assetId },
      data: {
        status: "published",
        publishedAt: new Date(),
        metadata: {
          ...((asset.metadata as any) || {}),
          tweetId,
          tweetUrl: `https://twitter.com/i/web/status/${tweetId}`,
        },
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        tenantId: 1, // TODO: Get from auth session
        actorId: "system",
        action: "post_social",
        targetType: "asset",
        targetId: assetId,
        externalId: tweetId,
        after: {
          platform: "x",
          tweetId,
          campaignId: asset.campaignId,
          publishedAt: new Date(),
        },
        status: "success",
      },
    });

    return NextResponse.json({
      ok: true,
      scheduled: false,
      post: {
        id: tweetId,
        platform: "x",
        text: tweetText,
        publishedAt: new Date(),
        url: `https://twitter.com/i/web/status/${tweetId}`,
      },
      asset: {
        id: asset.id,
        status: "published",
        publishedAt: asset.publishedAt,
      },
    });

  } catch (error: any) {
    console.error("X/Twitter publish failed:", error);
    
    // Log failure to audit
    try {
      const body = await req.json();
      await prisma.auditLog.create({
        data: {
          tenantId: 1,
          actorId: "system",
          action: "post_social",
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
