/**
 * Pinterest Publisher (Stub)
 * Create pins on Pinterest
 */

import type { PublishContext, PublishResult } from '../publisher-registry';

export async function publish(context: PublishContext): Promise<PublishResult> {
  // TODO: Implement Pinterest pin creation
  // Requires: Pinterest API v5, image handling
  return {
    success: false,
    error: 'Pinterest publishing coming soon. Please connect your account in Settings.',
  };
}
