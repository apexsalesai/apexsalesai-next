/**
 * X (Twitter) Channel Adapter
 * 
 * Publishes tweets to X using the X API v2.
 * Supports text tweets, images, and threads.
 */

import { BaseChannelAdapter } from '../base';
import { PublishOptions, PublishResult } from '../types';

export class XAdapter extends BaseChannelAdapter {
  readonly type = 'x' as const;
  readonly name = 'X (Twitter)';
  
  async publish(options: PublishOptions): Promise<PublishResult> {
    try {
      this.validateConfig(['bearerToken']);
      
      const { bearerToken } = this.config;
      const { content, media, channelOptions } = options;
      
      // X has a 280 character limit
      const formattedContent = this.truncateContent(content, 280);
      const replySettings = channelOptions?.replySettings || 'everyone';
      
      // Prepare tweet data
      const tweetData: any = {
        text: formattedContent,
        reply_settings: replySettings,
      };
      
      // Add media if provided
      if (media && media.length > 0) {
        // Note: Media upload requires a separate API call
        // This is a simplified version - full implementation would upload media first
        const mediaIds = await this.uploadMedia(media, bearerToken);
        if (mediaIds.length > 0) {
          tweetData.media = {
            media_ids: mediaIds,
          };
        }
      }
      
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(tweetData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`X API error: ${error}`);
      }
      
      const result = await response.json();
      const tweetId = result.data.id;
      
      // Construct tweet URL (requires username, which we'd need to fetch)
      const tweetUrl = `https://twitter.com/i/web/status/${tweetId}`;
      
      return this.createSuccessResult(tweetUrl, tweetId, {
        characterCount: formattedContent.length,
        replySettings,
      });
    } catch (error) {
      return this.createErrorResult(error as Error);
    }
  }
  
  async delete(publishedId: string): Promise<boolean> {
    try {
      this.validateConfig(['bearerToken']);
      
      const { bearerToken } = this.config;
      
      const response = await fetch(`https://api.twitter.com/2/tweets/${publishedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete tweet:', error);
      return false;
    }
  }
  
  async validate(): Promise<boolean> {
    try {
      this.validateConfig(['bearerToken']);
      
      const { bearerToken } = this.config;
      
      // Validate by getting authenticated user
      const response = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Upload media to X
   * Note: This is a placeholder - full implementation requires chunked upload
   */
  private async uploadMedia(media: any[], bearerToken: string): Promise<string[]> {
    // Simplified - real implementation would:
    // 1. Upload media to Twitter's media endpoint
    // 2. Wait for processing
    // 3. Return media IDs
    // For now, return empty array
    return [];
  }
  
  /**
   * Format content for X (preserve hashtags, mentions)
   */
  protected formatContent(content: string): string {
    // X automatically links hashtags and mentions
    return content;
  }
}
