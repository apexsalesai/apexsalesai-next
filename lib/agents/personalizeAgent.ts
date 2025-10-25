/**
 * Personalize Agent - Audience segmentation and content variants
 */

import type { Agent, AgentRunResult } from './registry';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY — please add it to .env.local');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const personalizeAgent: Agent = {
  name: 'personalize',
  
  async run(ctx): Promise<AgentRunResult> {
    const start = Date.now();
    const { title, objective, audience, brandVoice } = ctx.campaign;
    
    // Define audience segments
    const segments = [
      { name: 'C-Suite', persona: 'CEO, CTO, CFO - focused on ROI and strategic impact' },
      { name: 'Operations', persona: 'RevOps, Sales Ops - focused on efficiency and automation' },
      { name: 'End Users', persona: 'Sales reps, Account managers - focused on ease of use' },
    ];
    
    const assets: any[] = [];
    let totalTokensIn = 0;
    let totalTokensOut = 0;

    for (const segment of segments) {
      try {
        const prompt = `Create a personalized email variant for this audience segment.

Campaign: ${title}
Objective: ${objective}
Base Audience: ${audience}
Segment: ${segment.name} (${segment.persona})
Brand Voice: ${brandVoice}

Requirements:
- Subject line tailored to ${segment.name} priorities
- Opening that resonates with ${segment.persona}
- Value proposition specific to their role
- Metrics/benefits relevant to their concerns
- CTA appropriate for their decision-making level
- 250-400 words total

Write a complete email ready to send.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are an expert in personalized B2B communication. Write in a ${brandVoice} tone.` },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 600,
        });

        const emailContent = completion.choices[0].message.content || '';
        totalTokensIn += completion.usage?.prompt_tokens || 0;
        totalTokensOut += completion.usage?.completion_tokens || 0;

        assets.push({
          type: 'email',
          title: `Email (${segment.name})`,
          body: emailContent,
          metadata: {
            segment: segment.name,
            persona: segment.persona,
            personalized: true,
          },
        });
      } catch (error) {
        console.error(`[PersonalizeAgent] Error for ${segment.name}:`, error);
        
        // Fallback personalized email
        const fallbackEmail = `Subject: ${title} — Built for ${segment.name}

Hi there,

As a ${segment.persona.split('-')[0].trim()}, you know that ${objective.toLowerCase()} is critical to success.

${title} is designed specifically with your needs in mind:

${segment.name === 'C-Suite' ? '• Strategic ROI: 10x return on investment within 6 months\n• Executive dashboards with real-time KPIs\n• Enterprise-grade security and compliance' : ''}${segment.name === 'Operations' ? '• Automated workflows save 10+ hours per week\n• Seamless integration with your existing stack\n• Real-time analytics and reporting' : ''}${segment.name === 'End Users' ? '• Intuitive interface — no training required\n• Mobile-first design for on-the-go access\n• AI-powered assistance at every step' : ''}

${segment.name === 'C-Suite' ? 'Schedule a strategic briefing with our executive team.' : segment.name === 'Operations' ? 'Book a technical demo to see the automation in action.' : 'Start your free trial today — no credit card required.'}

Best regards,
ApexSalesAI Team`;

        assets.push({
          type: 'email',
          title: `Email (${segment.name})`,
          body: fallbackEmail,
          metadata: {
            segment: segment.name,
            persona: segment.persona,
            personalized: true,
            fallback: true,
          },
        });
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
