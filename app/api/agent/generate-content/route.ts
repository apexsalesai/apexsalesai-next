import { NextRequest, NextResponse } from 'next/server';
import { ContentGenerator, ContentGenerationRequest } from '../../../../lib/services/agent/contentGenerator';

/**
 * API Route: /api/agent/generate-content
 * Purpose: Generate marketing content using AI agent
 * 
 * POST body:
 * {
 *   "topic": "How AI Agents Transform Revenue Operations",
 *   "contentType": "blog",
 *   "tone": "professional",
 *   "targetAudience": "C-level executives",
 *   "keywords": ["AI", "revenue operations", "automation"],
 *   "length": "medium",
 *   "vertical": "SaaS",
 *   "autoPublish": true
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      topic,
      contentType = 'blog',
      tone = 'professional',
      targetAudience,
      keywords,
      length = 'medium',
      vertical,
      autoPublish = false
    } = body;

    // Validate required fields
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const contentRequest: ContentGenerationRequest = {
      topic,
      contentType,
      tone,
      targetAudience,
      keywords,
      length,
      vertical
    };

    let result;

    switch (contentType) {
      case 'blog':
        result = await ContentGenerator.generateBlogPost(contentRequest);
        
        // Auto-publish if requested
        if (autoPublish) {
          await ContentGenerator.saveBlogPost(result);
        }
        
        return NextResponse.json({
          success: true,
          contentType: 'blog',
          data: result,
          published: autoPublish,
          message: autoPublish 
            ? `Blog post "${result.title}" generated and published successfully!`
            : `Blog post "${result.title}" generated. Use /api/agent/publish-content to publish.`
        });

      case 'social':
        result = await ContentGenerator.generateSocialContent(contentRequest);
        return NextResponse.json({
          success: true,
          contentType: 'social',
          data: result,
          message: 'Social media content generated successfully!'
        });

      case 'email':
        result = await ContentGenerator.generateEmailContent(contentRequest);
        return NextResponse.json({
          success: true,
          contentType: 'email',
          data: result,
          message: 'Email content generated successfully!'
        });

      default:
        return NextResponse.json(
          { error: `Unsupported content type: ${contentType}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error generating content:', error);
    
    // Enhanced error response with specific guidance
    const errorResponse: any = {
      error: 'Failed to generate content',
      message: error.message || 'Unknown error',
      type: error.type || 'unknown'
    };

    // Add specific guidance for common errors
    if (error?.status === 401 || error?.message?.includes('API key')) {
      errorResponse.suggestion = 'Check that OPENAI_API_KEY is correctly set in Vercel environment variables';
    } else if (error?.status === 429) {
      errorResponse.suggestion = 'OpenAI API rate limit exceeded. Check your account quota and billing';
    } else if (error?.status === 404 || error?.message?.includes('model')) {
      errorResponse.suggestion = 'The gpt-4o model might not be available. Try upgrading your OpenAI account';
    } else if (error?.message?.includes('Missing OpenAI API key')) {
      errorResponse.suggestion = 'OPENAI_API_KEY environment variable is not set in Vercel';
    }

    // Include details in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error.toString();
      errorResponse.stack = error.stack;
    }

    return NextResponse.json(errorResponse, { status: error?.status || 500 });
  }
}

/**
 * GET: List available content generation options
 */
export async function GET() {
  return NextResponse.json({
    service: 'AI Content Generator',
    version: '1.0.0',
    capabilities: {
      contentTypes: ['blog', 'social', 'email', 'case-study'],
      tones: ['professional', 'casual', 'technical', 'executive'],
      lengths: ['short', 'medium', 'long'],
      features: [
        'AI-powered content generation',
        'SEO optimization',
        'Multi-platform support',
        'Auto-publishing',
        'Brand voice consistency'
      ]
    },
    usage: {
      endpoint: '/api/agent/generate-content',
      method: 'POST',
      example: {
        topic: 'How AI Agents Transform Revenue Operations',
        contentType: 'blog',
        tone: 'professional',
        targetAudience: 'C-level executives',
        keywords: ['AI', 'revenue operations', 'automation'],
        length: 'medium',
        vertical: 'SaaS',
        autoPublish: true
      }
    }
  });
}
