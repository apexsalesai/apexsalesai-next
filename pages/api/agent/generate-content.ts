import type { NextApiRequest, NextApiResponse } from 'next';
import { ContentGenerator, ContentGenerationRequest } from '../../../lib/services/agent/contentGenerator';

/**
 * API Route: /api/agent/generate-content
 * Purpose: Generate marketing content using AI agent
 * 
 * POST body:
 * {
 *   "topic": "How AI Agents Transform Revenue Operations",
 *   "contentType": "blog",
 *   "tone": "professional",
 *   "targetAudience": "C-level executives",
 *   "keywords": ["AI", "revenue operations", "automation"],
 *   "length": "medium",
 *   "vertical": "SaaS",
 *   "autoPublish": true
 * }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'AI Content Generator',
      version: '1.0.0',
      capabilities: {
        contentTypes: ['blog', 'social', 'email', 'case-study'],
        tones: ['professional', 'casual', 'technical', 'executive'],
        lengths: ['short', 'medium', 'long'],
        features: [
          'AI-powered content generation',
          'SEO optimization',
          'Multi-platform support',
          'Auto-publishing',
          'Brand voice consistency'
        ]
      },
      usage: {
        endpoint: '/api/agent/generate-content',
        method: 'POST',
        example: {
          topic: 'How AI Agents Transform Revenue Operations',
          contentType: 'blog',
          tone: 'professional',
          targetAudience: 'C-level executives',
          keywords: ['AI', 'revenue operations', 'automation'],
          length: 'medium',
          vertical: 'SaaS',
          autoPublish: true
        }
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    
    const {
      topic,
      contentType = 'blog',
      tone = 'professional',
      targetAudience,
      keywords,
      length = 'medium',
      vertical,
      autoPublish = false
    } = body;

    // Validate required fields
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const contentRequest: ContentGenerationRequest = {
      topic,
      contentType,
      tone,
      targetAudience,
      keywords,
      length,
      vertical
    };

    let result;

    switch (contentType) {
      case 'blog':
        result = await ContentGenerator.generateBlogPost(contentRequest);
        
        // Auto-publish if requested
        if (autoPublish) {
          await ContentGenerator.saveBlogPost(result);
        }
        
        return res.status(200).json({
          success: true,
          contentType: 'blog',
          data: result,
          published: autoPublish,
          message: autoPublish 
            ? `Blog post "${result.title}" generated and published successfully!`
            : `Blog post "${result.title}" generated. Use /api/agent/publish-content to publish.`
        });

      case 'social':
        result = await ContentGenerator.generateSocialContent(contentRequest);
        return res.status(200).json({
          success: true,
          contentType: 'social',
          data: result,
          message: 'Social media content generated successfully!'
        });

      case 'email':
        result = await ContentGenerator.generateEmailContent(contentRequest);
        return res.status(200).json({
          success: true,
          contentType: 'email',
          data: result,
          message: 'Email content generated successfully!'
        });

      default:
        return res.status(400).json({ error: `Unsupported content type: ${contentType}` });
    }
  } catch (error: any) {
    console.error('Error generating content:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message,
      details: error.toString()
    });
  }
}
