import { useState, useEffect } from 'react';

interface LeadStageData {
  stage: string;
  count: number;
  conversionRate: number;
  aiAssisted: boolean;
}

interface LeadTimelineData {
  date: string;
  newLeads: number;
  qualifiedLeads: number;
  opportunities: number;
  closedWon: number;
}

interface LeadLifecycleResponse {
  stageData: LeadStageData[];
  timelineData: LeadTimelineData[];
}

export const useLeadLifecycle = () => {
  const [data, setData] = useState<LeadLifecycleResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLeadLifecycle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/lead-lifecycle');
        
        if (!response.ok) {
          throw new Error(`Error fetching lead lifecycle data: ${response.status}`);
        }
        
        const lifecycleData: LeadLifecycleResponse = await response.json();
        setData(lifecycleData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching lead lifecycle data'));
        console.error('Error fetching lead lifecycle data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeadLifecycle();
  }, []);

  return { data, isLoading, error };
};
