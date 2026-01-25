import { useState, useEffect } from 'react';

interface AgentROIData {
  name: string;
  revenue: number;
  cost: number;
  deals: number;
  roi: number;
}

interface AgentROIResponse {
  agentData: AgentROIData[];
}

export const useAgentROI = () => {
  const [data, setData] = useState<AgentROIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAgentROI = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/agent-roi');
        
        if (!response.ok) {
          throw new Error(`Error fetching agent ROI data: ${response.status}`);
        }
        
        const roiData: AgentROIResponse = await response.json();
        setData(roiData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error fetching agent ROI data'));
        console.error('Error fetching agent ROI data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentROI();
  }, []);

  return { data, isLoading, error };
};
