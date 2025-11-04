/**
 * Campaign Metrics API Route
 * 
 * POST /api/metrics/campaign - Record new campaign metrics
 * GET /api/metrics/campaign - Query recent metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeCampaignMetrics, queryRecentMetrics, CampaignMetrics } from '@/lib/dataverse/writeCampaignMetrics';
import { logger } from '@/lib/logger';

/**
 * POST /api/metrics/campaign
 * 
 * Record new campaign execution metrics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const required = [
      'campaignId',
      'runId',
      'agentsTotal',
      'agentsSuccessful',
      'assetsGenerated',
      'tokensIn',
      'tokensOut',
      'costUSD',
      'latencyP95Ms',
      'latencyAvgMs',
    ];
    
    const missing = required.filter(field => !(field in body));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    const metrics: CampaignMetrics = {
      campaignId: body.campaignId,
      runId: body.runId,
      phase: body.phase || '2-3',
      agentsTotal: body.agentsTotal,
      agentsSuccessful: body.agentsSuccessful,
      assetsGenerated: body.assetsGenerated,
      tokensIn: body.tokensIn,
      tokensOut: body.tokensOut,
      costUSD: body.costUSD,
      latencyP95Ms: body.latencyP95Ms,
      latencyAvgMs: body.latencyAvgMs,
      successRate: body.successRate,
      createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
    };

    await writeCampaignMetrics(metrics);

    return NextResponse.json({
      success: true,
      message: 'Campaign metrics recorded',
      runId: metrics.runId,
    });
  } catch (error) {
    logger.error('Failed to record campaign metrics via API', error as Error, {
      context: 'api',
    });
    
    return NextResponse.json(
      { error: 'Failed to record metrics' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/metrics/campaign
 * 
 * Query recent campaign metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const metrics = await queryRecentMetrics(limit);

    return NextResponse.json({
      success: true,
      count: metrics.length,
      metrics,
    });
  } catch (error) {
    logger.error('Failed to query campaign metrics via API', error as Error, {
      context: 'api',
    });
    
    return NextResponse.json(
      { error: 'Failed to query metrics' },
      { status: 500 }
    );
  }
}
