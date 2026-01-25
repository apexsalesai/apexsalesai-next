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

    const duration = length === 'short' ? '30-60 seconds' : length === 'medium' ? '1-2 minutes' : '3-5 minutes';

    const prompt = `Create a video script about "${topic}" with a ${tone} tone.
    
Target duration: ${duration}

Create a compelling video script with:
- Attention-grabbing hook (first 3 seconds)
- Clear narrative structure
- Visual scene descriptions
- Dialogue/voiceover text
- Call-to-action

Format:
[SCENE 1]
Visual: [description]
Audio: [dialogue/voiceover]

[SCENE 2]
...`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert video script writer for ApexSalesAI. Create engaging, visual scripts optimized for social media and marketing videos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      result: content,
      metadata: {
        model: 'gpt-4o-mini',
        tokens: completion.usage?.total_tokens || 0,
        duration: duration,
        wordCount: content.split(/\s+/).length,
      }
    });

  } catch (error: any) {
    console.error('Error generating video script:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video script' },
      { status: 500 }
    );
  }
}
