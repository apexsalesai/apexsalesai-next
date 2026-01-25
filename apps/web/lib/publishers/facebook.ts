/**
 * Facebook Publisher (Stub)
 * Post to Facebook Pages
 */

import type { PublishContext, PublishResult } from '../publisher-registry';

export async function publish(context: PublishContext): Promise<PublishResult> {
  // TODO: Implement Facebook Page posting
  // Requires: Facebook Graph API, Page access token
  return {
    success: false,
    error: 'Facebook publishing coming soon. Please connect your account in Settings.',
  };
}
