import { NextRequest, NextResponse } from 'next/server';
import { ContentGenerator } from '../../../lib/services/agent/contentGenerator';

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
    
    // Enhanced error details for debugging
    const errorResponse: any = {
      error: err?.message || 'Unknown error',
      type: err?.type || 'unknown',
      code: err?.code || 'unknown',
    };

    // Add specific guidance for common errors
    if (err?.status === 401) {
      errorResponse.error = 'OpenAI API authentication failed';
      errorResponse.suggestion = 'Check that OPENAI_API_KEY is correctly set in Vercel environment variables';
    } else if (err?.status === 429) {
      errorResponse.error = 'OpenAI API rate limit exceeded';
      errorResponse.suggestion = 'Check your OpenAI account quota and billing status';
    } else if (err?.status === 404) {
      errorResponse.error = 'OpenAI model not found';
      errorResponse.suggestion = 'The gpt-4o model might not be available on your API key. Try upgrading your OpenAI account or use gpt-4-turbo instead';
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = err?.stack;
    }

    return NextResponse.json(errorResponse, { status: err?.status || 500 });
  }
}
