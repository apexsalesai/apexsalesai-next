import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * API Route: /api/agent/generate-content
 * Purpose: Generate marketing content using AI
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET - return API info
  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'AI Content Generator',
      version: '1.0.0',
      capabilities: {
        contentTypes: ['blog', 'social', 'email', 'case-study'],
        tones: ['professional', 'casual', 'technical', 'executive'],
        lengths: ['short', 'medium', 'long'],
      },
      usage: {
        endpoint: '/api/agent/generate-content',
        method: 'POST',
        example: {
          topic: 'How AI Agents Transform Revenue Operations',
          contentType: 'blog',
          tone: 'professional',
          length: 'medium',
          autoPublish: true
        }
      }
    });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      topic,
      contentType = 'blog',
      tone = 'professional',
      targetAudience,
      keywords,
      length = 'medium',
      vertical,
      autoPublish = false
    } = req.body;

    // Validate required fields
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Generate content based on type
    if (contentType === 'blog') {
      const wordCount = length === 'short' ? 500 : length === 'long' ? 2000 : 1000;
      
      const prompt = `Write a ${tone} blog post about "${topic}" for ${targetAudience || 'business professionals'}.
      
Target length: ${wordCount} words
${keywords ? `Include these keywords: ${keywords.join(', ')}` : ''}
${vertical ? `Industry vertical: ${vertical}` : ''}

Format the response as JSON with this structure:
{
  "title": "Compelling blog post title",
  "excerpt": "2-3 sentence summary",
  "content": "Full blog post content in markdown format",
  "tags": ["tag1", "tag2", "tag3"]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return res.status(200).json({
        success: true,
        contentType: 'blog',
        data: {
          ...result,
          slug: result.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'blog-post',
          author: 'Max AI Agent',
          date: new Date().toISOString(),
        },
        published: autoPublish,
        message: autoPublish 
          ? `Blog post "${result.title}" generated successfully!`
          : `Blog post "${result.title}" generated. Ready to publish.`
      });
    }

    if (contentType === 'social') {
      const prompt = `Create social media posts about "${topic}" in a ${tone} tone.
      
Generate posts for:
- LinkedIn (professional, 1-2 paragraphs)
- Twitter (concise, under 280 characters)
- Facebook (engaging, 2-3 paragraphs)

${keywords ? `Include these keywords: ${keywords.join(', ')}` : ''}

Format as JSON:
{
  "linkedin": "LinkedIn post content",
  "twitter": "Twitter post content",
  "facebook": "Facebook post content"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return res.status(200).json({
        success: true,
        contentType: 'social',
        data: result,
        message: 'Social media content generated successfully!'
      });
    }

    if (contentType === 'email') {
      const prompt = `Write a ${tone} marketing email about "${topic}".
      
Target audience: ${targetAudience || 'business professionals'}
${keywords ? `Key points to include: ${keywords.join(', ')}` : ''}

Format as JSON:
{
  "subject": "Compelling email subject line",
  "preview": "Preview text (50 chars)",
  "body": "Email body in HTML format",
  "cta": "Call to action text"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return res.status(200).json({
        success: true,
        contentType: 'email',
        data: result,
        message: 'Email content generated successfully!'
      });
    }

    return res.status(400).json({ error: `Unsupported content type: ${contentType}` });

  } catch (error: any) {
    console.error('Error generating content:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message,
      details: error.toString()
    });
  }
}
