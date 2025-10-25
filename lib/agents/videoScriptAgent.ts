/**
 * Video Script Agent - Professional video script and storyboard generation
 */

import type { Agent, AgentRunResult } from './registry';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY — please add it to .env.local');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const videoScriptAgent: Agent = {
  name: 'video',
  
  async run(ctx): Promise<AgentRunResult> {
    const start = Date.now();
    const { title, objective, audience, brandVoice } = ctx.campaign;
    
    const prompt = `Create a professional video script for this campaign.

Title: ${title}
Objective: ${objective}
Target Audience: ${audience}
Brand Voice: ${brandVoice}

Create a 60-90 second vertical video script (9:16 format) with:

1. HOOK (0-5s): Attention-grabbing opening
2. PROBLEM (5-20s): Pain point identification
3. SOLUTION (20-45s): Product/service introduction with 3 key benefits
4. PROOF (45-55s): Social proof, metrics, or testimonial
5. CTA (55-60s): Clear call-to-action

Include:
- Voiceover script (what's spoken)
- Visual directions (what's shown)
- Text overlays (key points to display)
- Shot transitions
- Background music suggestions

Format as structured script with timestamps.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `You are an expert video scriptwriter and director. Write in a ${brandVoice} tone.` },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const scriptContent = completion.choices[0].message.content || '';
      const tokensIn = completion.usage?.prompt_tokens || 0;
      const tokensOut = completion.usage?.completion_tokens || 0;

      return {
        assets: [{
          type: 'videoScript',
          title: `Video Script: ${title}`,
          body: scriptContent,
          metadata: {
            format: '9:16',
            durationSec: 60,
            platform: 'TikTok, Instagram Reels, YouTube Shorts',
          },
        }],
        tokensIn,
        tokensOut,
        ms: Date.now() - start,
      };
    } catch (error: any) {
      console.error('[VideoScriptAgent] Error:', error);
      
      // Fallback script
      const fallbackScript = `VIDEO SCRIPT: ${title}
Duration: 60 seconds | Format: 9:16 (Vertical)

═══════════════════════════════════════════════════

[0-5s] HOOK
Voiceover: "What if I told you there's a better way?"
Visual: Bold text overlay with dynamic background
Text Overlay: "The Problem Everyone Faces"
Music: Upbeat, attention-grabbing intro

[5-20s] PROBLEM
Voiceover: "Most ${audience} struggle with ${objective.toLowerCase()}. Manual processes waste hours every day."
Visual: Split-screen showing frustrated user vs. efficient workflow
Text Overlay: "10+ Hours Wasted Weekly"
Transition: Swipe left

[20-45s] SOLUTION
Voiceover: "Introducing ${title}. Here's how it works:"
Visual: Product demo with 3 key features highlighted
Text Overlays:
  - "Automated Workflows"
  - "Real-Time Analytics"
  - "Scales With You"
Transition: Fade between features

[45-55s] PROOF
Voiceover: "Join 1,000+ companies already saving time and money."
Visual: Customer logos, testimonial quote, or metric dashboard
Text Overlay: "1,000+ Companies Trust Us"
Music: Build to crescendo

[55-60s] CTA
Voiceover: "Ready to transform your workflow? Book a demo today."
Visual: Clear CTA button with website URL
Text Overlay: "Book Your Demo → apexsalesai.com"
Music: Resolve to memorable outro

═══════════════════════════════════════════════════

PRODUCTION NOTES:
- Keep text overlays on screen for 2-3 seconds minimum
- Use brand colors: Electric Teal (#00E0C6), Deep Blue (#001F3F)
- Add subtle animations to text (fade in, slide up)
- Include captions for accessibility
- Export in 1080x1920 resolution`;

      return {
        assets: [{
          type: 'videoScript',
          title: `Video Script: ${title}`,
          body: fallbackScript,
          metadata: {
            format: '9:16',
            durationSec: 60,
            platform: 'TikTok, Instagram Reels, YouTube Shorts',
            fallback: true,
          },
        }],
        tokensIn: 0,
        tokensOut: 0,
        ms: Date.now() - start,
      };
    }
  },
};
