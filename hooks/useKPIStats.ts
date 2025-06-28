import { useState, useEffect } from 'react';
import type { KPIsResponse } from '../types/api';
import { mockKPIStats } from '../app/hooks/mockData';

export function useKPIStats() {
  const [data, setData] = useState<KPIsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function fetchKPIs() {
      try {
        setLoading(true);
        setUsingMockData(false);
        const res = await fetch('/api/kpis');
        
        if (!res.ok) {
          // Only in development, use mock data as fallback
          if (process.env.NODE_ENV === 'development') {
            console.warn('API endpoint not available, using mock data for development');
            setData(mockKPIStats as KPIsResponse);
            setUsingMockData(true);
            return;
          }
          throw new Error(`Error fetching KPI stats: ${res.status}`);
        }
        
        const json: KPIsResponse = await res.json();
        setData(json);
      } catch (err: any) {
        // Only in development, use mock data as fallback
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error fetching KPI stats, using mock data for development:', err);
          setData(mockKPIStats as KPIsResponse);
          setUsingMockData(true);
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error fetching KPI stats');
          console.error('Error fetching KPI stats:', err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, usingMockData };
}
