/**
 * Phase 3: Campaign Metrics Writer
 * Writes aggregate telemetry data to campaign_metrics table for Dataverse sync
 */

import { prisma } from "@lib/telemetry-phase2";

export interface CampaignMetricsInput {
  campaignId: string;
  runId: string;
  agentsTotal: number;
  agentsSuccessful: number;
  assetsGenerated: number;
  tokensIn: number;
  tokensOut: number;
  costUSD: number;
  latencyP95Ms: number;
  latencyAvgMs: number;
}

/**
 * Writes campaign metrics to database for Dataverse export
 * Call this after each agent run completes and validation report is generated
 */
export async function writeCampaignMetrics(metrics: CampaignMetricsInput): Promise<void> {
  const successRate = metrics.agentsTotal === 0 
    ? 0 
    : Number(((metrics.agentsSuccessful / metrics.agentsTotal) * 100).toFixed(2));

  await prisma.$executeRawUnsafe(
    `INSERT INTO campaign_metrics
     (campaign_id, run_id, phase, agents_total, agents_successful, assets_generated,
      tokens_in, tokens_out, cost_usd, latency_p95_ms, latency_avg_ms, success_rate_pct)
     VALUES ($1, $2, '2-3', $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    metrics.campaignId,
    metrics.runId,
    metrics.agentsTotal,
    metrics.agentsSuccessful,
    metrics.assetsGenerated,
    metrics.tokensIn,
    metrics.tokensOut,
    metrics.costUSD,
    metrics.latencyP95Ms,
    metrics.latencyAvgMs,
    successRate
  );

  console.log(`✅ Campaign metrics written: ${metrics.campaignId} (${metrics.agentsSuccessful}/${metrics.agentsTotal} agents, $${metrics.costUSD})`);
}

/**
 * Marks a metric row as exported to Dataverse
 * Called by Power Automate flow after successful sync
 */
export async function markMetricExported(runId: string): Promise<void> {
  await prisma.$executeRawUnsafe(
    `UPDATE campaign_metrics SET exported_at = now() WHERE run_id = $1`,
    runId
  );
}

/**
 * Gets recent metrics for local testing/debugging
 */
export async function getRecentMetrics(limit: number = 10) {
  return prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM campaign_metrics ORDER BY created_at DESC LIMIT $1`,
    limit
  );
}
