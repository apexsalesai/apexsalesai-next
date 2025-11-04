/**
 * Blog Channel Adapter
 * 
 * Publishes content to WordPress or custom blog platforms.
 * Supports WordPress REST API v2.
 */

import { BaseChannelAdapter } from '../base';
import { PublishOptions, PublishResult } from '../types';

export class BlogAdapter extends BaseChannelAdapter {
  readonly type = 'blog' as const;
  readonly name = 'Blog';
  
  async publish(options: PublishOptions): Promise<PublishResult> {
    try {
      this.validateConfig(['url', 'username', 'password']);
      
      const { url, username, password } = this.config;
      const { title, content, excerpt, tags, categories, channelOptions } = options;
      
      // WordPress REST API endpoint
      const endpoint = `${url}/wp-json/wp/v2/posts`;
      
      // Prepare post data
      const postData = {
        title: title || 'Untitled Post',
        content: content,
        excerpt: excerpt || this.generateExcerpt(content),
        status: options.status || 'draft',
        tags: tags || [],
        categories: categories || [],
        slug: channelOptions?.slug,
        featured_media: channelOptions?.featuredImage,
      };
      
      // Basic auth credentials
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`WordPress API error: ${error}`);
      }
      
      const result = await response.json();
      
      return this.createSuccessResult(
        result.link,
        result.id.toString(),
        {
          slug: result.slug,
          status: result.status,
          modified: result.modified,
        }
      );
    } catch (error) {
      return this.createErrorResult(error as Error);
    }
  }
  
  async update(publishedId: string, options: Partial<PublishOptions>): Promise<PublishResult> {
    try {
      this.validateConfig(['url', 'username', 'password']);
      
      const { url, username, password } = this.config;
      const endpoint = `${url}/wp-json/wp/v2/posts/${publishedId}`;
      
      const updateData: any = {};
      if (options.title) updateData.title = options.title;
      if (options.content) updateData.content = options.content;
      if (options.excerpt) updateData.excerpt = options.excerpt;
      if (options.tags) updateData.tags = options.tags;
      if (options.categories) updateData.categories = options.categories;
      if (options.status) updateData.status = options.status;
      
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      return this.createSuccessResult(result.link, publishedId);
    } catch (error) {
      return this.createErrorResult(error as Error);
    }
  }
  
  async delete(publishedId: string): Promise<boolean> {
    try {
      this.validateConfig(['url', 'username', 'password']);
      
      const { url, username, password } = this.config;
      const endpoint = `${url}/wp-json/wp/v2/posts/${publishedId}`;
      
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      return false;
    }
  }
  
  async validate(): Promise<boolean> {
    try {
      this.validateConfig(['url', 'username', 'password']);
      
      const { url, username, password } = this.config;
      const endpoint = `${url}/wp-json/wp/v2/users/me`;
      
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Generate excerpt from content (first 150 characters)
   */
  private generateExcerpt(content: string): string {
    const plainText = content.replace(/<[^>]*>/g, ''); // Strip HTML
    return this.truncateContent(plainText, 150);
  }
}
