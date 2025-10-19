import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

// Force Node.js runtime (required for Auth0 and Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Helper: Require admin role
 */
async function requireAdmin(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      throw new Error('Unauthorized: Please log in');
    }
    
    const user = session.user;
    const roles = user['https://apexsalesai.com/roles'] || [];
    
    if (!roles.includes('admin') && !roles.includes('content_manager')) {
      throw new Error('Forbidden: Admin access required');
    }
    
    return user;
  } catch (error: any) {
    throw error;
  }
}

/**
 * GET /api/posts/[slug]
 * Get single blog post (public)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();
  
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        engagement: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          orderBy: { date: 'desc' }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json({
        error: 'Post not found',
        slug: params.slug
      }, { status: 404 });
    }
    
    // Only return published posts to public
    if (post.status !== 'PUBLISHED') {
      // Check if user is admin
      try {
        await requireAdmin(request);
        // Admin can see drafts
      } catch (error) {
        return NextResponse.json({
          error: 'Post not found',
          slug: params.slug
        }, { status: 404 });
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      post,
      responseTime
    }, {
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('API Error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch post',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}

/**
 * PUT /api/posts/[slug]
 * Update blog post (admin only)
 * 
 * Body: Partial<BlogPost>
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();
  
  try {
    const user = await requireAdmin(request);
    const data = await request.json();
    
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
    
    // Update post
    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        ...data,
        lastModifiedBy: user.sub,
        lastModifiedAt: new Date(),
        // Don't allow changing these fields via PUT
        slug: undefined,
        id: undefined,
        createdAt: undefined,
        createdBy: undefined,
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`✅ Blog post updated: ${post.slug} by ${user.email} in ${responseTime}ms`);
    
    return NextResponse.json({
      success: true,
      post,
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
      error: 'Failed to update post',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/[slug]
 * Delete blog post (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const startTime = Date.now();
  
  try {
    const user = await requireAdmin(request);
    
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
    
    // Delete post (cascade deletes engagement and events)
    await prisma.blogPost.delete({
      where: { slug: params.slug }
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`🗑️  Blog post deleted: ${params.slug} by ${user.email} in ${responseTime}ms`);
    
    // Log to Application Insights (TODO: implement)
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
      slug: params.slug,
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
      error: 'Failed to delete post',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}
