/**
 * Instagram Publisher
 * Post content to Instagram using Meta Graph API
 */

import { prisma } from '../prisma';
import { decrypt } from '../encryption';
import type { PublishContext, PublishResult } from '../publisher-registry';

export async function publish(context: PublishContext): Promise<PublishResult> {
  try {
    // Get OAuth token
    const token = await prisma.oAuthToken.findFirst({
      where: {
        userId: context.userId,
        platform: 'instagram',
      },
    });

    if (!token) {
      return {
        success: false,
        error: 'Instagram account not connected. Please connect your account first.',
      };
    }

    // Decrypt access token
    const accessToken = decrypt(token.accessToken);
    const metadata = token.metadata as { igUserId?: string } | null;
    const igUserId = metadata?.igUserId;

    if (!igUserId) {
      return {
        success: false,
        error: 'Instagram Business Account not configured.',
      };
    }

    // Prepare caption (2200 char limit)
    const caption = `${context.asset.title}\n\n${context.asset.content}`.slice(0, 2200);

    // Note: Instagram requires an image URL for posts
    // This is a simplified implementation - full version needs image handling
    const imageUrl = context.asset.metadata?.imageUrl;

    if (!imageUrl) {
      return {
        success: false,
        error: 'Instagram posts require an image. Please add an image URL to the asset metadata.',
      };
    }

    // Create container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.text();
      console.error('Instagram container creation error:', error);
      return {
        success: false,
        error: `Instagram API error: ${containerResponse.status}`,
      };
    }

    const containerData = await containerResponse.json();
    const creationId = containerData.id;

    // Publish container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      console.error('Instagram publish error:', error);
      return {
        success: false,
        error: `Instagram publish failed: ${publishResponse.status}`,
      };
    }

    const publishData = await publishResponse.json();
    const mediaId = publishData.id;
    const postUrl = `https://www.instagram.com/p/${mediaId}`;

    return {
      success: true,
      url: postUrl,
      platformData: publishData,
    };
  } catch (error: any) {
    console.error('Instagram publish error:', error);
    return {
      success: false,
      error: error.message || 'Failed to publish to Instagram',
    };
  } finally {
    await prisma.$disconnect();
  }
}
