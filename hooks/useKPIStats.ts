import { useState, useEffect, useCallback } from 'react';
import type { KPIsResponse } from '../types/api';
import { mockKPIStats } from '../app/hooks/mockData';
import { getKpiService } from '../lib/services/dataverse/kpiService';
import type { DashboardData } from '../lib/services/dataverse/types';

interface UseKPIStatsOptions {
  vertical?: string;
  refreshInterval?: number;
  useDataverse?: boolean;
}

export function useKPIStats(options: UseKPIStatsOptions = {}) {
  const {
    vertical = 'realEstate',
    refreshInterval = 30000, // 30 seconds default
    useDataverse = true
  } = options;

  const [data, setData] = useState<KPIsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [isDataverseConnected, setIsDataverseConnected] = useState(false);

  // Transform Dataverse data to match existing API response format
  const transformDataverseData = useCallback((dashboardData: DashboardData): KPIsResponse => {
    return {
      success: true,
      data: {
        kpis: dashboardData.kpis.map(kpi => ({
          title: kpi.title,
          value: kpi.value,
          trend: kpi.trend,
          badgeColor: kpi.badgeColor,
          tooltip: kpi.tooltip
        })),
        charts: dashboardData.charts,
        activity: dashboardData.activity || [],
        lastUpdated: new Date().toISOString(),
        vertical: vertical
      }
    };
  }, [vertical]);

  // Fetch KPIs from Dataverse
  const fetchDataverseKPIs = useCallback(async () => {
    try {
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
        throw new Error('Dataverse configuration missing');
      }

      const kpiService = getKpiService(config);
      
      // Test connection first
      const isConnected = await kpiService.testConnection();
      setIsDataverseConnected(isConnected);
      
      if (!isConnected) {
        throw new Error('Unable to connect to Dataverse');
      }
      
      // Fetch dashboard data
      const dashboardData = await kpiService.getDashboardData(vertical);
      const transformedData = transformDataverseData(dashboardData);
      
      setData(transformedData);
      setUsingMockData(false);
      setError(null);
    } catch (err: any) {
      console.warn('Dataverse KPI fetch failed, falling back to API/mock data:', err.message);
      throw err; // Re-throw to trigger fallback
    }
  }, [vertical, transformDataverseData]);

  // Fetch KPIs from API endpoint
  const fetchApiKPIs = useCallback(async () => {
    const res = await fetch(`/api/kpis?vertical=${vertical}`);
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    
    const json: KPIsResponse = await res.json();
    setData(json);
    setUsingMockData(false);
    setError(null);
  }, [vertical]);

  // Main fetch function with fallback logic
  const fetchKPIs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useDataverse) {
        // Try Dataverse first
        try {
          await fetchDataverseKPIs();
          return;
        } catch (dataverseError: any) {
          console.warn('Dataverse fetch failed, trying API fallback:', dataverseError.message);
          
          // Try API fallback
          try {
            await fetchApiKPIs();
            return;
          } catch (apiError: any) {
            console.warn('API fetch also failed, using mock data:', apiError.message);
          }
        }
      } else {
        // Use API endpoint directly
        try {
          await fetchApiKPIs();
          return;
        } catch (apiError: any) {
          console.warn('API fetch failed, using mock data:', apiError.message);
        }
      }
      
      // Final fallback to mock data
      console.warn('Using mock data as final fallback');
      setData(mockKPIStats as KPIsResponse);
      setUsingMockData(true);
      setError(null);
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching KPI stats';
      setError(errorMessage);
      console.error('Error in fetchKPIs:', err);
      
      // Even on error, provide mock data in development
      if (process.env.NODE_ENV === 'development') {
        setData(mockKPIStats as KPIsResponse);
        setUsingMockData(true);
      }
    } finally {
      setLoading(false);
    }
  }, [useDataverse, fetchDataverseKPIs, fetchApiKPIs]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchKPIs();
  }, [fetchKPIs]);

  // Effect to fetch data and set up polling
  useEffect(() => {
    fetchKPIs();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchKPIs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchKPIs, refreshInterval]);

  return { 
    data, 
    loading, 
    error, 
    usingMockData, 
    isDataverseConnected,
    refresh,
    vertical 
  };
}
