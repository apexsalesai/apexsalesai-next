import { useState, useEffect } from 'react';
import type { KPIsResponse } from '../../types/api';

export const useKPIStats = () => {
  const [data, setData] = useState<KPIsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/kpis');
        
        if (!response.ok) {
          throw new Error(`Error fetching KPIs: ${response.status}`);
        }
        
        const kpiData: KPIsResponse = await response.json();
        setData(kpiData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching KPIs'));
        console.error('Error fetching KPI stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  return { data, isLoading, error };
};
