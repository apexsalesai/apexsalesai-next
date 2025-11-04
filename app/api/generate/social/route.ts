import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, tone = 'professional', length = 'medium', platform } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Platform-specific character limits
    const platformLimits: Record<string, number> = {
      twitter: 280,
      linkedin: 3000,
      facebook: 500,
      instagram: 2200,
    };

    const charLimit = platform ? platformLimits[platform] || 280 : 280;

    const prompt = `Create a ${tone} social media post about "${topic}" for ${platform || 'general social media'}.
    
Character limit: ${charLimit}

Requirements:
- Engaging and attention-grabbing
- Include relevant hashtags
- Call-to-action if appropriate
- Professional yet conversational tone
- Optimized for ${platform || 'social media'} engagement`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert social media content creator for ApexSalesAI. Create engaging, platform-optimized posts that drive engagement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      result: content,
      metadata: {
        model: 'gpt-4o-mini',
        tokens: completion.usage?.total_tokens || 0,
        charCount: content.length,
        platform: platform || 'general',
        charLimit,
      }
    });

  } catch (error: any) {
    console.error('Error generating social post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate social post' },
      { status: 500 }
    );
  }
}
