import { useState } from 'react';
import type { TriggerAgentRequest, TriggerAgentResponse } from '../types/api';
import { mockAgentData } from '../app/hooks/mockData';

export function useLangGraphAgent() {
  const [data, setData] = useState<TriggerAgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const triggerAgent = async (lead: TriggerAgentRequest['lead']) => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    
    try {
      const res = await fetch('/api/trigger-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead }),
      });
      
      if (!res.ok) {
        // Only in development, use mock data as fallback
        if (process.env.NODE_ENV === 'development') {
          console.warn('API endpoint not available, using mock data for development');
          setData(mockAgentData as unknown as TriggerAgentResponse);
          setUsingMockData(true);
          setLoading(false);
          return;
        }
        throw new Error('Failed to trigger agent');
      }
      
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      // Only in development, use mock data as fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error triggering agent, using mock data for development:', err);
        setData(mockAgentData as unknown as TriggerAgentResponse);
        setUsingMockData(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, triggerAgent, usingMockData };
}
