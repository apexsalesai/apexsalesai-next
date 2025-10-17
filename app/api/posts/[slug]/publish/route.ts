import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Helper: Require publisher or admin role
 */
async function requirePublisher(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new Error('Unauthorized: Please log in');
    }
    
    const user = session.user;
    const roles = user['https://apexsalesai.com/roles'] || [];
    
    if (!roles.includes('admin') && !roles.includes('publisher') && !roles.includes('content_manager')) {
      throw new Error('Forbidden: Publisher access required');
    }
    
    return user;
  } catch (error: any) {
    throw error;
  }
}

/**
 * PATCH /api/posts/[slug]/publish
 * Publish a draft blog post
 * 
 * Body (optional):
 * {
 *   "scheduledFor": "2025-10-20T10:00:00Z" // For scheduled publishing
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();
  
  try {
    const user = await requirePublisher(request);
    const body = await request.json().catch(() => ({}));
    
    // Check if post exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: params.slug }
    });
    
    if (!existing) {
      return NextResponse.json({
        error: 'Post not found',
        slug: params.slug
      }, { status: 404 });
    }
    
    // Check if already published
    if (existing.status === 'PUBLISHED') {
      return NextResponse.json({
        error: 'Post is already published',
        slug: params.slug
      }, { status: 400 });
    }
    
    // Determine if scheduled or immediate publish
    const scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;
    const isScheduled = scheduledFor && scheduledFor > new Date();
    
    // Update post
    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        status: isScheduled ? 'SCHEDULED' : 'PUBLISHED',
        publishedAt: isScheduled ? null : new Date(),
        scheduledFor: scheduledFor,
        publishedBy: user.sub,
        approvedBy: user.sub,
        approvedAt: new Date(),
        lastModifiedBy: user.sub,
        lastModifiedAt: new Date(),
      }
    });
    
    // Revalidate blog pages (ISR)
    if (!isScheduled) {
      revalidatePath('/blog');
      revalidatePath(`/blog/${params.slug}`);
    }
    
    const responseTime = Date.now() - startTime;
    
    console.log(`🚀 Blog post ${isScheduled ? 'scheduled' : 'published'}: ${post.slug} by ${user.email} in ${responseTime}ms`);
    
    // Log to Application Insights (TODO: implement)
    
    return NextResponse.json({
      success: true,
      post,
      message: isScheduled 
        ? `Post scheduled for ${scheduledFor?.toISOString()}`
        : 'Post published successfully',
      responseTime
    }, {
      headers: {
        'X-Response-Time': `${responseTime}ms`
      }
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('API Error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return NextResponse.json({
        error: error.message,
        responseTime
      }, { status: error.message.includes('Unauthorized') ? 401 : 403 });
    }
    
    return NextResponse.json({
      error: 'Failed to publish post',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}
