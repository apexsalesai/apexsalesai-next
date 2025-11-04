/**
 * Channel Adapter Types
 * 
 * Defines the interface for all social media and content publishing channels.
 * Each channel adapter implements this interface to provide consistent publishing.
 */

export type ChannelType = 'blog' | 'email' | 'linkedin' | 'x' | 'youtube' | 'tiktok' | 'instagram' | 'reddit' | 'pinterest' | 'twitch';

export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface PublishResult {
  success: boolean;
  channelType: ChannelType;
  publishedUrl?: string;
  publishedId?: string;
  publishedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ScheduleOptions {
  publishAt: Date;
  timezone?: string;
}

export interface MediaAttachment {
  type: 'image' | 'video' | 'document';
  url: string;
  alt?: string;
  thumbnail?: string;
  duration?: number; // for videos, in seconds
}

export interface PublishOptions {
  // Content
  title?: string;
  content: string;
  excerpt?: string;
  
  // Media
  media?: MediaAttachment[];
  
  // Metadata
  tags?: string[];
  categories?: string[];
  
  // Publishing
  status?: 'draft' | 'published';
  schedule?: ScheduleOptions;
  
  // Channel-specific options
  channelOptions?: {
    // Blog
    slug?: string;
    featuredImage?: string;
    
    // Email
    subject?: string;
    preheader?: string;
    recipients?: string[];
    segmentId?: string;
    
    // LinkedIn
    visibility?: 'PUBLIC' | 'CONNECTIONS';
    
    // X/Twitter
    replySettings?: 'everyone' | 'mentionedUsers' | 'following';
    
    // YouTube
    privacyStatus?: 'public' | 'private' | 'unlisted';
    categoryId?: string;
    madeForKids?: boolean;
  };
}

export interface ChannelAdapter {
  /**
   * Channel type identifier
   */
  readonly type: ChannelType;
  
  /**
   * Channel display name
   */
  readonly name: string;
  
  /**
   * Publish content to the channel
   */
  publish(options: PublishOptions): Promise<PublishResult>;
  
  /**
   * Schedule content for future publishing
   */
  schedule?(options: PublishOptions): Promise<PublishResult>;
  
  /**
   * Update existing published content
   */
  update?(publishedId: string, options: Partial<PublishOptions>): Promise<PublishResult>;
  
  /**
   * Delete published content
   */
  delete?(publishedId: string): Promise<boolean>;
  
  /**
   * Get publishing status
   */
  getStatus?(publishedId: string): Promise<PublishStatus>;
  
  /**
   * Validate credentials and connection
   */
  validate(): Promise<boolean>;
}

export interface ChannelConfig {
  enabled: boolean;
  credentials: Record<string, string>;
  defaultOptions?: Partial<PublishOptions>;
}

export interface ChannelConfigRegistry {
  blog?: ChannelConfig;
  email?: ChannelConfig;
  linkedin?: ChannelConfig;
  x?: ChannelConfig;
  youtube?: ChannelConfig;
}
