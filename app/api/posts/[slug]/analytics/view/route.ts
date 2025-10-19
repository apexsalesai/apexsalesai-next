import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force Node.js runtime (required for Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/posts/[slug]/analytics/view
 * Track a blog post view
 * 
 * Body:
 * {
 *   "sessionId": "unique-session-id",
 *   "userId": "user-id" (optional),
 *   "referrer": "https://..." (optional),
 *   "userAgent": "..." (optional)
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();
  
  try {
    const body = await request.json().catch(() => ({}));
    
    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      select: { id: true, slug: true }
    });
    
    if (!post) {
      return NextResponse.json({
        error: 'Post not found',
        slug: params.slug
      }, { status: 404 });
    }
    
    // Create analytics event
    await prisma.blogAnalyticsEvent.create({
      data: {
        postId: post.id,
        eventType: 'view',
        userId: body.userId || null,
        sessionId: body.sessionId || null,
        metadata: {
          referrer: body.referrer,
          userAgent: body.userAgent,
          timestamp: new Date().toISOString(),
        }
      }
    });
    
    // Update daily engagement (upsert)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.postEngagement.upsert({
      where: {
        postId_date: {
          postId: post.id,
          date: today
        }
      },
      create: {
        postId: post.id,
        date: today,
        views: 1,
        uniqueViews: body.sessionId ? 1 : 0,
      },
      update: {
        views: { increment: 1 },
        // Only increment unique views if we have a session ID
        ...(body.sessionId ? { uniqueViews: { increment: 1 } } : {})
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    // Log to Application Insights (TODO: implement)
    // trackEvent('blog_view', { postId: post.id, slug: post.slug });
    
    return NextResponse.json({
      success: true,
      message: 'View tracked successfully',
      responseTime
    }, {
      headers: {
        'X-Response-Time': `${responseTime}ms`
      }
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('Analytics Error:', error);
    
    return NextResponse.json({
      error: 'Failed to track view',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}
