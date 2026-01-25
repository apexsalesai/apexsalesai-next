import React from 'react';
import type { FeedEvent } from '../types/agent';

interface LiveFeedPanelProps {
  feedEvents: FeedEvent[];
}

export const LiveFeedPanel: React.FC<LiveFeedPanelProps> = ({ feedEvents }) => (
  <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginTop: 16, background: '#fff', maxHeight: 220, overflowY: 'auto' }}>
    <div style={{ fontWeight: 600, marginBottom: 8 }}>Live Feed</div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {feedEvents.map((event, idx) => (
        <li key={idx} style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 500 }}>{event.type}:</span> {event.text} <span style={{ color: '#888', fontSize: 12 }}>({event.time})</span>
        </li>
      ))}
    </ul>
  </div>
);
