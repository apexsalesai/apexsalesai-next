import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force Node.js runtime (required for Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/posts
 * Returns all published blog posts from database
 */
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        publishedAt: 'desc',
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        image: true,
        author: true,
        tags: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        slug: post.slug,
        title: post.title,
        date: post.publishedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        author: post.author,
        excerpt: post.excerpt,
        image: post.image,
        tags: post.tags,
      })),
      count: posts.length,
    });
  } catch (error: any) {
    console.error('Error fetching blog posts from database:', error);
    
    // Return empty array with error message
    return NextResponse.json({
      success: false,
      posts: [],
      count: 0,
      error: error.message || 'Failed to fetch blog posts',
    }, { status: 500 });
  }
}
