/**
 * Dashboard Health Check API
 * 
 * GET /api/dashboard/health
 * 
 * Returns health status of telemetry infrastructure
 */

import { NextResponse } from 'next/server';
import { DataverseApiService } from '@/lib/services/dataverse/dataverseApi';

export async function GET() {
  const startTime = Date.now();
  
  const health = {
    dataverse: false,
    latencyMs: 0,
    telemetryEnabled: process.env.TELEMETRY_ENABLED === 'true',
    timestamp: new Date().toISOString()
  };

  try {
    // Test Dataverse connectivity
    await DataverseApiService.query('apex_kpi_counters', { top: 1 });
    health.dataverse = true;
    health.latencyMs = Date.now() - startTime;
  } catch (error) {
    console.error('[Health] Dataverse check failed:', error);
    health.dataverse = false;
    health.latencyMs = Date.now() - startTime;
  }

  const status = health.dataverse ? 200 : 503;

  return NextResponse.json(health, { 
    status,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
}
