import React from 'react';

interface DashboardChartProps {
  type: 'pipelineHealth' | 'agentImpact';
}

// Placeholder: In production, use Chart.js or D3.js for real charts
export const DashboardChart: React.FC<DashboardChartProps> = ({ type }) => (
  <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginTop: 16, background: '#fff', minHeight: 180 }}>
    <div style={{ fontWeight: 600, marginBottom: 8 }}>{type === 'pipelineHealth' ? 'Pipeline Health' : 'Agent Impact'} Chart</div>
    <div style={{ color: '#bbb', fontStyle: 'italic' }}>[Chart visualization coming soon]</div>
  </div>
);
