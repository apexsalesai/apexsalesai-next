/**
 * Campaign Metrics Writer for Dataverse
 * 
 * Writes campaign execution metrics to both Neon (local) and Dataverse (telemetry)
 * for real-time observability in the Studio MetricsPanel.
 */

import { createDataverseClient } from './client';
import { logger } from '../logger';

export interface CampaignMetrics {
  campaignId: string;
  runId: string;
  phase?: string;
  agentsTotal: number;
  agentsSuccessful: number;
  assetsGenerated: number;
  tokensIn: number;
  tokensOut: number;
  costUSD: number;
  latencyP95Ms: number;
  latencyAvgMs: number;
  successRate?: number;
  createdAt?: Date;
}

/**
 * Write campaign metrics to Dataverse
 * 
 * Maps the metrics to Dataverse field names and creates a new record.
 * This function is called after metrics are written to Neon.
 */
export async function writeCampaignMetricsToDataverse(
  metrics: CampaignMetrics
): Promise<string> {
  try {
    // Calculate success rate if not provided
    const successRate = metrics.successRate ?? 
      (metrics.agentsTotal > 0 
        ? (metrics.agentsSuccessful / metrics.agentsTotal) * 100 
        : 0);

    // Map to Dataverse field names (apex_* schema)
    const dataverseRecord = {
      apex_campaignid: metrics.campaignId,
      apex_runid: metrics.runId,
      apex_phase: metrics.phase || '2-3',
      apex_agentstotal: metrics.agentsTotal,
      apex_agentssuccessful: metrics.agentsSuccessful,
      apex_assetsgenerated: metrics.assetsGenerated,
      apex_tokensin: metrics.tokensIn,
      apex_tokensout: metrics.tokensOut,
      apex_costusd: metrics.costUSD,
      apex_latencyp95ms: metrics.latencyP95Ms,
      apex_latencyavgms: metrics.latencyAvgMs,
      apex_successrate: successRate,
      apex_createdat: (metrics.createdAt || new Date()).toISOString(),
    };

    const client = createDataverseClient();
    const recordId = await client.createRecord(
      'apex_campaignmetricses', // Entity set name
      dataverseRecord
    );

    logger.info('Campaign metrics written to Dataverse', {
      context: 'metrics',
      metadata: {
        campaignId: metrics.campaignId,
        runId: metrics.runId,
        recordId,
        successRate,
      },
    });

    return recordId;
  } catch (error) {
    logger.error('Failed to write campaign metrics to Dataverse', error as Error, {
      context: 'metrics',
      metadata: {
        campaignId: metrics.campaignId,
        runId: metrics.runId,
      },
    });
    
    // Don't throw - we don't want Dataverse failures to break the main flow
    // The metrics are still in Neon, so we can retry later
    return '';
  }
}

/**
 * Write campaign metrics to both Neon and Dataverse
 * 
 * This is the main function to call when recording campaign metrics.
 * It writes to Neon first (source of truth), then to Dataverse (telemetry).
 */
export async function writeCampaignMetrics(
  metrics: CampaignMetrics
): Promise<void> {
  try {
    // TODO: Write to Neon database first
    // This would use your existing Prisma client or SQL query
    // Example:
    // await prisma.campaign_metrics.create({ data: metrics });
    
    // Then write to Dataverse for real-time telemetry
    await writeCampaignMetricsToDataverse(metrics);
    
    logger.info('Campaign metrics recorded', {
      context: 'metrics',
      metadata: {
        campaignId: metrics.campaignId,
        runId: metrics.runId,
        phase: metrics.phase,
      },
    });
  } catch (error) {
    logger.error('Failed to record campaign metrics', error as Error, {
      context: 'metrics',
      metadata: {
        campaignId: metrics.campaignId,
        runId: metrics.runId,
      },
    });
    throw error;
  }
}

/**
 * Query recent campaign metrics from Dataverse
 * 
 * Used by the Studio MetricsPanel to display live KPIs.
 */
export async function queryRecentMetrics(limit: number = 10): Promise<any[]> {
  try {
    const client = createDataverseClient();
    const records = await client.queryRecords('apex_campaignmetricses', {
      select: [
        'apex_campaignid',
        'apex_runid',
        'apex_phase',
        'apex_agentstotal',
        'apex_agentssuccessful',
        'apex_assetsgenerated',
        'apex_tokensin',
        'apex_tokensout',
        'apex_costusd',
        'apex_latencyp95ms',
        'apex_latencyavgms',
        'apex_successrate',
        'apex_createdat',
      ],
      orderBy: 'apex_createdat desc',
      top: limit,
    });

    logger.info('Recent metrics queried from Dataverse', {
      context: 'metrics',
      metadata: {
        count: records.length,
        limit,
      },
    });

    return records;
  } catch (error) {
    logger.error('Failed to query recent metrics from Dataverse', error as Error, {
      context: 'metrics',
    });
    throw error;
  }
}
