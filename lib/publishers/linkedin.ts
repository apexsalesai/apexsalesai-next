/**
 * LinkedIn Publisher
 * Post content to LinkedIn using OAuth 2.0
 */

import { PrismaClient } from '@prisma/client';
import { decrypt } from '../encryption';
import type { PublishContext, PublishResult } from '../publisher-registry';

const prisma = new PrismaClient();

export async function publish(context: PublishContext): Promise<PublishResult> {
  try {
    // Get OAuth token
    const token = await prisma.oAuthToken.findFirst({
      where: {
        userId: context.userId,
        platform: 'linkedin',
      },
    });

    if (!token) {
      return {
        success: false,
        error: 'LinkedIn account not connected. Please connect your account first.',
      };
    }

    // Check token expiry
    if (token.expiresAt && new Date(token.expiresAt) < new Date()) {
      return {
        success: false,
        error: 'LinkedIn token expired. Please reconnect your account.',
      };
    }

    // Decrypt access token
    const accessToken = decrypt(token.accessToken);

    // Prepare content (LinkedIn has 3000 char limit)
    const text = `${context.asset.title}\n\n${context.asset.content}`.slice(0, 2900);

    // Build LinkedIn UGC post payload
    const payload = {
      author: `urn:li:person:${(token.metadata as any)?.personId || 'me'}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // Post to LinkedIn
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LinkedIn publish error:', error);
      return {
        success: false,
        error: `LinkedIn API error: ${response.status}`,
      };
    }

    const data = await response.json();
    const postId = data.id;
    const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

    return {
      success: true,
      url: postUrl,
      platformData: data,
    };
  } catch (error: any) {
    console.error('LinkedIn publish error:', error);
    return {
      success: false,
      error: error.message || 'Failed to publish to LinkedIn',
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get LinkedIn profile info (for initial setup)
 */
export async function getProfile(accessToken: string): Promise<any> {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn profile');
  }

  return response.json();
}
