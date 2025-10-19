import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force Node.js runtime (required for OpenAI SDK)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * API Route: /api/agent/generate-content
 * Purpose: Generate marketing content using AI agent
 * 
 * POST body:
 * {
 *   "topic": "How AI Agents Transform Revenue Operations",
 *   "contentType": "blog",
 *   "tone": "professional",
 *   "keywords": "AI, revenue operations, automation",
 *   "length": "medium"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false,
          error: 'OpenAI API key is not configured',
          suggestion: 'Please set OPENAI_API_KEY in Vercel environment variables'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    const {
      topic,
      contentType = 'blog',
      tone = 'professional',
      keywords = '',
      length = 'medium'
    } = body;

    // Validate required fields
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build prompt
    const prompt = `Write a ${tone} ${contentType} about "${topic}". 
    
Keywords to include: ${keywords || 'AI, sales, automation'}
Target length: ${length} (${length === 'short' ? '500-800' : length === 'medium' ? '1000-1500' : '2000-3000'} words)

Please provide a well-structured, engaging piece with:
- A compelling title
- Clear introduction
- Well-organized body sections
- Strong conclusion
- SEO-friendly content`;

    console.log('Calling OpenAI API with model: gpt-4o-mini');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer for ApexSalesAI, a premium enterprise AI sales platform. Create professional, engaging, and SEO-optimized content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';

    console.log('OpenAI API call successful');

    // Format response to match frontend expectations
    return NextResponse.json({
      success: true,
      contentType: 'blog',
      message: 'Content generated successfully!',
      data: {
        title: topic, // Use topic as title for now
        content: content,
        excerpt: content.substring(0, 200) + '...',
        tags: keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      },
      model: 'gpt-4o-mini',
      usage: completion.usage
    });

  } catch (error: any) {
    console.error('Error generating content:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to generate content',
        details: error.toString()
      },
      { status: 500 }
    );
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
