/**
 * X (Twitter) Publisher
 * Post tweets using OAuth 2.0
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
        platform: 'x',
      },
    });

    if (!token) {
      return {
        success: false,
        error: 'X (Twitter) account not connected. Please connect your account first.',
      };
    }

    // Check token expiry
    if (token.expiresAt && new Date(token.expiresAt) < new Date()) {
      return {
        success: false,
        error: 'X token expired. Please reconnect your account.',
      };
    }

    // Decrypt access token
    const accessToken = decrypt(token.accessToken);

    // Prepare tweet text (280 char limit)
    let text = context.asset.title;
    if (text.length > 280) {
      text = text.slice(0, 277) + '...';
    }

    // Build tweet payload
    const payload = {
      text: text,
    };

    // Post to X API v2
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('X publish error:', error);
      return {
        success: false,
        error: `X API error: ${response.status}`,
      };
    }

    const data = await response.json();
    const tweetId = data.data.id;
    const username = token.metadata?.username || 'user';
    const tweetUrl = `https://twitter.com/${username}/status/${tweetId}`;

    return {
      success: true,
      url: tweetUrl,
      platformData: data,
    };
  } catch (error: any) {
    console.error('X publish error:', error);
    return {
      success: false,
      error: error.message || 'Failed to publish to X',
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get X user info
 */
export async function getUser(accessToken: string): Promise<any> {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch X user info');
  }

  return response.json();
}
