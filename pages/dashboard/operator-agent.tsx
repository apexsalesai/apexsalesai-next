import React, { useState, useEffect } from 'react';
import { KPIWidget } from '../../components/KPIWidget';
import { AgentControlPanel } from '../../components/AgentControlPanel';
import { LiveFeedPanel } from '../../components/LiveFeedPanel';
import { DashboardChart } from '../../components/DashboardChart';
import { DevToolsPanel } from '../../components/DevToolsPanel';
import { AgentROIPanel } from '../../app/components/AgentROIPanel';
import { AccountabilityPanel } from '../../app/components/AccountabilityPanel';
import { useKPIStats } from '../../hooks/useKPIStats';
import { useAgentEvents } from '../../app/hooks/useAgentEvents';
import { useLangGraphAgent } from '../../hooks/useLangGraphAgent';

// Agent Summary Panel Component - Displays key performance metrics
const AgentSummaryPanel = () => {
  const { data: kpis } = useKPIStats();
  const { data: agentData } = useLangGraphAgent();
  const { data: agentEvents } = useAgentEvents();
  
  // Calculate metrics from available data
  // For now, we'll use the KPI data since the agent response doesn't have metrics yet
  // In a real implementation, these would come from the sequence engine's ROI calculations
  const timeSaved = 690; // Placeholder: 11.5 hours in minutes
  const timeSavedHours = (timeSaved / 60).toFixed(1);
  
  const revenueImpact = kpis?.dashboard_kpis?.ai_driven_revenue || 27800;
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(revenueImpact);
  
  const tasksHandled = agentEvents?.feed_events?.length || 0;
  const dealsRescued = kpis?.dashboard_kpis?.leads_rescued || 0;
  
  return (
    <div style={{ 
      backgroundColor: '#f8fafc', 
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Agent Performance Summary</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', color: '#4a5568' }}>
            <strong>Time saved:</strong> {timeSavedHours} human hours
          </p>
          <p style={{ fontSize: '14px', color: '#4a5568' }}>
            <strong>Revenue impact:</strong> {formattedRevenue} potential revenue
          </p>
        </div>
        <div>
          <p style={{ fontSize: '14px', color: '#4a5568' }}>
            <strong>Tasks handled:</strong> {tasksHandled} automated actions
          </p>
          <p style={{ fontSize: '14px', color: '#4a5568' }}>
            <strong>Deal rescue:</strong> {dealsRescued} opportunities re-engaged
          </p>
        </div>
      </div>
    </div>
  );
};

const OperatorAgentDashboard: React.FC = () => {
  // Add error states and use try/catch for data fetching
  const [error, setError] = useState<string | null>(null);
  
  // Use safer data fetching with fallbacks
  const { data: kpis, loading: kpisLoading } = useKPIStats() || { data: null, loading: false };
  const { data: feed, isLoading: feedLoading } = useAgentEvents() || { data: { feed_events: [] }, isLoading: false };
  const { data: agentData, loading: agentLoading, triggerAgent } = useLangGraphAgent() || { 
    data: null, 
    loading: false, 
    triggerAgent: () => console.log('Agent trigger fallback') 
  };

  const [autonomous, setAutonomous] = useState(true);
  const [vertical, setVertical] = useState('SaaS');
  
  // Add error boundary effect
  useEffect(() => {
    console.log('Dashboard mounted');
    console.log('KPIs:', kpis);
    console.log('Feed:', feed);
    console.log('Agent data:', agentData);
    
    return () => {
      console.log('Dashboard unmounted');
    };
  }, [kpis, feed, agentData]);

  // Add error handling for the render method
  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '100px auto', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#e53e3e' }}>Dashboard Error</h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Reload Dashboard
        </button>
      </div>
    );
  }

  // Show loading state
  if (kpisLoading || feedLoading || agentLoading) {
    return (
      <div style={{ maxWidth: 800, margin: '100px auto', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Loading Dashboard...</h1>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #e2e8f0', 
          borderTopColor: '#3182ce', 
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  try {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Apex AI Revenue Operator</h1>
      
        {/* Level 3++ Agent Status Banner */}
        <div style={{ 
          backgroundColor: '#ebf8ff', 
          padding: '12px 16px', 
          borderRadius: 8, 
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Autonomous Mode: {autonomous ? 'Active' : 'Manual'}</h3>
            <p style={{ fontSize: 14, color: '#4a5568', margin: 0 }}>AI agent is {autonomous ? 'proactively engaging leads' : 'waiting for manual triggers'}</p>
          </div>
          <div style={{ 
            backgroundColor: autonomous ? '#48bb78' : '#a0aec0', 
            width: 12, 
            height: 12, 
            borderRadius: '50%' 
          }} />
        </div>
        
        {/* KPI Row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <KPIWidget label="Meetings Booked" value={kpis?.meetings_booked ?? 0} trend={12} />
          <KPIWidget label="Emails Sent" value={kpis?.emails_sent ?? 0} trend={-3} />
          <KPIWidget label="Replies Received" value={kpis?.replies_received ?? 0} trend={8} />
          <KPIWidget label="Deals Closed" value={kpis?.deals_closed ?? 0} trend={2} />
          <KPIWidget label="Revenue Generated" value={`$${(kpis?.revenue_generated ?? 0).toLocaleString()}`} trend={15} format="currency" />
        </div>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Left Column - 2/3 width */}
          <div style={{ flex: 2 }}>
            {/* Agent ROI Panel */}
            <AgentROIPanel />
            
            {/* Agent Control Panel */}
            <AgentControlPanel
              autonomous={autonomous}
              onToggleAutonomous={() => setAutonomous(a => !a)}
              vertical={vertical}
              onVerticalChange={setVertical}
              onTrigger={() => triggerAgent({
                id: 1,
                name: 'Jane Smith',
                email: 'jane@leadsource.com',
                industry: vertical,
                stage: 'Qualified',
                confidence_score: 0.91
              })}
            />
          </div>
          
          {/* Right Column - 1/3 width */}
          <div style={{ flex: 1 }}>
            {/* Accountability Panel */}
            <AccountabilityPanel />
          </div>
        </div>
        
        {/* Bottom Section */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 2 }}>
            <LiveFeedPanel feedEvents={feed?.feed_events ?? []} />
            <DashboardChart type="pipelineHealth" />
          </div>
          <div style={{ flex: 1 }}>
            <DashboardChart type="agentImpact" />
            <DevToolsPanel decision={agentData?.decision ?? null} />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    // Log the error and show error UI
    console.error('Dashboard render error:', err);
    setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    
    // Return a simple error message
    return (
      <div style={{ maxWidth: 800, margin: '100px auto', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#e53e3e' }}>Dashboard Error</h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>
          {err instanceof Error ? err.message : 'An unexpected error occurred rendering the dashboard'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Reload Dashboard
        </button>
      </div>
    );
  }
};

export default OperatorAgentDashboard;
