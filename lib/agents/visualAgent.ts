/**
 * Visual Agent - Image prompt generation for brand-aligned visuals
 */

import type { Agent, AgentRunResult } from './registry';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY — please add it to .env.local');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const visualAgent: Agent = {
  name: 'visual',
  
  async run(ctx): Promise<AgentRunResult> {
    const start = Date.now();
    const { title, objective, brandVoice, channels } = ctx.campaign;
    
    const prompt = `Create detailed image generation prompts for this campaign.

Campaign: ${title}
Objective: ${objective}
Brand Voice: ${brandVoice}
Channels: ${channels.join(', ')}

Generate 3-5 image prompts for:
1. Hero/banner image (blog, LinkedIn)
2. Social media graphics (Instagram, Twitter)
3. Email header
4. Presentation/slide background

Each prompt should include:
- Visual style (minimalist, bold, corporate, etc.)
- Color palette (suggest 3-4 colors)
- Key elements/composition
- Mood/atmosphere
- Technical specs (aspect ratio)

Format as JSON array with keys: name, description, style, colors, aspectRatio`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert visual designer and art director.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1200,
      });

      const result = completion.choices[0].message.content || '[]';
      const tokensIn = completion.usage?.prompt_tokens || 0;
      const tokensOut = completion.usage?.completion_tokens || 0;

      return {
        assets: [{
          type: 'imagePrompt',
          title: 'Visual Asset Prompts',
          body: result,
          metadata: {
            agent: 'visual',
            format: 'json',
            brandColors: ['#0ea5e9', '#22d3ee', '#111827'], // Apex palette
          },
        }],
        tokensIn,
        tokensOut,
        ms: Date.now() - start,
      };
    } catch (error: any) {
      console.error('[VisualAgent] Error:', error);
      
      // Fallback prompts
      const fallbackPrompts = JSON.stringify([
        {
          name: 'Hero Banner',
          description: 'Professional gradient background with subtle grid overlay and headline text',
          style: 'Minimalist, modern, corporate',
          colors: ['#0ea5e9', '#22d3ee', '#111827', '#ffffff'],
          aspectRatio: '16:9',
        },
        {
          name: 'Social Media Graphic',
          description: 'Bold typography on electric teal background with data visualization elements',
          style: 'Bold, data-driven, energetic',
          colors: ['#00E0C6', '#001F3F', '#ffffff'],
          aspectRatio: '1:1',
        },
        {
          name: 'Email Header',
          description: 'Clean header with logo, subtle gradient, and professional imagery',
          style: 'Clean, professional, trustworthy',
          colors: ['#0ea5e9', '#f8fafc', '#111827'],
          aspectRatio: '3:1',
        },
      ], null, 2);

      return {
        assets: [{
          type: 'imagePrompt',
          title: 'Visual Asset Prompts',
          body: fallbackPrompts,
          metadata: {
            agent: 'visual',
            format: 'json',
            fallback: true,
            brandColors: ['#0ea5e9', '#22d3ee', '#111827'],
          },
        }],
        tokensIn: 0,
        tokensOut: 0,
        ms: Date.now() - start,
      };
    }
  },
};
