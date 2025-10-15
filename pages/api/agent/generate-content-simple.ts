import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Simplified API Route: /api/agent/generate-content-simple
 * Purpose: Test endpoint to verify API routing works
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'AI Content Generator (Simple)',
      version: '1.0.0',
      status: 'API route is working!',
      message: 'This endpoint is accessible and functional.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, contentType = 'blog' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Simple mock response for now
    return res.status(200).json({
      success: true,
      contentType,
      data: {
        title: `${topic} - Generated Content`,
        content: `This is a placeholder for AI-generated content about: ${topic}`,
        message: 'Content generation is working! Full AI integration coming next.'
      }
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message
    });
  }
}
