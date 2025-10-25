import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { mode, outputFormat, prompt, targetLength, tone, crmContacts } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Word count targets
    const lengthTargets = {
      short: '50-200 words',
      medium: '200-500 words',
      long: '500-2000 words',
    };

    // Mode-specific system prompts
    const systemPrompts = {
      marketing: `You are an expert marketing copywriter specializing in email campaigns and CRM content. 
        Create compelling, conversion-focused content that drives engagement.`,
      
      social: `You are a social media expert who creates viral, engaging content optimized for each platform.
        Focus on hooks, storytelling, and calls-to-action.`,
      
      'job-seeker': `You are a professional career coach and resume writer. 
        Create compelling cover letters, interview responses, and job application materials that highlight strengths and fit.`,
      
      sales: `You are a top-performing sales professional who writes persuasive proposals and follow-ups.
        Focus on value proposition, pain points, and closing techniques.`,
      
      blog: `You are an expert content writer who creates SEO-optimized, engaging blog posts and articles.
        Use clear structure, compelling narratives, and actionable insights.`,
    };

    // Tone adjustments
    const toneInstructions = {
      professional: 'Use formal, business-appropriate language with clear structure.',
      casual: 'Use conversational, friendly language that feels approachable.',
      persuasive: 'Use compelling arguments, social proof, and strong calls-to-action.',
      friendly: 'Use warm, personable language that builds rapport.',
    };

    // Build the enhanced prompt
    const enhancedPrompt = `
${systemPrompts[mode as keyof typeof systemPrompts]}

TASK: ${prompt}

REQUIREMENTS:
- Length: ${lengthTargets[targetLength as keyof typeof lengthTargets]}
- Tone: ${toneInstructions[tone as keyof typeof toneInstructions]}
- Mode: ${mode}
${crmContacts && crmContacts.length > 0 ? `- Target audience: ${crmContacts.length} selected contacts from CRM` : ''}

IMPORTANT:
- Be specific and actionable
- Include relevant details and examples
- Maintain consistent tone throughout
- Format for readability (use paragraphs, bullets if appropriate)
${mode === 'job-seeker' ? '- Highlight relevant skills and experience' : ''}
${mode === 'marketing' ? '- Include clear call-to-action' : ''}
${mode === 'social' ? '- Include relevant hashtags and emojis' : ''}

Generate the content now:
`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompts[mode as keyof typeof systemPrompts],
        },
        {
          role: 'user',
          content: enhancedPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: targetLength === 'long' ? 2000 : targetLength === 'medium' ? 1000 : 500,
    });

    const generatedContent = response.choices[0]?.message?.content || '';

    // Calculate metrics
    const wordCount = generatedContent.trim().split(/\s+/).length;
    const charCount = generatedContent.length;

    return NextResponse.json({
      success: true,
      content: generatedContent,
      metrics: {
        wordCount,
        charCount,
        readingTime: Math.ceil(wordCount / 200),
      },
      metadata: {
        mode,
        tone,
        targetLength,
        model: 'gpt-4o-mini',
      },
    });

  } catch (error: any) {
    console.error('Content generation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate content',
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
