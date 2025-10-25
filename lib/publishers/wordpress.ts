/**
 * WordPress Publisher
 * Post content to WordPress blog
 */

import type { PublishContext, PublishResult } from '../publisher-registry';

export async function publish(context: PublishContext): Promise<PublishResult> {
  try {
    const username = process.env.WORDPRESS_USERNAME;
    const appPassword = process.env.WORDPRESS_APP_PASSWORD;
    const siteUrl = process.env.WORDPRESS_SITE_URL || 'https://yourblog.wordpress.com';

    if (!username || !appPassword) {
      return {
        success: false,
        error: 'WordPress credentials not configured. Please set WORDPRESS_USERNAME and WORDPRESS_APP_PASSWORD.',
      };
    }

    // Prepare post data
    const postData = {
      title: context.asset.title,
      content: context.asset.content,
      status: 'publish',
      format: 'standard',
    };

    // Basic auth
    const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');

    // Post to WordPress REST API
    const response = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('WordPress publish error:', error);
      return {
        success: false,
        error: `WordPress API error: ${response.status}`,
      };
    }

    const data = await response.json();
    const postUrl = data.link;

    return {
      success: true,
      url: postUrl,
      platformData: data,
    };
  } catch (error: any) {
    console.error('WordPress publish error:', error);
    return {
      success: false,
      error: error.message || 'Failed to publish to WordPress',
    };
  }
}
