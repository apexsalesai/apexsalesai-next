import { useState, useEffect } from 'react';
import type { FeedEventsResponse } from '../types/api';

export function useAgentEvents() {
  const [data, setData] = useState<FeedEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/feed-events');
        if (!res.ok) throw new Error('Failed to fetch agent events');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
}
