/**
 * Channel Adapters
 * 
 * Multi-platform content publishing system for ApexSalesAI Marketing Studio.
 * Supports Blog, Email, LinkedIn, X (Twitter), and YouTube.
 */

export * from './types';
export * from './base';
export * from './registry';

// Export individual adapters
export { NextJSBlogAdapter } from './adapters/nextjs-blog';
export { EmailAdapter } from './adapters/email';
export { LinkedInAdapter } from './adapters/linkedin';
export { XAdapter } from './adapters/x';
export { YouTubeAdapter } from './adapters/youtube';
