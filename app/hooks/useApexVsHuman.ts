import { useState, useEffect } from 'react';

interface PerformanceMetric {
  category: string;
  apexScore: number;
  humanScore: number;
  improvement: number;
}

interface TimeSavings {
  activity: string;
  humanMinutes: number;
  apexMinutes: number;
  savingsPercentage: number;
}

interface ActionDistribution {
  category: string;
  apexCount: number;
  humanCount: number;
}

interface ApexVsHumanResponse {
  performanceMetrics: PerformanceMetric[];
  timeSavings: TimeSavings[];
  actionDistribution: ActionDistribution[];
}

export const useApexVsHuman = () => {
  const [data, setData] = useState<ApexVsHumanResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/apex-vs-human');
        
        if (!response.ok) {
          throw new Error(`Error fetching comparison data: ${response.status}`);
        }
        
        const comparisonData: ApexVsHumanResponse = await response.json();
        setData(comparisonData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching comparison data'));
        console.error('Error fetching Apex vs. human comparison data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, []);

  return { data, isLoading, error };
};
