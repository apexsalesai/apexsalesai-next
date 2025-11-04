/**
 * Next.js Blog Channel Adapter
 * 
 * Publishes content to ApexSalesAI's built-in Next.js blog.
 * Creates Markdown files in /content/blog/ with proper frontmatter.
 */

import { BaseChannelAdapter } from '../base';
import { PublishOptions, PublishResult } from '../types';
import { logChannelPublish } from '../../dataverse';
import fs from 'fs/promises';
import path from 'path';

export class NextJSBlogAdapter extends BaseChannelAdapter {
  readonly type = 'blog' as const;
  readonly name = 'ApexSalesAI Blog';
  
  private readonly contentDir = path.join(process.cwd(), 'content', 'blog');
  
  async publish(options: PublishOptions): Promise<PublishResult> {
    const startTime = Date.now();
    
    try {
      const { title, content, excerpt, tags, channelOptions } = options;
      
      if (!title) {
        throw new Error('Title is required for blog posts');
      }
      
      // Generate slug from title or use custom slug
      const slug = channelOptions?.slug || this.generateSlug(title);
      
      // Generate filename with date prefix (YYYY-MM-DD-slug.md)
      const date = new Date().toISOString().split('T')[0];
      const filename = `${date}-${slug}.md`;
      const filepath = path.join(this.contentDir, filename);
      
      // Check if file already exists
      try {
        await fs.access(filepath);
        throw new Error(`Blog post with slug "${slug}" already exists`);
      } catch (error: any) {
        if (error.code !== 'ENOENT') throw error;
        // File doesn't exist, continue
      }
      
      // Prepare frontmatter
      const frontmatter = this.generateFrontmatter({
        title,
        date,
        author: 'ApexSalesAI Editorial Team',
        excerpt: excerpt || this.generateExcerpt(content),
        image: channelOptions?.featuredImage || this.getDefaultImage(),
        tags: tags || ['AI Marketing', 'Sales Automation'],
        metaTitle: title,
        metaDescription: excerpt || this.generateExcerpt(content),
        keywords: tags || ['AI Marketing', 'Sales Automation'],
      });
      
      // Combine frontmatter and content
      const markdownContent = `${frontmatter}\n\n${content}`;
      
      // Ensure content directory exists
      await fs.mkdir(this.contentDir, { recursive: true });
      
      // Write file
      await fs.writeFile(filepath, markdownContent, 'utf-8');
      
      // Generate public URL
      const publicUrl = `https://www.apexsalesai.com/blog/${slug}`;
      
      // Calculate latency
      const latencyMs = Date.now() - startTime;
      
      // Log to Dataverse for telemetry
      await logChannelPublish({
        channel: 'blog',
        title,
        slug,
        publishedUrl: publicUrl,
        publishedId: slug,
        status: 'published',
        latencyMs,
        contentLength: content.length,
        tags: tags || [],
        timestamp: new Date(),
      });
      
      return this.createSuccessResult(publicUrl, slug, {
        filename,
        filepath,
        note: 'Blog post created. Deploy to Vercel to make it live.',
      });
    } catch (error) {
      // Log failure to Dataverse
      const latencyMs = Date.now() - startTime;
      await logChannelPublish({
        channel: 'blog',
        title: options.title || 'Unknown',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        latencyMs,
        timestamp: new Date(),
      });
      
      return this.createErrorResult(error as Error);
    }
  }
  
  async update(publishedId: string, options: Partial<PublishOptions>): Promise<PublishResult> {
    try {
      // Find the file with this slug
      const files = await fs.readdir(this.contentDir);
      const matchingFile = files.find(f => f.endsWith(`-${publishedId}.md`));
      
      if (!matchingFile) {
        throw new Error(`Blog post with slug "${publishedId}" not found`);
      }
      
      const filepath = path.join(this.contentDir, matchingFile);
      
      // Read existing content
      const existingContent = await fs.readFile(filepath, 'utf-8');
      const { frontmatter: existingFrontmatter, content: existingBody } = this.parseFrontmatter(existingContent);
      
      // Update frontmatter
      const updatedFrontmatter = {
        ...existingFrontmatter,
        ...(options.title && { title: options.title }),
        ...(options.excerpt && { excerpt: options.excerpt }),
        ...(options.tags && { tags: options.tags }),
      };
      
      // Update content
      const updatedBody = options.content || existingBody;
      
      // Regenerate file
      const newFrontmatter = this.generateFrontmatter(updatedFrontmatter);
      const newContent = `${newFrontmatter}\n\n${updatedBody}`;
      
      await fs.writeFile(filepath, newContent, 'utf-8');
      
      const publicUrl = `https://www.apexsalesai.com/blog/${publishedId}`;
      
      return this.createSuccessResult(publicUrl, publishedId, {
        filename: matchingFile,
        note: 'Blog post updated. Deploy to Vercel to make changes live.',
      });
    } catch (error) {
      return this.createErrorResult(error as Error);
    }
  }
  
  async delete(publishedId: string): Promise<boolean> {
    try {
      const files = await fs.readdir(this.contentDir);
      const matchingFile = files.find(f => f.endsWith(`-${publishedId}.md`));
      
      if (!matchingFile) {
        return false;
      }
      
      const filepath = path.join(this.contentDir, matchingFile);
      await fs.unlink(filepath);
      
      return true;
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      return false;
    }
  }
  
  async validate(): Promise<boolean> {
    try {
      // Check if content directory exists and is writable
      await fs.access(this.contentDir, fs.constants.W_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  /**
   * Generate frontmatter YAML
   */
  private generateFrontmatter(data: Record<string, any>): string {
    const lines = ['---'];
    
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
      } else if (typeof value === 'string') {
        lines.push(`${key}: "${value}"`);
      } else {
        lines.push(`${key}: ${value}`);
      }
    }
    
    lines.push('---');
    return lines.join('\n');
  }
  
  /**
   * Parse frontmatter from markdown content
   */
  private parseFrontmatter(content: string): { frontmatter: Record<string, any>; content: string } {
    const match = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
    
    if (!match) {
      return { frontmatter: {}, content };
    }
    
    const frontmatterText = match[1];
    const body = match[2];
    
    // Simple YAML parser (for basic key-value pairs)
    const frontmatter: Record<string, any> = {};
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
    }
    
    return { frontmatter, content: body };
  }
  
  /**
   * Generate excerpt from content (first 150 characters)
   */
  private generateExcerpt(content: string): string {
    const plainText = content
      .replace(/^#+ .+$/gm, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/[*_`]/g, '') // Remove markdown formatting
      .trim();
    
    return this.truncateContent(plainText, 150);
  }
  
  /**
   * Get default featured image
   */
  private getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80';
  }
}
