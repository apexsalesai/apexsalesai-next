import { prisma } from "@lib/telemetry-phase2";
import { NextResponse } from "next/server";
import { publishSocial } from "@lib/validators";

/**
 * POST /api/publish/linkedin
 * LinkedIn publishing adapter via UGC Posts API v2
 * 
 * Body:
 * - assetId: string (required)
 * - text: string (optional, uses asset body if not provided)
 * - scheduledAt: Date (optional, posts immediately if not provided)
 * 
 * Character limit: 3000
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

    // Check for LinkedIn credentials
    if (!process.env.LINKEDIN_ACCESS_TOKEN || !process.env.LINKEDIN_ACTOR_URN) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "LinkedIn credentials not configured",
          required: ["LINKEDIN_ACCESS_TOKEN", "LINKEDIN_ACTOR_URN"]
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

    const postText = text || asset.body || "";
    
    // Check character limit
    if (postText.length > 3000) {
      return NextResponse.json(
        { ok: false, error: "Content exceeds LinkedIn limit of 3000 characters", length: postText.length },
        { status: 400 }
      );
    }

    // If scheduled, create ScheduledPublish record
    if (scheduledAt) {
      const scheduled = await prisma.scheduledPublish.create({
        data: {
          assetId,
          channel: "linkedin",
          scheduledAt: new Date(scheduledAt),
          status: "pending",
          payload: {
            text: postText,
            campaignId: asset.campaignId,
          },
        },
      });

      return NextResponse.json({
        ok: true,
        scheduled: true,
        scheduledPublish: scheduled,
        message: `LinkedIn post scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      }, { status: 202 });
    }

    // Otherwise, post immediately via LinkedIn API
    const ugcPost = {
      author: process.env.LINKEDIN_ACTOR_URN,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postText,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(ugcPost),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn API error: ${response.status} - ${errorText}`);
    }

    const postData = await response.json();
    const postId = postData.id;

    // Update asset status
    await prisma.contentAsset.update({
      where: { id: assetId },
      data: {
        status: "published",
        publishedAt: new Date(),
        metadata: {
          ...((asset.metadata as any) || {}),
          linkedinPostId: postId,
          linkedinPostUrn: postData.id,
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
        externalId: postId,
        after: {
          platform: "linkedin",
          postId,
          postUrn: postData.id,
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
        id: postId,
        platform: "linkedin",
        text: postText,
        publishedAt: new Date(),
        url: `https://www.linkedin.com/feed/update/${postId}`,
      },
      asset: {
        id: asset.id,
        status: "published",
        publishedAt: asset.publishedAt,
      },
    });

  } catch (error: any) {
    console.error("LinkedIn publish failed:", error);
    
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
