/**
 * Channel Publishing Metrics Writer for Dataverse
 * 
 * Logs all channel publishing events to Dataverse for analytics and observability.
 * Tracks success/failure rates, latency, and content metadata per channel.
 */

import { createDataverseClient } from './client';
import { logger } from '../logger';
import { ChannelType } from '../channels/types';

export interface ChannelPublishMetrics {
  channel: ChannelType;
  title: string;
  slug?: string;
  publishedUrl?: string;
  publishedId?: string;
  status: 'published' | 'failed' | 'draft';
  error?: string;
  latencyMs?: number;
  contentLength?: number;
  tags?: string[];
  timestamp?: Date;
  campaignId?: string;
  runId?: string;
}

/**
 * Write channel publish metrics to Dataverse
 * 
 * Creates a telemetry record for every publish attempt across all channels.
 * This enables cross-channel analytics and performance monitoring.
 */
export async function writeChannelMetricsToDataverse(
  metrics: ChannelPublishMetrics
): Promise<string> {
  try {
    // Map to Dataverse field names (apex_channelpublish* schema)
    const dataverseRecord = {
      apex_channel: metrics.channel,
      apex_title: metrics.title,
      apex_slug: metrics.slug || '',
      apex_publishedurl: metrics.publishedUrl || '',
      apex_publishedid: metrics.publishedId || '',
      apex_status: metrics.status,
      apex_error: metrics.error || '',
      apex_latencyms: metrics.latencyMs || 0,
      apex_contentlength: metrics.contentLength || 0,
      apex_tags: metrics.tags?.join(', ') || '',
      apex_timestamp: (metrics.timestamp || new Date()).toISOString(),
      apex_campaignid: metrics.campaignId || '',
      apex_runid: metrics.runId || '',
    };

    const client = createDataverseClient();
    const recordId = await client.createRecord(
      'apex_channelpublishes', // Entity set name
      dataverseRecord
    );

    logger.info('Channel publish metrics written to Dataverse', {
      context: 'channel-metrics',
      metadata: {
        channel: metrics.channel,
        title: metrics.title,
        status: metrics.status,
        recordId,
      },
    });

    return recordId;
  } catch (error) {
    logger.error('Failed to write channel metrics to Dataverse', error as Error, {
      context: 'channel-metrics',
      metadata: {
        channel: metrics.channel,
        title: metrics.title,
      },
    });
    
    // Don't throw - we don't want Dataverse failures to break publishing
    return '';
  }
}

/**
 * Log channel publish event
 * 
 * Main function to call after any channel publish attempt.
 * Records success, failure, and performance metrics.
 */
export async function logChannelPublish(
  metrics: ChannelPublishMetrics
): Promise<void> {
  try {
    await writeChannelMetricsToDataverse(metrics);
    
    logger.info('Channel publish event logged', {
      context: 'channel-metrics',
      metadata: {
        channel: metrics.channel,
        status: metrics.status,
        title: metrics.title,
      },
    });
  } catch (error) {
    logger.error('Failed to log channel publish event', error as Error, {
      context: 'channel-metrics',
      metadata: {
        channel: metrics.channel,
        title: metrics.title,
      },
    });
    // Don't throw - logging failures shouldn't break the main flow
  }
}

/**
 * Query recent channel publish metrics from Dataverse
 * 
 * Used by Studio analytics to display channel performance.
 */
export async function queryRecentChannelMetrics(
  channel?: ChannelType,
  limit: number = 50
): Promise<any[]> {
  try {
    const client = createDataverseClient();
    
    const filter = channel ? `apex_channel eq '${channel}'` : undefined;
    
    const records = await client.queryRecords('apex_channelpublishes', {
      select: [
        'apex_channel',
        'apex_title',
        'apex_slug',
        'apex_publishedurl',
        'apex_status',
        'apex_latencyms',
        'apex_contentlength',
        'apex_tags',
        'apex_timestamp',
      ],
      filter,
      orderBy: 'apex_timestamp desc',
      top: limit,
    });

    logger.info('Recent channel metrics queried from Dataverse', {
      context: 'channel-metrics',
      metadata: {
        channel: channel || 'all',
        count: records.length,
        limit,
      },
    });

    return records;
  } catch (error) {
    logger.error('Failed to query channel metrics from Dataverse', error as Error, {
      context: 'channel-metrics',
    });
    throw error;
  }
}
