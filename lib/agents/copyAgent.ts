/**
 * Copy Agent - Multi-platform content generation
 */

import type { Agent, AgentRunResult } from './registry';
import OpenAI from 'openai';
import { getContentLimits, getPlatformLimits, wordCount, charCount } from '@lib/telemetry-phase2';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY — please add it to .env.local');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

export const copyAgent: Agent = {
  name: 'copy',
  
  async run(ctx): Promise<AgentRunResult> {
    const start = Date.now();
    const { title, objective, audience, brandVoice, channels, targetLength } = ctx.campaign;
    const limits = getContentLimits(targetLength);
    
    let totalTokensIn = 0;
    let totalTokensOut = 0;
    const assets: any[] = [];

    // Generate blog post if blog channel selected
    if (channels.includes('blog')) {
      try {
        const blogPrompt = `Write a ${targetLength} blog post (${limits.min}-${limits.max} words).

Title: ${title}
Objective: ${objective}
Audience: ${audience}
Brand Voice: ${brandVoice}

Requirements:
- Professional markdown formatting
- Clear headings (H2, H3)
- Engaging introduction
- Data-driven insights
- Actionable takeaways
- Strong CTA at the end
- Target word count: ${limits.min}-${limits.max} words`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are an expert content writer. Write in a ${brandVoice} tone.` },
            { role: 'user', content: blogPrompt },
          ],
          temperature: 0.7,
          max_tokens: limits.tokens,
        });

        const blogContent = completion.choices[0].message.content || '';
        totalTokensIn += completion.usage?.prompt_tokens || 0;
        totalTokensOut += completion.usage?.completion_tokens || 0;

        assets.push({
          type: 'blog',
          title,
          body: blogContent,
          metadata: {
            wordCount: wordCount(blogContent),
            charCount: charCount(blogContent),
            targetLength,
          },
        });
      } catch (error) {
        console.error('[CopyAgent] Blog generation error:', error);
      }
    }

    // Generate email if email channel selected
    if (channels.includes('email')) {
      try {
        const emailPrompt = `Write a compelling email for this campaign.

Title: ${title}
Objective: ${objective}
Audience: ${audience}
Brand Voice: ${brandVoice}

Requirements:
- Attention-grabbing subject line (under 60 chars)
- Personalized greeting
- Clear value proposition
- 2-3 short paragraphs
- Strong CTA
- Professional signature
- Total length: 300-500 words`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are an expert email copywriter. Write in a ${brandVoice} tone.` },
            { role: 'user', content: emailPrompt },
          ],
          temperature: 0.7,
          max_tokens: 800,
        });

        const emailContent = completion.choices[0].message.content || '';
        totalTokensIn += completion.usage?.prompt_tokens || 0;
        totalTokensOut += completion.usage?.completion_tokens || 0;

        assets.push({
          type: 'email',
          title: `Email: ${title}`,
          body: emailContent,
          metadata: {
            wordCount: wordCount(emailContent),
            charCount: charCount(emailContent),
          },
        });
      } catch (error) {
        console.error('[CopyAgent] Email generation error:', error);
      }
    }

    // Generate social posts if social channel selected
    if (channels.includes('social')) {
      const platforms = ['linkedin', 'twitter', 'facebook', 'instagram'];
      
      for (const platform of platforms) {
        try {
          const limit = getPlatformLimits(platform);
          const socialPrompt = `Write a ${platform} post for this campaign.

Title: ${title}
Objective: ${objective}
Audience: ${audience}
Brand Voice: ${brandVoice}

Requirements:
- Platform: ${platform}
- Character limit: ${limit}
- Engaging hook
- Clear value
- Relevant hashtags (2-3)
- Strong CTA`;

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `You are a social media expert. Write for ${platform} in a ${brandVoice} tone.` },
              { role: 'user', content: socialPrompt },
            ],
            temperature: 0.8,
            max_tokens: 300,
          });

          let socialContent = completion.choices[0].message.content || '';
          socialContent = clip(socialContent, limit);
          
          totalTokensIn += completion.usage?.prompt_tokens || 0;
          totalTokensOut += completion.usage?.completion_tokens || 0;

          assets.push({
            type: 'social',
            title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Post`,
            body: socialContent,
            metadata: {
              platform,
              charLimit: limit,
              charCount: socialContent.length,
            },
          });
        } catch (error) {
          console.error(`[CopyAgent] ${platform} generation error:`, error);
        }
      }
    }

    return {
      assets,
      tokensIn: totalTokensIn,
      tokensOut: totalTokensOut,
      ms: Date.now() - start,
    };
  },
};
