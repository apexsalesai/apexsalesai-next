import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Helper: Require authentication
 */
async function requireAuth(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    return null;
  }
}

/**
 * Helper: Require admin role
 */
async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request);
  
  if (!user) {
    throw new Error('Unauthorized: Please log in');
  }
  
  // Check Auth0 roles
  const roles = user['https://apexsalesai.com/roles'] || [];
  
  if (!roles.includes('admin') && !roles.includes('content_manager')) {
    throw new Error('Forbidden: Admin access required');
  }
  
  return user;
}

/**
 * GET /api/posts
 * List blog posts (public)
 * 
 * Query params:
 *   - status: DRAFT | PUBLISHED | ARCHIVED (default: PUBLISHED)
 *   - limit: number (default: 10, max: 100)
 *   - offset: number (default: 0)
 *   - search: string (search in title/excerpt)
 *   - tags: string (comma-separated)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PUBLISHED';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const tagsParam = searchParams.get('tags');
    
    // Build where clause
    const where: any = { status };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (tagsParam) {
      const tags = tagsParam.split(',').map(t => t.trim());
      where.tags = { hasSome: tags };
    }
    
    // Fetch posts
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          image: true,
          publishedAt: true,
          author: true,
          tags: true,
          status: true,
        }
      }),
      prisma.blogPost.count({ where })
    ]);
    
    const responseTime = Date.now() - startTime;
    
    // Warn if slow
    if (responseTime > 200) {
      console.warn(`⚠️ Slow API response: ${responseTime}ms`);
    }
    
    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total
      },
      responseTime
    }, {
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error('API Error:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch posts',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}

/**
 * POST /api/posts
 * Create new blog post (admin only)
 * 
 * Body:
 * {
 *   "slug": "my-post-slug",
 *   "title": "My Post Title",
 *   "content": "Full markdown content...",
 *   "excerpt": "Short description...",
 *   "image": "https://...",
 *   "tags": ["AI", "Sales"],
 *   "status": "DRAFT" | "PUBLISHED",
 *   "generatedBy": "Max Content Agent",
 *   "generationModel": "gpt-4o",
 *   "generationCost": 0.05,
 *   "generationTokens": 1500
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Require admin authentication
    const user = await requireAdmin(request);
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.slug || !data.title || !data.content) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['slug', 'title', 'content']
      }, { status: 400 });
    }
    
    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug }
    });
    
    if (existing) {
      return NextResponse.json({
        error: 'Slug already exists',
        slug: data.slug
      }, { status: 409 });
    }
    
    // Create post
    const post = await prisma.blogPost.create({
      data: {
        slug: data.slug,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 200),
        image: data.image,
        author: data.author || 'ApexSalesAI Editorial Team',
        tags: data.tags || [],
        keywords: data.keywords || [],
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status || 'DRAFT',
        createdBy: user.sub,
        createdByEmail: user.email,
        generatedBy: data.generatedBy || 'Human',
        generationModel: data.generationModel,
        generationCost: data.generationCost,
        generationTokens: data.generationTokens,
        generationTime: data.generationTime,
      }
    });
    
    const responseTime = Date.now() - startTime;
    
    // Log to Application Insights (TODO: implement)
    console.log(`✅ Blog post created: ${post.slug} by ${user.email} in ${responseTime}ms`);
    
    return NextResponse.json({
      success: true,
      post,
      responseTime
    }, {
      status: 201,
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
      error: 'Failed to create post',
      message: error.message,
      responseTime
    }, { status: 500 });
  }
}
