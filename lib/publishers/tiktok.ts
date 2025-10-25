/**
 * TikTok Publisher (Stub)
 * Upload videos to TikTok
 */

import type { PublishContext, PublishResult } from '../publisher-registry';

export async function publish(context: PublishContext): Promise<PublishResult> {
  // TODO: Implement TikTok video upload
  // Requires: TikTok Business API, video file handling
  return {
    success: false,
    error: 'TikTok publishing coming soon. Please connect your account in Settings.',
  };
}
