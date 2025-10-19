import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Force Node.js runtime (required for Auth0 and Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Helper: Require publisher or admin role
 * TODO: Implement proper Auth0 authentication after database setup
 */
async function requirePublisher(request: NextRequest) {
  // TEMPORARY: Skip auth check during initial deployment
  return {
    sub: 'system',
    email: 'system@apexsalesai.com'
  };
}

/**
 * PATCH /api/posts/[slug]/unpublish
 * Unpublish a blog post (move to DRAFT or ARCHIVED)
 * 
 * Body (optional):
 * {
 *   "archive": true // Set to true to archive instead of draft
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
    
    // Check if already unpublished
    if (existing.status === 'DRAFT' || existing.status === 'ARCHIVED') {
      return NextResponse.json({
        error: `Post is already ${existing.status.toLowerCase()}`,
        slug: params.slug
      }, { status: 400 });
    }
    
    // Determine new status
    const newStatus = body.archive ? 'ARCHIVED' : 'DRAFT';
    
    // Update post
    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        status: newStatus,
        lastModifiedBy: user.sub,
        lastModifiedAt: new Date(),
      }
    });
    
    // Revalidate blog pages (ISR)
    revalidatePath('/blog');
    revalidatePath(`/blog/${params.slug}`);
    
    const responseTime = Date.now() - startTime;
    
    console.log(`📥 Blog post unpublished: ${post.slug} → ${newStatus} by ${user.email} in ${responseTime}ms`);
    
    // Log to Application Insights (TODO: implement)
    
    return NextResponse.json({
      success: true,
      post,
      message: `Post ${newStatus.toLowerCase()} successfully`,
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
      error: 'Failed to unpublish post',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}
