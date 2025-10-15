import { NextRequest, NextResponse } from 'next/server';
import { ContentGenerator } from '@lib/services/agent/contentGenerator';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const topic: string = (body?.topic || '').trim();

    if (!topic) {
      return NextResponse.json({ error: 'Topic required' }, { status: 400 });
    }

    const blogPost = await ContentGenerator.generateBlogPost({
      topic,
      contentType: 'blog',
      tone: 'professional',
      length: 'medium',
    });

    return NextResponse.json({ success: true, data: blogPost }, { status: 200 });
  } catch (err: any) {
    console.error('Generate API error:', err);
    return NextResponse.json({ 
      error: err?.message || 'Unknown error' 
    }, { status: 500 });
  }
}
