/**
 * Publisher Registry
 * Central registry for all platform publishers
 */

import * as linkedin from './publishers/linkedin';
import * as x from './publishers/x';
import * as youtube from './publishers/youtube';
import * as instagram from './publishers/instagram';
import * as tiktok from './publishers/tiktok';
import * as wordpress from './publishers/wordpress';
import * as reddit from './publishers/reddit';
import * as pinterest from './publishers/pinterest';
import * as facebook from './publishers/facebook';

export interface PublishContext {
  userId: string;
  asset: {
    id: string;
    title: string;
    content: string;
    type: string;
    metadata?: any;
  };
  metadata?: any;
}

export interface PublishResult {
  success: boolean;
  url?: string;
  error?: string;
  platformData?: any;
}

export type PublisherFunction = (context: PublishContext) => Promise<PublishResult>;

export const publisherRegistry: Record<string, PublisherFunction> = {
  linkedin: linkedin.publish,
  x: x.publish,
  youtube: youtube.publish,
  instagram: instagram.publish,
  tiktok: tiktok.publish,
  wordpress: wordpress.publish,
  reddit: reddit.publish,
  pinterest: pinterest.publish,
  facebook: facebook.publish,
};

export function getPublisher(platform: string): PublisherFunction {
  const publisher = publisherRegistry[platform];
  if (!publisher) {
    throw new Error(`Publisher not found for platform: ${platform}`);
  }
  return publisher;
}

export function getSupportedPlatforms(): string[] {
  return Object.keys(publisherRegistry);
}

export function isPlatformSupported(platform: string): boolean {
  return platform in publisherRegistry;
}
