import { NextRequest, NextResponse } from 'next/server';
import { ContentGenerator, BlogPost } from '../../../../lib/services/agent/contentGenerator';

/**
 * API Route: /api/agent/publish-content
 * Purpose: Publish generated content to the blog
 * 
 * POST body:
 * {
 *   "title": "Blog post title",
 *   "slug": "blog-post-slug",
 *   "content": "Full markdown content...",
 *   "excerpt": "Brief summary",
 *   "author": "Author name",
 *   "date": "2025-05-15",
 *   "tags": ["tag1", "tag2"],
 *   "image": "https://...",
 *   "seoMetadata": { ... }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const blogPost: BlogPost = await request.json();

    // Validate required fields
    if (!blogPost.title || !blogPost.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!blogPost.slug) {
      blogPost.slug = blogPost.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Set defaults
    blogPost.author = blogPost.author || 'ApexSalesAI Editorial Team';
    blogPost.date = blogPost.date || new Date().toISOString().split('T')[0];
    blogPost.tags = blogPost.tags || [];

    // Save the blog post
    await ContentGenerator.saveBlogPost(blogPost);

    return NextResponse.json({
      success: true,
      message: `Blog post "${blogPost.title}" published successfully!`,
      slug: blogPost.slug,
      url: `/blog/${blogPost.slug}`,
      data: blogPost
    });
  } catch (error: any) {
    console.error('Error publishing content:', error);
    return NextResponse.json(
      { 
        error: 'Failed to publish content',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
