/**
 * KPI API endpoint that integrates with Dataverse
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKpiService } from '../../../lib/services/dataverse/kpiService';
import { ErrorLogger } from '../../../lib/utils/errorLogger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vertical = searchParams.get('vertical') || 'realEstate';
    
    // Get Dataverse configuration from environment variables
    const config = {
      tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID || '',
      clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
      clientSecret: process.env.AZURE_CLIENT_SECRET || '',
      resourceUrl: process.env.NEXT_PUBLIC_DATAVERSE_URL || '',
      apiVersion: '9.2',
      environment: process.env.NODE_ENV || 'development'
    };

    // Check if Dataverse is properly configured
    if (!config.tenantId || !config.clientId || !config.resourceUrl) {
      return NextResponse.json(
        { 
          error: 'Dataverse configuration missing',
          usingMockData: true
        },
        { status: 503 }
      );
    }

    // Get KPI service instance
    const kpiService = getKpiService(config);
    
    // Test connection
    const isConnected = await kpiService.testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to Dataverse',
          usingMockData: true
        },
        { status: 503 }
      );
    }
    
    // Fetch dashboard data
    const dashboardData = await kpiService.getDashboardData(vertical);
    
    // Transform to API response format
    const response = {
      success: true,
      data: {
        kpis: dashboardData.kpis,
        charts: dashboardData.charts,
        activity: dashboardData.activity,
        lastUpdated: new Date().toISOString(),
        vertical: vertical
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    ErrorLogger.logWindsurfError(
      'KPI API',
      'Failed to fetch KPIs',
      { error: error.message }
    );
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch KPIs',
        usingMockData: true
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, vertical } = body;
    
    if (action === 'refresh') {
      // Get Dataverse configuration
      const config = {
        tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID || '',
        clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
        clientSecret: process.env.AZURE_CLIENT_SECRET || '',
        resourceUrl: process.env.NEXT_PUBLIC_DATAVERSE_URL || '',
        apiVersion: '9.2',
        environment: process.env.NODE_ENV || 'development'
      };

      const kpiService = getKpiService(config);
      const dashboardData = await kpiService.refreshDashboardData(vertical || 'realEstate');
      
      const response = {
        success: true,
        data: {
          kpis: dashboardData.kpis,
          charts: dashboardData.charts,
          activity: dashboardData.activity,
          lastUpdated: new Date().toISOString(),
          vertical: vertical || 'realEstate'
        },
        refreshed: true
      };
      
      return NextResponse.json(response);
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error: any) {
    ErrorLogger.logWindsurfError(
      'KPI API POST',
      'Failed to process KPI request',
      { error: error.message }
    );
    
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
