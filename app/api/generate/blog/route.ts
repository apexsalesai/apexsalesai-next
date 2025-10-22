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

    const wordCount = length === 'short' ? '500-800' : length === 'medium' ? '1000-1500' : '2000-3000';

    const prompt = `Write a ${tone} blog post about "${topic}". 
    
Target length: ${wordCount} words

Create a well-structured, engaging blog post with:
- A compelling title
- Clear introduction with hook
- Well-organized body sections with subheadings
- Strong conclusion with call-to-action
- SEO-friendly content

Format in Markdown.`;

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
      max_tokens: 2500,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      result: content,
      metadata: {
        model: 'gpt-4o-mini',
        tokens: completion.usage?.total_tokens || 0,
        wordCount: content.split(/\s+/).length,
        charCount: content.length,
      }
    });

  } catch (error: any) {
    console.error('Error generating blog:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
