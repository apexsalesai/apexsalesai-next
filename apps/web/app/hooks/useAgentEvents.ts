import { useState, useEffect } from 'react';
import type { FeedEventsResponse } from '../../types/api';
import { mockFeedEvents } from './mockData';

export const useAgentEvents = () => {
  const [data, setData] = useState<FeedEventsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setUsingMockData(false);
        const response = await fetch('/api/feed-events');
        
        if (!response.ok) {
          // Only in development, use mock data as fallback
          if (process.env.NODE_ENV === 'development') {
            console.warn('API endpoint not available, using mock data for development');
            setData(mockFeedEvents as FeedEventsResponse);
            setUsingMockData(true);
            return;
          }
          throw new Error(`Error fetching feed events: ${response.status}`);
        }
        
        const eventsData: FeedEventsResponse = await response.json();
        setData(eventsData);
      } catch (err) {
        // Only in development, use mock data as fallback
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error fetching feed events, using mock data for development:', err);
          setData(mockFeedEvents as FeedEventsResponse);
          setUsingMockData(true);
        } else {
          setError(err instanceof Error ? err : new Error('Unknown error fetching feed events'));
          console.error('Error fetching agent events:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { data, isLoading, error, usingMockData };
};
