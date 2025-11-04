/**
 * Strategy Agent - Campaign planning and content strategy
 */

import type { Agent, AgentRunResult } from './registry';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY — please add it to .env.local');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const strategyAgent: Agent = {
  name: 'strategy',
  
  async run(ctx): Promise<AgentRunResult> {
    const start = Date.now();
    
    const prompt = `You are a strategic content planner. Create a comprehensive content strategy brief.

Campaign Details:
- Title: ${ctx.campaign.title}
- Objective: ${ctx.campaign.objective}
- Target Audience: ${ctx.campaign.audience}
- Brand Voice: ${ctx.campaign.brandVoice}
- Channels: ${ctx.campaign.channels.join(', ')}

Create a strategic brief with:
1. Core messaging pillars (3-5 key themes)
2. Audience pain points to address
3. Value propositions to highlight
4. Recommended content hooks for each channel
5. Primary and secondary CTAs

Format as JSON with keys: messagingPillars, painPoints, valueProps, contentHooks, ctas`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert content strategist.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const result = completion.choices[0].message.content || '{}';
      const tokensIn = completion.usage?.prompt_tokens || 0;
      const tokensOut = completion.usage?.completion_tokens || 0;

      return {
        assets: [{
          type: 'imagePrompt',
          title: 'Content Strategy Brief',
          body: result,
          metadata: { agent: 'strategy', format: 'json' },
        }],
        tokensIn,
        tokensOut,
        ms: Date.now() - start,
      };
    } catch (error: any) {
      console.error('[StrategyAgent] Error:', error);
      
      // Fallback to structured brief
      const fallbackBrief = JSON.stringify({
        messagingPillars: [
          'Problem-solution framework',
          'Data-driven insights',
          'Customer success stories',
        ],
        painPoints: [
          'Manual processes consuming time',
          'Lack of visibility into performance',
          'Difficulty scaling operations',
        ],
        valueProps: [
          'Automated workflows save 10+ hours/week',
          'Real-time analytics and reporting',
          'Scales with your business growth',
        ],
        contentHooks: {
          blog: 'Deep-dive thought leadership',
          social: 'Quick wins and tips',
          email: 'Personalized value propositions',
          video: 'Visual demonstrations',
        },
        ctas: {
          primary: 'Book a demo',
          secondary: 'Download whitepaper',
        },
      }, null, 2);

      return {
        assets: [{
          type: 'imagePrompt',
          title: 'Content Strategy Brief',
          body: fallbackBrief,
          metadata: { agent: 'strategy', format: 'json', fallback: true },
        }],
        tokensIn: 0,
        tokensOut: 0,
        ms: Date.now() - start,
      };
    }
  },
};
