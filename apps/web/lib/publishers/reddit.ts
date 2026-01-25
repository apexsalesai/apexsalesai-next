/**
 * Reddit Publisher (Stub)
 * Post content to Reddit
 */

import type { PublishContext, PublishResult } from '../publisher-registry';

export async function publish(context: PublishContext): Promise<PublishResult> {
  // TODO: Implement Reddit posting
  // Requires: Reddit OAuth, subreddit selection
  return {
    success: false,
    error: 'Reddit publishing coming soon. Please connect your account in Settings.',
  };
}
