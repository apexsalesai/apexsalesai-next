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

    const wordCount = length === 'short' ? '100-150' : length === 'medium' ? '200-300' : '400-500';

    const prompt = `Write a ${tone} email about "${topic}".
    
Target length: ${wordCount} words

Create a professional email with:
- Compelling subject line
- Clear opening
- Well-structured body
- Strong call-to-action
- Professional closing

Format with clear sections.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert email copywriter for ApexSalesAI. Create professional, persuasive emails that drive action.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
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
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate email' },
      { status: 500 }
    );
  }
}
