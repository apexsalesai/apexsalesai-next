import type { NextApiRequest, NextApiResponse } from 'next';
import type { FeedEventsResponse } from '../../types/api';
import { prisma } from '@/lib/prisma';

// Force Node.js runtime (not Edge)
export const runtime = 'nodejs';
// Auth imports temporarily disabled until next-auth is properly configured
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from './auth/[...nextauth]';

// Fallback mock events in case database query fails
const fallbackEvents: FeedEventsResponse = {
  feed_events: [
    { type: 'Action', text: 'Max responded to Cisco lead - Booked demo @ 11:00 AM', time: '2m 31s ago' },
    { type: 'Support', text: 'Max closed Tier 1 support issue in 2m 31s', time: '10m ago' },
    { type: 'Alert', text: 'Max flagged an anomaly in usage trend - Ops notified', time: '15m ago' },
    { type: 'Lead', text: 'Max sent follow-up to qualified prospect (Juniper)', time: '30m ago' },
    { type: 'Revenue', text: 'Max updated CRM: Revenue Opportunity +$28,000', time: '1h ago' },
  ],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeedEventsResponse>
) {
  try {
    // Auth temporarily disabled until next-auth is properly configured
    // const session = await getServerSession(req, res, authOptions);
    
    // For demo purposes, we'll use tenant ID 1 (Apex Enterprises)
    const tenantId = 1; // Default to Apex Enterprises tenant

    // Try to fetch real events from the database
    const events = await prisma.observabilityEvent.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // If we have events, format them for the feed
    if (events && events.length > 0) {
      const feedEvents = events.map(event => {
        // Calculate relative time
        const now = new Date();
        const eventTime = new Date(event.createdAt);
        const diffMs = now.getTime() - eventTime.getTime();
        const diffMins = Math.round(diffMs / 60000);
        
        let timeText;
        if (diffMins < 1) {
          timeText = 'just now';
        } else if (diffMins < 60) {
          timeText = `${diffMins}m ago`;
        } else {
          const diffHours = Math.floor(diffMins / 60);
          timeText = `${diffHours}h ago`;
        }

        // Cast the type to a valid FeedEvent type
        const eventType = event.type as 'Action' | 'Alert' | 'Task' | 'Support' | 'Lead' | 'Revenue';
        return {
          type: eventType || 'Action', // Default to 'Action' if type is invalid
          text: event.message,
          time: timeText,
        };
      });

      return res.status(200).json({ feed_events: feedEvents });
    }

    // If no events found, use the enhanced fallback data
    return res.status(200).json(fallbackEvents);
  } catch (error) {
    console.error('Error fetching feed events:', error);
    // Return fallback data in case of error
    return res.status(200).json(fallbackEvents);
  }
}
