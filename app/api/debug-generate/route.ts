import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug endpoint to test OpenAI API configuration
 * Access: /api/debug-generate
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check environment variables
    const envCheck = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      AZURE_OPENAI_API_KEY: !!process.env.AZURE_OPENAI_API_KEY,
      OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length || 0,
      OPENAI_API_KEY_PREFIX: process.env.OPENAI_API_KEY?.substring(0, 7) || 'missing',
    };

    // Try to import and use the content generator
    const { ContentGenerator } = await import('../../../lib/services/agent/contentGenerator');
    
    // Attempt generation with minimal payload
    const result = await ContentGenerator.generateBlogPost({
      topic: body.topic || 'Test topic',
      contentType: 'blog',
      tone: 'professional',
      length: 'short',
    });

    return NextResponse.json({
      success: true,
      envCheck,
      result: {
        title: result.title,
        excerpt: result.excerpt,
        contentLength: result.content?.length || 0,
      }
    });

  } catch (error: any) {
    // Return detailed error information
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        name: error.name,
        type: error.type,
        status: error.status,
        code: error.code,
        stack: error.stack?.split('\n').slice(0, 5), // First 5 lines of stack
      },
      envCheck: {
        OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
        AZURE_OPENAI_API_KEY: !!process.env.AZURE_OPENAI_API_KEY,
        OPENAI_API_KEY_LENGTH: process.env.OPENAI_API_KEY?.length || 0,
        OPENAI_API_KEY_PREFIX: process.env.OPENAI_API_KEY?.substring(0, 7) || 'missing',
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug endpoint for content generation. Use POST with { "topic": "test" }',
    envCheck: {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      AZURE_OPENAI_API_KEY: !!process.env.AZURE_OPENAI_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
