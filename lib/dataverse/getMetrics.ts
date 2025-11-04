/**
 * Phase 3: Dataverse Metrics Reader
 * Fetches campaign metrics from Dataverse for Studio dashboard
 */

import { getDataverseToken } from './token';

export interface CampaignMetric {
  apex_campaignid: string;
  apex_runid: string;
  apex_phase: string;
  apex_agents_total: number;
  apex_agents_success: number;
  apex_assets_generated: number;
  apex_tokens_in: number;
  apex_tokens_out: number;
  apex_cost_usd: number;
  apex_latency_p95_ms: number;
  apex_latency_avg_ms: number;
  apex_success_rate: number;
  apex_created_at: string;
}

interface DataverseResponse {
  value: CampaignMetric[];
  '@odata.context': string;
  '@odata.count'?: number;
}

/**
 * Fetches recent campaign metrics from Dataverse
 * @param limit Number of records to fetch (default: 30)
 * @returns Array of campaign metrics
 */
export async function getRecentMetrics(limit: number = 30): Promise<CampaignMetric[]> {
  const resource = process.env.DATAVERSE_RESOURCE;

  if (!resource) {
    throw new Error('DATAVERSE_RESOURCE environment variable not set');
  }

  const accessToken = await getDataverseToken();

  // Dataverse Web API endpoint for the custom table
  const url = `${resource}/api/data/v9.2/apex_campaignmetricses?$orderby=apex_created_at desc&$top=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dataverse API error (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as DataverseResponse;
    
    console.log(`✅ Fetched ${data.value.length} metrics from Dataverse`);
    return data.value;

  } catch (error: any) {
    console.error('❌ Dataverse metrics fetch failed:', error.message);
    throw new Error(`Failed to fetch metrics from Dataverse: ${error.message}`);
  }
}

/**
 * Gets aggregate statistics from recent metrics
 */
export async function getMetricsStats() {
  const metrics = await getRecentMetrics(100);

  if (metrics.length === 0) {
    return {
      avgCost: 0,
      avgP95Latency: 0,
      avgSuccessRate: 0,
      totalAssets: 0,
      totalCampaigns: metrics.length,
    };
  }

  const stats = metrics.reduce(
    (acc, m) => ({
      totalCost: acc.totalCost + Number(m.apex_cost_usd),
      totalP95: acc.totalP95 + m.apex_latency_p95_ms,
      totalSuccessRate: acc.totalSuccessRate + Number(m.apex_success_rate),
      totalAssets: acc.totalAssets + m.apex_assets_generated,
    }),
    { totalCost: 0, totalP95: 0, totalSuccessRate: 0, totalAssets: 0 }
  );

  return {
    avgCost: Number((stats.totalCost / metrics.length).toFixed(5)),
    avgP95Latency: Math.round(stats.totalP95 / metrics.length),
    avgSuccessRate: Number((stats.totalSuccessRate / metrics.length).toFixed(1)),
    totalAssets: stats.totalAssets,
    totalCampaigns: metrics.length,
  };
}
