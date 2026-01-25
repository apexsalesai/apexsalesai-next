import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * API Route: /api/revalidate-blog
 * Purpose: Trigger on-demand revalidation of blog pages
 * 
 * This allows us to update static blog pages without waiting for full rebuild
 */
export async function POST(request: NextRequest) {
  try {
    const { slug, secret } = await request.json();
    
    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // Revalidate the blog list page
    revalidatePath('/blog');
    
    // Revalidate specific blog post if slug provided
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    
    return NextResponse.json({
      success: true,
      revalidated: true,
      paths: slug ? ['/blog', `/blog/${slug}`] : ['/blog'],
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to revalidate',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }
  
  // Revalidate
  revalidatePath('/blog');
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  
  return NextResponse.json({
    success: true,
    revalidated: true,
    paths: slug ? ['/blog', `/blog/${slug}`] : ['/blog'],
    timestamp: new Date().toISOString()
  });
}
