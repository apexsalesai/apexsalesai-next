/**
 * LinkedIn Channel Adapter
 * 
 * Publishes posts to LinkedIn using the LinkedIn API v2.
 * Supports text posts, images, and articles.
 */

import { BaseChannelAdapter } from '../base';
import { PublishOptions, PublishResult } from '../types';

export class LinkedInAdapter extends BaseChannelAdapter {
  readonly type = 'linkedin' as const;
  readonly name = 'LinkedIn';
  
  async publish(options: PublishOptions): Promise<PublishResult> {
    try {
      this.validateConfig(['accessToken', 'personUrn']);
      
      const { accessToken, personUrn } = this.config;
      const { content, media, channelOptions } = options;
      
      // LinkedIn has a 3000 character limit
      const formattedContent = this.truncateContent(content, 3000);
      const visibility = channelOptions?.visibility || 'PUBLIC';
      
      // Prepare post data
      const postData: any = {
        author: personUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: formattedContent,
            },
            shareMediaCategory: media && media.length > 0 ? 'IMAGE' : 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': visibility,
        },
      };
      
      // Add media if provided
      if (media && media.length > 0) {
        const imageMedia = media.filter(m => m.type === 'image');
        if (imageMedia.length > 0) {
          postData.specificContent['com.linkedin.ugc.ShareContent'].media = imageMedia.map(img => ({
            status: 'READY',
            description: {
              text: img.alt || '',
            },
            media: img.url,
            title: {
              text: '',
            },
          }));
        }
      }
      
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`LinkedIn API error: ${error}`);
      }
      
      const result = await response.json();
      const postId = result.id;
      
      // Construct LinkedIn post URL
      const postUrl = `https://www.linkedin.com/feed/update/${postId}`;
      
      return this.createSuccessResult(postUrl, postId, {
        visibility,
        characterCount: formattedContent.length,
      });
    } catch (error) {
      return this.createErrorResult(error as Error);
    }
  }
  
  async delete(publishedId: string): Promise<boolean> {
    try {
      this.validateConfig(['accessToken']);
      
      const { accessToken } = this.config;
      
      const response = await fetch(`https://api.linkedin.com/v2/ugcPosts/${publishedId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete LinkedIn post:', error);
      return false;
    }
  }
  
  async validate(): Promise<boolean> {
    try {
      this.validateConfig(['accessToken']);
      
      const { accessToken } = this.config;
      
      // Validate by getting user profile
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Format content for LinkedIn (preserve line breaks, hashtags)
   */
  protected formatContent(content: string): string {
    // LinkedIn preserves line breaks
    return content;
  }
}
