import { prisma } from "@lib/telemetry-phase2";
import { NextResponse } from "next/server";
import { publishBlog } from "@lib/validators";
import { revalidatePath } from "next/cache";

/**
 * POST /api/publish/blog
 * Publishes a ContentAsset as a BlogPost
 * 
 * Body:
 * - assetId: string (required)
 * - title: string (optional, uses asset title if not provided)
 * - scheduledAt: Date (optional, publishes immediately if not provided)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request
    const validation = publishBlog.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { assetId, title, scheduledAt } = validation.data;

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

    if (asset.type !== "blog") {
      return NextResponse.json(
        { ok: false, error: "Asset type must be 'blog'" },
        { status: 400 }
      );
    }

    // If scheduled, create ScheduledPublish record
    if (scheduledAt) {
      const scheduled = await prisma.scheduledPublish.create({
        data: {
          assetId,
          channel: "blog",
          scheduledAt: new Date(scheduledAt),
          status: "pending",
          payload: {
            title: title || asset.title,
            campaignId: asset.campaignId,
          },
        },
      });

      return NextResponse.json({
        ok: true,
        scheduled: true,
        scheduledPublish: scheduled,
        message: `Blog post scheduled for ${new Date(scheduledAt).toLocaleString()}`,
      }, { status: 202 });
    }

    // Otherwise, publish immediately
    const slug = (title || asset.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const blogPost = await prisma.blogPost.create({
      data: {
        slug: `${slug}-${Date.now()}`,
        title: title || asset.title,
        content: asset.body || "",
        excerpt: asset.body?.substring(0, 200) || "",
        status: "PUBLISHED",
        publishedAt: new Date(),
        createdBy: "system", // TODO: Get from auth session
        generatedBy: "Max Content Agent",
        generationModel: "gpt-4o-mini",
      },
    });

    // Update asset status
    await prisma.contentAsset.update({
      where: { id: assetId },
      data: {
        status: "published",
        publishedAt: new Date(),
        metadata: {
          ...((asset.metadata as any) || {}),
          blogPostId: blogPost.id,
        },
      },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        tenantId: 1, // TODO: Get from auth session
        actorId: "system",
        action: "publish_blog",
        targetType: "asset",
        targetId: assetId,
        after: {
          blogPostId: blogPost.id,
          campaignId: asset.campaignId,
          publishedAt: blogPost.publishedAt,
        },
        status: "success",
      },
    });

    // Revalidate blog pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${blogPost.id}`);

    return NextResponse.json({
      ok: true,
      scheduled: false,
      blogPost: {
        id: blogPost.id,
        title: blogPost.title,
        publishedAt: blogPost.publishedAt,
        url: `/blog/${blogPost.id}`,
      },
      asset: {
        id: asset.id,
        status: "published",
        publishedAt: asset.publishedAt,
      },
    });

  } catch (error: any) {
    console.error("Blog publish failed:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
