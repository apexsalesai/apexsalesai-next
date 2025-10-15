import { NextRequest, NextResponse } from 'next/server';
import { ContentGenerator } from '@lib/services/agent/contentGenerator';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic,
      prompt,
      tone = 'professional',
      length = 'medium',
      keywords = [],
      targetAudience,
      vertical,
      contentType = 'blog',
    } = body;

    // Validation
    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Build enhanced prompt if custom context provided
    let enhancedTopic = topic.trim();
    if (prompt && prompt.trim()) {
      enhancedTopic = `${topic.trim()}\n\nAdditional Context: ${prompt.trim()}`;
    }

    // Generate content with all parameters
    const blogPost = await ContentGenerator.generateBlogPost({
      topic: enhancedTopic,
      contentType,
      tone,
      length,
      keywords: keywords.length > 0 ? keywords : undefined,
      targetAudience,
      vertical,
    });

    return NextResponse.json({ 
      success: true, 
      data: blogPost,
      metadata: {
        generatedAt: new Date().toISOString(),
        parameters: { tone, length, targetAudience, vertical, keywordCount: keywords.length },
      }
    }, { status: 200 });
  } catch (err: any) {
    console.error('Generate API error:', err);
    return NextResponse.json({ 
      error: err?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    }, { status: 500 });
  }
}
