import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { topic, platforms, tone } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log('🎯 Generating social media posts...');
    console.log(`Topic: ${topic}`);
    console.log(`Platforms: ${platforms?.join(', ') || 'LinkedIn, Twitter'}`);

    const selectedPlatforms = platforms || ['LinkedIn', 'Twitter'];
    const socialPosts: any = {};

    // Generate content for each platform
    for (const platform of selectedPlatforms) {
      const prompt = getPlatformPrompt(platform, topic, tone);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Max, ApexSalesAI\'s expert content creator. Create engaging, professional social media content optimized for each platform.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      socialPosts[platform] = {
        content: completion.choices[0]?.message?.content || '',
        platform,
        characterCount: completion.choices[0]?.message?.content?.length || 0,
        hashtags: extractHashtags(completion.choices[0]?.message?.content || ''),
      };

      console.log(`✅ Generated ${platform} post (${socialPosts[platform].characterCount} chars)`);
    }

    return NextResponse.json({
      success: true,
      posts: socialPosts,
      topic,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Social media generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate social posts' },
      { status: 500 }
    );
  }
}

function getPlatformPrompt(platform: string, topic: string, tone?: string): string {
  const toneGuide = tone || 'professional yet approachable';
  
  const prompts: Record<string, string> = {
    LinkedIn: `Create a LinkedIn post about "${topic}". 
    
Requirements:
- Professional ${toneGuide} tone
- 1200-1500 characters (optimal LinkedIn length)
- Start with a hook that grabs attention
- Include 2-3 key insights or statistics
- End with a thought-provoking question or CTA
- Add 3-5 relevant hashtags
- Format with line breaks for readability
- Focus on business value and ROI`,

    Twitter: `Create a Twitter/X thread about "${topic}".

Requirements:
- ${toneGuide} tone
- 3-5 tweets in a thread
- Each tweet under 280 characters
- Start with an attention-grabbing first tweet
- Include actionable insights
- Use emojis strategically (1-2 per tweet)
- Add 2-3 relevant hashtags in the last tweet
- Make it shareable and engaging`,

    Facebook: `Create a Facebook post about "${topic}".

Requirements:
- Conversational ${toneGuide} tone
- 400-600 characters
- Start with an engaging question or statement
- Include a clear value proposition
- Add a call-to-action
- Use 2-3 relevant hashtags
- Make it relatable and shareable`,

    Instagram: `Create an Instagram caption about "${topic}".

Requirements:
- ${toneGuide} yet visual tone
- 150-300 characters for the main caption
- Include a compelling hook in the first line
- Add relevant emojis
- Include 10-15 strategic hashtags at the end
- Encourage engagement with a question or CTA`
  };

  return prompts[platform] || prompts.LinkedIn;
}

function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const matches = content.match(hashtagRegex);
  return matches || [];
}
