import React from 'react';

interface AgentControlPanelProps {
  autonomous: boolean;
  onToggleAutonomous: () => void;
  vertical: string;
  onVerticalChange: (v: string) => void;
  onTrigger: () => void;
}

const verticalOptions = ['SaaS', 'Real Estate', 'MSP'];

export const AgentControlPanel: React.FC<AgentControlPanelProps> = ({ autonomous, onToggleAutonomous, vertical, onVerticalChange, onTrigger }) => (
  <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, background: '#f9f9f9', marginTop: 16 }}>
    <label>
      <input type="checkbox" checked={autonomous} onChange={onToggleAutonomous} /> Autonomous Mode
    </label>
    <select value={vertical} onChange={e => onVerticalChange(e.target.value)} style={{ margin: '0 16px' }}>
      {verticalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <button onClick={onTrigger} style={{ padding: '4px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>Trigger Agent Now</button>
  </div>
);
