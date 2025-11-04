/**
 * Channel Registry
 * 
 * Central registry for all channel adapters.
 * Provides factory methods to create and manage channel instances.
 */

import { ChannelAdapter, ChannelType, ChannelConfig } from './types';
import { NextJSBlogAdapter } from './adapters/nextjs-blog';
import { EmailAdapter } from './adapters/email';
import { LinkedInAdapter } from './adapters/linkedin';
import { XAdapter } from './adapters/x';
import { YouTubeAdapter } from './adapters/youtube';

export class ChannelRegistry {
  private static adapters: Map<ChannelType, ChannelAdapter> = new Map();
  
  /**
   * Initialize all channel adapters from environment variables
   */
  static initialize(): void {
    // Blog (Next.js built-in)
    if (process.env.BLOG_ENABLED === 'true') {
      this.register('blog', new NextJSBlogAdapter({}));
    }
    
    // Email
    if (process.env.EMAIL_ENABLED === 'true') {
      this.register('email', new EmailAdapter({
        apiKey: process.env.SENDGRID_API_KEY || '',
        fromEmail: process.env.EMAIL_FROM_ADDRESS || '',
        fromName: process.env.EMAIL_FROM_NAME || 'ApexSalesAI',
      }));
    }
    
    // LinkedIn
    if (process.env.LINKEDIN_ENABLED === 'true') {
      this.register('linkedin', new LinkedInAdapter({
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
        personUrn: process.env.LINKEDIN_PERSON_URN || '',
      }));
    }
    
    // X (Twitter)
    if (process.env.X_ENABLED === 'true') {
      this.register('x', new XAdapter({
        bearerToken: process.env.X_BEARER_TOKEN || '',
      }));
    }
    
    // YouTube
    if (process.env.YOUTUBE_ENABLED === 'true') {
      this.register('youtube', new YouTubeAdapter({
        accessToken: process.env.YOUTUBE_ACCESS_TOKEN || '',
      }));
    }
  }
  
  /**
   * Register a channel adapter
   */
  static register(type: ChannelType, adapter: ChannelAdapter): void {
    this.adapters.set(type, adapter);
  }
  
  /**
   * Get a channel adapter by type
   */
  static get(type: ChannelType): ChannelAdapter | undefined {
    return this.adapters.get(type);
  }
  
  /**
   * Get all registered channel adapters
   */
  static getAll(): ChannelAdapter[] {
    return Array.from(this.adapters.values());
  }
  
  /**
   * Get all enabled channel types
   */
  static getEnabledChannels(): ChannelType[] {
    return Array.from(this.adapters.keys());
  }
  
  /**
   * Check if a channel is enabled
   */
  static isEnabled(type: ChannelType): boolean {
    return this.adapters.has(type);
  }
  
  /**
   * Validate all registered channels
   */
  static async validateAll(): Promise<Record<ChannelType, boolean>> {
    const results: Partial<Record<ChannelType, boolean>> = {};
    
    for (const [type, adapter] of this.adapters.entries()) {
      try {
        results[type] = await adapter.validate();
      } catch (error) {
        console.error(`Failed to validate ${type}:`, error);
        results[type] = false;
      }
    }
    
    return results as Record<ChannelType, boolean>;
  }
  
  /**
   * Clear all registered adapters
   */
  static clear(): void {
    this.adapters.clear();
  }
}

// Initialize on module load
ChannelRegistry.initialize();
