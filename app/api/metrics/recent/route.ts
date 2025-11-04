/**
 * Phase 3: Metrics API Route
 * GET /api/metrics/recent - Fetches recent campaign metrics from Dataverse
 */

import { NextResponse } from 'next/server';
import { getRecentMetrics } from '@lib/dataverse/getMetrics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const metrics = await getRecentMetrics(limit);

    return NextResponse.json({
      ok: true,
      count: metrics.length,
      metrics,
    });

  } catch (error: any) {
    console.error('Metrics API error:', error);

    // Return graceful error for missing credentials
    if (error.message.includes('Missing Dataverse credentials')) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Dataverse not configured',
          message: 'Set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, DATAVERSE_RESOURCE',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to fetch metrics',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
