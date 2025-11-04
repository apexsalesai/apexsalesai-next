/**
 * Base Channel Adapter
 * 
 * Abstract base class that provides common functionality for all channel adapters.
 */

import { ChannelAdapter, ChannelType, PublishOptions, PublishResult } from './types';

export abstract class BaseChannelAdapter implements ChannelAdapter {
  abstract readonly type: ChannelType;
  abstract readonly name: string;
  
  protected config: Record<string, string>;
  
  constructor(config: Record<string, string>) {
    this.config = config;
  }
  
  abstract publish(options: PublishOptions): Promise<PublishResult>;
  
  abstract validate(): Promise<boolean>;
  
  /**
   * Create a standardized success result
   */
  protected createSuccessResult(
    publishedUrl?: string,
    publishedId?: string,
    metadata?: Record<string, any>
  ): PublishResult {
    return {
      success: true,
      channelType: this.type,
      publishedUrl,
      publishedId,
      publishedAt: new Date(),
      metadata,
    };
  }
  
  /**
   * Create a standardized error result
   */
  protected createErrorResult(error: string | Error): PublishResult {
    return {
      success: false,
      channelType: this.type,
      error: error instanceof Error ? error.message : error,
    };
  }
  
  /**
   * Validate required configuration keys
   */
  protected validateConfig(requiredKeys: string[]): void {
    const missing = requiredKeys.filter(key => !this.config[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required configuration for ${this.name}: ${missing.join(', ')}`
      );
    }
  }
  
  /**
   * Truncate content to fit channel limits
   */
  protected truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Extract hashtags from content
   */
  protected extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  }
  
  /**
   * Format content for specific channel (can be overridden)
   */
  protected formatContent(content: string): string {
    return content;
  }
}
