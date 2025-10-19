import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      keywords: rawKeywords = '',
      length = 'medium',
      autoPublish = false,
      vertical = ''
    } = body;

    // Handle keywords as either string or array
    const keywords = Array.isArray(rawKeywords) 
      ? rawKeywords.join(', ') 
      : rawKeywords;

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

    // Generate slug and tags
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const tags = Array.isArray(rawKeywords) 
      ? rawKeywords 
      : keywords.split(',').map((k: string) => k.trim()).filter(Boolean);

    // Save to database if autoPublish is enabled
    let savedPost = null;
    if (autoPublish && contentType === 'blog') {
      try {
        savedPost = await prisma.blogPost.create({
          data: {
            title: topic,
            content: content,
            excerpt: content.substring(0, 200) + '...',
            slug: slug,
            status: 'PUBLISHED', // Auto-publish means status = PUBLISHED
            tags: tags,
            createdBy: 'system-user', // TODO: Replace with actual user ID when Auth0 is re-enabled
            generatedBy: 'Max Content Agent',
            generationModel: 'gpt-4o-mini',
            generationTokens: completion.usage?.total_tokens || 0,
            generationCost: (completion.usage?.total_tokens || 0) * 0.00001, // Rough estimate
            publishedAt: new Date(),
            publishedBy: 'system-user',
          }
        });
        console.log(`✅ Blog post published: ${savedPost.slug}`);
      } catch (dbError: any) {
        console.error('Database save error:', dbError);
        // Don't fail the whole request if DB save fails
      }
    }

    // Format response to match frontend expectations
    return NextResponse.json({
      success: true,
      contentType: 'blog',
      message: autoPublish 
        ? `Blog post "${topic}" generated and published successfully!`
        : `Blog post "${topic}" generated successfully!`,
      published: autoPublish && savedPost !== null,
      data: {
        title: topic,
        content: content,
        excerpt: content.substring(0, 200) + '...',
        tags: tags,
        slug: slug,
        id: savedPost?.id,
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
