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
            content: 'You are Max, ApexSalesAI\'s expert social media content creator. You create SHORT social media posts, NOT blog articles. Always respect character limits: Twitter 280 chars per tweet, LinkedIn 1200-1500 chars, Facebook 400-600 chars, Instagram 150-300 chars + hashtags. Never write full articles or blog posts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 600,
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
    LinkedIn: `Write ONLY a LinkedIn post (NOT a blog article) about "${topic}". 

CRITICAL REQUIREMENTS:
- This must be a SHORT social media post, NOT a blog article
- Maximum 1200-1500 characters total
- Professional ${toneGuide} tone
- Start with a hook (1-2 sentences)
- Include 2-3 key insights
- End with a question or CTA
- Add 3-5 hashtags at the end
- Use line breaks for readability
- NO title, NO article format, ONLY the post content`,

    Twitter: `Write ONLY a Twitter/X thread (NOT a blog article) about "${topic}".

CRITICAL REQUIREMENTS:
- This must be SHORT tweets, NOT a blog article
- Create exactly 3-5 tweets
- Each tweet MUST be under 280 characters
- Number each tweet (1/, 2/, 3/, etc.)
- ${toneGuide} tone
- Use emojis (1-2 per tweet)
- Add hashtags only in the last tweet
- Make it punchy and shareable
- NO article content, ONLY tweets`,

    Facebook: `Write ONLY a Facebook post (NOT a blog article) about "${topic}".

CRITICAL REQUIREMENTS:
- This must be a SHORT social post, NOT a blog article
- Maximum 400-600 characters total
- Conversational ${toneGuide} tone
- Start with an engaging question
- Include clear value
- Add a CTA
- Use 2-3 hashtags
- NO article format, ONLY the post`,

    Instagram: `Write ONLY an Instagram caption (NOT a blog article) about "${topic}".

CRITICAL REQUIREMENTS:
- This must be a SHORT caption, NOT a blog article
- Maximum 150-300 characters for main text
- ${toneGuide} yet visual tone
- Include emojis (3-5)
- Add 10-15 hashtags at the end
- End with engagement question
- NO article format, ONLY the caption`
  };

  return prompts[platform] || prompts.LinkedIn;
}

function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const matches = content.match(hashtagRegex);
  return matches || [];
}
