/**
 * Content Generator Service
 * AI-powered marketing content generation for blog posts, social media, and more
 */

import OpenAI from 'openai';
import { logger } from '../../logger';

// Robust API key fallback logic
const openaiKey = 
  process.env.OPENAI_API_KEY || 
  process.env.AZURE_OPENAI_API_KEY || 
  process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!openaiKey) {
  throw new Error('Missing OpenAI API key in environment variables. Please set OPENAI_API_KEY or AZURE_OPENAI_API_KEY.');
}

const openai = new OpenAI({
  apiKey: openaiKey,
});

export interface ContentGenerationRequest {
  topic: string;
  contentType: 'blog' | 'social' | 'email' | 'case-study';
  tone?: 'professional' | 'casual' | 'technical' | 'executive';
  targetAudience?: string;
  keywords?: string[];
  length?: 'short' | 'medium' | 'long';
  vertical?: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  image?: string;
  seoMetadata?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export class ContentGenerator {
  /**
   * Generate a complete blog post using AI
   */
  static async generateBlogPost(request: ContentGenerationRequest): Promise<BlogPost> {
    try {
      logger.info(`Generating blog post: ${request.topic} (${request.vertical || 'general'})`);

      const prompt = this.buildBlogPrompt(request);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert content writer for ApexSalesAI, a premium enterprise AI sales platform. 
Your writing is:
- Professional yet engaging
- Data-driven with real insights
- Focused on ROI and business outcomes
- Tailored for C-level executives and revenue leaders
- SEO-optimized
- Authoritative on AI, sales automation, and revenue operations

Format your response as JSON with these fields:
{
  "title": "Compelling blog post title",
  "content": "Full markdown-formatted blog post content (1500-2000 words)",
  "excerpt": "Engaging 2-sentence summary",
  "tags": ["tag1", "tag2", "tag3"],
  "metaTitle": "SEO-optimized title (60 chars max)",
  "metaDescription": "SEO meta description (155 chars max)",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');

      // Generate slug from title
      const slug = this.generateSlug(response.title);

      // Create blog post object
      const blogPost: BlogPost = {
        title: response.title,
        slug,
        content: response.content,
        excerpt: response.excerpt,
        author: 'ApexSalesAI Editorial Team',
        date: new Date().toISOString().split('T')[0],
        tags: response.tags || [],
        image: this.getRelevantImage(request.topic),
        seoMetadata: {
          metaTitle: response.metaTitle,
          metaDescription: response.metaDescription,
          keywords: response.keywords || []
        }
      };

      logger.info(`Blog post generated successfully: ${blogPost.title} (${slug})`);

      return blogPost;
    } catch (error) {
      logger.error(`Error generating blog post: ${error}`);
      throw new Error(`Failed to generate blog post: ${error}`);
    }
  }

  /**
   * Generate social media content
   */
  static async generateSocialContent(request: ContentGenerationRequest): Promise<{
    linkedin: string;
    twitter: string;
    facebook: string;
  }> {
    try {
      const prompt = `Create engaging social media posts about: ${request.topic}
      
Target audience: ${request.targetAudience || 'Revenue leaders and sales professionals'}
Tone: ${request.tone || 'professional'}
Keywords: ${request.keywords?.join(', ') || 'AI, sales automation, revenue operations'}

Create posts for LinkedIn, Twitter, and Facebook that:
- Highlight business value and ROI
- Include relevant hashtags
- Have clear calls-to-action
- Are optimized for each platform's best practices`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a social media expert for B2B SaaS companies. Create engaging, professional content that drives engagement and conversions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return response;
    } catch (error) {
      logger.error(`Error generating social content: ${error}`);
      throw new Error(`Failed to generate social content: ${error}`);
    }
  }

  /**
   * Generate email marketing content
   */
  static async generateEmailContent(request: ContentGenerationRequest): Promise<{
    subject: string;
    preheader: string;
    body: string;
    cta: string;
  }> {
    try {
      const prompt = `Create a compelling marketing email about: ${request.topic}
      
Target audience: ${request.targetAudience || 'Revenue leaders'}
Tone: ${request.tone || 'professional'}
Goal: Drive engagement and demo requests

Include:
- Attention-grabbing subject line
- Engaging preheader text
- Value-focused body content
- Clear call-to-action`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an email marketing expert specializing in B2B SaaS. Create high-converting email content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const response = JSON.parse(completion.choices[0].message.content || '{}');
      return response;
    } catch (error) {
      logger.error(`Error generating email content: ${error}`);
      throw new Error(`Failed to generate email content: ${error}`);
    }
  }

  /**
   * Build prompt for blog post generation
   */
  private static buildBlogPrompt(request: ContentGenerationRequest): string {
    const lengthMap = {
      short: '800-1000 words',
      medium: '1500-2000 words',
      long: '2500-3000 words'
    };

    return `Write a comprehensive blog post about: ${request.topic}

Target audience: ${request.targetAudience || 'C-level executives and revenue leaders'}
Tone: ${request.tone || 'professional'}
Length: ${lengthMap[request.length || 'medium']}
${request.vertical ? `Industry vertical: ${request.vertical}` : ''}
${request.keywords ? `Keywords to include: ${request.keywords.join(', ')}` : ''}

The blog post should:
1. Start with a compelling hook that addresses a real business pain point
2. Include data-driven insights and statistics
3. Provide actionable takeaways
4. Showcase ApexSalesAI's unique value proposition
5. Include real-world examples or case studies
6. End with a clear call-to-action
7. Be SEO-optimized with proper headings and structure
8. Use markdown formatting for readability

Focus on:
- ROI and business outcomes
- How AI agents transform revenue operations
- Competitive advantages of autonomous sales execution
- Enterprise-grade capabilities and compliance
- Real-world success metrics`;
  }

  /**
   * Generate URL-friendly slug from title
   */
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get relevant stock image based on topic
   */
  private static getRelevantImage(topic: string): string {
    const imageMap: Record<string, string> = {
      ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      sales: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      automation: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      revenue: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      analytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    };

    // Find matching keyword
    const topicLower = topic.toLowerCase();
    for (const [keyword, image] of Object.entries(imageMap)) {
      if (topicLower.includes(keyword)) {
        return image;
      }
    }

    // Default image
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
  }

  /**
   * Save blog post to GitHub (Vercel-compatible)
   */
  static async saveBlogPost(blogPost: BlogPost): Promise<{ commitUrl: string; filePath: string }> {
    try {
      // Import GitHub publishing service
      const { publishMarkdown } = await import('./publishToGithub');

      // Publish to GitHub
      const result = await publishMarkdown({
        title: blogPost.title,
        slug: blogPost.slug,
        frontmatter: {
          title: blogPost.title,
          date: blogPost.date,
          author: blogPost.author,
          excerpt: blogPost.excerpt,
          image: blogPost.image || '',
          tags: blogPost.tags,
          metaTitle: blogPost.seoMetadata?.metaTitle || blogPost.title,
          metaDescription: blogPost.seoMetadata?.metaDescription || blogPost.excerpt,
          keywords: blogPost.seoMetadata?.keywords || []
        },
        body: blogPost.content
      });

      logger.info(`Blog post published to GitHub: ${result.path}`);
      
      return {
        commitUrl: result.url || '',
        filePath: result.path
      };
    } catch (error) {
      logger.error(`Error publishing blog post to GitHub: ${error}`);
      throw new Error(`Failed to publish blog post: ${error}`);
    }
  }
}
