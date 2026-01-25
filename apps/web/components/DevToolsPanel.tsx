import React from 'react';
import type { AgentDecision } from '../types/agent';

interface DevToolsPanelProps {
  decision: AgentDecision | null;
}

export const DevToolsPanel: React.FC<DevToolsPanelProps> = ({ decision }) => (
  <div style={{ border: '1px dashed #aaa', borderRadius: 8, padding: 16, marginTop: 16, background: '#f5f5f5' }}>
    <div style={{ fontWeight: 600, marginBottom: 8 }}>Dev Tools Panel</div>
    {decision ? (
      <pre style={{ fontSize: 13, color: '#333', background: '#eee', padding: 8, borderRadius: 4 }}>{JSON.stringify(decision, null, 2)}</pre>
    ) : (
      <div style={{ color: '#bbb' }}>[No agent decision yet]</div>
    )}
  </div>
);
