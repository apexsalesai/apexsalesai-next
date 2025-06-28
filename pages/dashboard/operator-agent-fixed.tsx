import React, { useState, useEffect } from 'react';
import { KPIWidget } from '@components/KPIWidget';
import { AgentControlPanel } from '@components/AgentControlPanel';
import { LiveFeedPanel } from '@components/LiveFeedPanel';
import { AgentROIPanel } from '@components/AgentROIPanel';
import { AccountabilityPanel } from '@components/AccountabilityPanel';
import { DevToolsPanel } from '@components/DevToolsPanel';
import { DashboardChart } from '@components/DashboardChart';

// Mock hooks for fetching data
const useKPIStats = () => {
  return {
    data: {
      meetings_booked: 42,
      emails_sent: 156,
      replies_received: 28,
      deals_closed: 8,
      revenue_generated: 125000
    },
    loading: false
  };
};

const useAgentEvents = () => {
  return {
    data: {
      feed_events: [
        {
          type: 'Action' as const,
          text: 'Follow-up email sent to Jane Smith',
          time: '2023-10-15T14:30:00Z'
        },
        {
          type: 'Task' as const,
          text: 'Demo meeting scheduled with Acme Corp',
          time: '2023-10-15T15:45:00Z'
        },
        {
          type: 'Lead' as const,
          text: 'TechSolutions Inc. qualified as Enterprise lead',
          time: '2023-10-15T16:20:00Z'
        },
        {
          type: 'Revenue' as const,
          text: 'Deal closed with Acme Corp - $24,500',
          time: '2023-10-15T17:10:00Z'
        },
        {
          type: 'Alert' as const,
          text: 'Lead response time exceeded threshold',
          time: '2023-10-15T18:05:00Z'
        }
      ]
    },
    isLoading: false
  };
};

const useLangGraphAgent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    decision: {
      lead_id: 123,
      action: 'send_email' as const,
      priority: 'high' as const,
      confidence: 0.89,
      reason: 'Lead has shown interest but hasn\'t responded to initial outreach'
    }
  });
  const [error, setError] = useState<string | null>(null);

  const triggerAgent = async (lead: any) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Agent triggered with lead:', lead);
      
      // Call the agent trigger API
      const response = await fetch('/api/trigger-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lead })
      });

      if (!response.ok) {
        throw new Error(`Agent trigger failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Agent trigger result:', result);
      
      // Update the agent decision data
      setData({
        decision: {
          lead_id: lead.id,
          action: result.action || 'send_email',
          priority: result.priority || 'medium',
          confidence: result.confidence || 0.75,
          reason: result.reason || 'Based on lead engagement patterns'
        }
      });

      // If the agent decided to update the CRM, call our CRM write-back endpoint
      if (result.action === 'update_crm' || result.should_update_crm) {
        const crmResponse = await fetch(`/api/test-crm-writeback?leadId=${lead.id}`, {
          method: 'GET'
        });
        
        if (!crmResponse.ok) {
          console.warn('CRM write-back warning:', crmResponse.status, crmResponse.statusText);
        } else {
          const crmResult = await crmResponse.json();
          console.log('CRM write-back result:', crmResult);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error triggering agent';
      console.error('Error triggering agent:', errorMessage);
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    triggerAgent
  };
};

const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by error boundary:', event.error);
      setHasError(true);
      setErrorMessage(event.error?.message || 'An unexpected error occurred');
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{ maxWidth: 800, margin: '100px auto', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#e53e3e' }}>Dashboard Error</h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>{errorMessage}</p>
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

  return <>{children}</>;
};

const OperatorAgentDashboard: React.FC = () => {
  // Add error states
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
};

// Export the dashboard wrapped in the error boundary
export default function SafeDashboard() {
  return (
    <ErrorBoundary>
      <OperatorAgentDashboard />
    </ErrorBoundary>
  );
}
