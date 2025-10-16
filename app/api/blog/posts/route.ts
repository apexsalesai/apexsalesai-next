import { NextResponse } from 'next/server';
import { getAllBlogPosts, getDefaultBlogPosts } from '../../../../lib/blog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/posts
 * Returns all blog posts from content/blog directory
 */
export async function GET() {
  try {
    let posts = getAllBlogPosts();
    
    // If no posts found, return defaults
    if (posts.length === 0) {
      posts = getDefaultBlogPosts();
    }

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        author: post.author,
        excerpt: post.excerpt,
        image: post.image,
        tags: post.tags,
      })),
      count: posts.length,
    });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    
    // Return defaults on error
    const defaultPosts = getDefaultBlogPosts();
    return NextResponse.json({
      success: true,
      posts: defaultPosts.map(post => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        author: post.author,
        excerpt: post.excerpt,
        image: post.image,
        tags: post.tags,
      })),
      count: defaultPosts.length,
      error: 'Using default posts due to error',
    });
  }
}
