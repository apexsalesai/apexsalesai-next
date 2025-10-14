import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';
import PipelineForecastWidget from './PipelineForecastWidget';
import AgentROITracker from './AgentROITracker';
import LeadLifecycleVisualization from './LeadLifecycleVisualization';
import ApexVsHumanComparison from './ApexVsHumanComparison';
import { useKPIStats } from '../hooks/useKPIStats';
// Import the hook from the app/hooks directory
import { useAgentEvents } from '../hooks/useAgentEvents';
import { useAgentROI } from '../hooks/useAgentROI';
import { useLeadLifecycle } from '../hooks/useLeadLifecycle';
import { useApexVsHuman } from '../hooks/useApexVsHuman';
import { Box, Flex, Text, Spinner, Badge, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import type { FeedEvent } from '../../types/agent';

const ExecutiveDashboard = () => {
  // State for active persona tab
  const [activePersona, setActivePersona] = useState<number>(0);
  
  // Fetch live KPI data from the API
  const { data: kpiData, isLoading: kpiLoading } = useKPIStats();
  
  // Fetch live agent events from the API
  const { data: feedData, isLoading: feedLoading } = useAgentEvents();

  // Fetch live agent ROI data from the API
  const { data: agentROIData, isLoading: agentROILoading } = useAgentROI();

  // Fetch live lead lifecycle data from the API
  const { data: leadLifecycleData, isLoading: leadLifecycleLoading } = useLeadLifecycle();

  // Fetch live Apex vs Human data from the API
  const { data: apexVsHumanData, isLoading: apexVsHumanLoading } = useApexVsHuman();

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format percentage values
  const formatPercent = (value: number) => {
    return `${value}%`;
  };
  
  // Format decimal values
  const formatDecimal = (value: number) => {
    return value.toFixed(1);
  };

  // Traditional KPIs
  const traditionalKpis = [
    { title: 'Revenue Growth Rate', value: '+18.2% YoY', trend: 'Accelerating', badgeColor: 'green' },
    { title: 'Gross Margin', value: '67.5%', trend: '+2.1% YoY', badgeColor: 'blue' },
    { title: 'Customer Acquisition Cost (CAC)', value: '$1,120', trend: '-5.4% MoM', badgeColor: 'cyan' },
    { title: 'Customer Lifetime Value (LTV)', value: '$19,800', trend: '+8.7% YoY', badgeColor: 'teal' },
    { title: 'Net Revenue Retention (NRR)', value: '127%', trend: '+6% YoY', badgeColor: 'purple' },
  ];

  // Define persona-based KPI views
  const personaKpis = kpiData ? {
    // Real Estate Agent KPIs
    realEstate: [
      { 
        title: 'Leads Captured', 
        value: `${kpiData.dashboard_kpis?.leads_captured || 42}`, 
        trend: 'Past 30 days', 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Response Time', 
        value: `${kpiData.dashboard_kpis?.response_time_seconds || 30}s`, 
        trend: 'Avg. lead response', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'Showings Booked', 
        value: `${kpiData.dashboard_kpis?.showings_booked || 28}`, 
        trend: 'Auto-scheduled', 
        badgeColor: 'purple',
        highlight: true
      },
      { 
        title: 'Deals Closed', 
        value: `${kpiData.dashboard_kpis?.closed_deals || 8}`, 
        trend: 'Past 30 days', 
        badgeColor: 'teal'
      },
      { 
        title: 'Time Saved', 
        value: `${kpiData.dashboard_kpis?.time_saved_hours || 24}h`, 
        trend: 'Admin work', 
        badgeColor: 'cyan'
      },
    ],
    
    // Mortgage Broker KPIs
    mortgage: [
      { 
        title: 'Apps Completed', 
        value: `${kpiData.dashboard_kpis?.applications_completed || 31}`, 
        trend: 'Past 30 days', 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Doc Follow-ups', 
        value: `${kpiData.dashboard_kpis?.doc_followups || 86}`, 
        trend: 'Auto-sent', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'Closing Rate', 
        value: `${kpiData.dashboard_kpis?.closing_rate || 68}%`, 
        trend: '+12% with AI', 
        badgeColor: 'purple',
        highlight: true
      },
      { 
        title: 'Avg Loan Value', 
        value: formatCurrency(kpiData.dashboard_kpis?.avg_loan_value || 380000), 
        trend: 'Past 30 days', 
        badgeColor: 'teal'
      },
      { 
        title: 'Compliance Flags', 
        value: `${kpiData.dashboard_kpis?.compliance_flags || 7}`, 
        trend: 'Issues prevented', 
        badgeColor: 'red'
      },
    ],
    
    // Executive/C-Suite KPIs
    executive: [
      { 
        title: 'AI-Driven Revenue', 
        value: formatCurrency(kpiData.dashboard_kpis?.ai_driven_revenue || 0), 
        trend: `${kpiData.dashboard_kpis?.closed_deals} deals closed`, 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Sales Cycle Reduction', 
        value: `${kpiData.dashboard_kpis?.sales_cycle_reduction}%`, 
        trend: 'Time to close', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'Operational Cost Savings', 
        value: formatCurrency(kpiData.dashboard_kpis?.cost_savings || 0), 
        trend: 'Automation efficiency', 
        badgeColor: 'cyan',
        highlight: true
      },
      { 
        title: 'AI Investment ROI', 
        value: `${kpiData.dashboard_kpis?.roi_percentage}%`, 
        trend: 'Return on investment', 
        badgeColor: 'teal',
        highlight: true
      },
      { 
        title: 'Conversion Rate Lift', 
        value: `+${kpiData.dashboard_kpis?.conversion_lift}%`, 
        trend: 'vs. industry average', 
        badgeColor: 'purple',
        highlight: true
      },
    ],
    
    // Sales Leadership KPIs
    sales: [
      { 
        title: 'Win Rate with AI', 
        value: `${kpiData.dashboard_kpis?.win_rate}%`, 
        trend: 'vs. 41% industry avg', 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Forecast Accuracy', 
        value: `${kpiData.dashboard_kpis?.forecast_accuracy}%`, 
        trend: 'AI-powered predictions', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'Deal Size Increase', 
        value: `+${kpiData.dashboard_kpis?.deal_size_increase}%`, 
        trend: 'With AI assistance', 
        badgeColor: 'teal',
        highlight: true
      },
      { 
        title: 'Closed Deals', 
        value: `${kpiData.dashboard_kpis?.closed_deals}`, 
        trend: 'This quarter', 
        badgeColor: 'purple'
      },
      { 
        title: 'Meetings Booked', 
        value: `${kpiData.dashboard_kpis?.meetings_booked}`, 
        trend: 'By AI agent', 
        badgeColor: 'cyan'
      },
    ],
    
    // Marketing Leadership KPIs
    marketing: [
      { 
        title: 'Lead Quality Score', 
        value: formatDecimal(kpiData.dashboard_kpis?.lead_quality_score || 0), 
        trend: 'Out of 10', 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Campaign Optimization', 
        value: `+${kpiData.dashboard_kpis?.campaign_optimization}%`, 
        trend: 'Performance lift', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'Conversion Rate Lift', 
        value: `+${kpiData.dashboard_kpis?.conversion_lift}%`, 
        trend: 'With AI targeting', 
        badgeColor: 'purple',
        highlight: true
      },
      { 
        title: 'Leads Rescued', 
        value: `${kpiData.dashboard_kpis?.leads_rescued}`, 
        trend: 'By AI intervention', 
        badgeColor: 'orange'
      },
      { 
        title: 'Leads Per Dollar', 
        value: formatDecimal(kpiData.dashboard_kpis?.leads_per_dollar || 0), 
        trend: 'Marketing efficiency', 
        badgeColor: 'cyan'
      },
    ],
    
    // Customer Success KPIs
    customerSuccess: [
      { 
        title: 'Churn Reduction', 
        value: `${kpiData.dashboard_kpis?.churn_reduction}%`, 
        trend: 'Year over year', 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Expansion Revenue', 
        value: formatCurrency(kpiData.dashboard_kpis?.expansion_revenue || 0), 
        trend: 'AI-driven upsells', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'CSAT Improvement', 
        value: `+${kpiData.dashboard_kpis?.csat_improvement}%`, 
        trend: 'With AI support', 
        badgeColor: 'purple',
        highlight: true
      },
      { 
        title: 'Pipeline At Risk', 
        value: `${kpiData.dashboard_kpis?.pipeline_at_risk}`, 
        trend: 'Flagged by AI', 
        badgeColor: 'red'
      },
      { 
        title: 'Time Saved (hrs/wk)', 
        value: `${kpiData.dashboard_kpis?.time_saved_hours}`, 
        trend: 'Per CS agent', 
        badgeColor: 'cyan'
      },
    ],
    
    // Small Business KPIs
    smb: [
      { 
        title: 'Time Saved (hrs/wk)', 
        value: `${kpiData.dashboard_kpis?.time_saved_hours}`, 
        trend: 'Per employee', 
        badgeColor: 'green',
        highlight: true
      },
      { 
        title: 'Leads Per Dollar', 
        value: formatDecimal(kpiData.dashboard_kpis?.leads_per_dollar || 0), 
        trend: 'Marketing efficiency', 
        badgeColor: 'blue',
        highlight: true
      },
      { 
        title: 'Deal Size Increase', 
        value: `+${kpiData.dashboard_kpis?.deal_size_increase}%`, 
        trend: 'With AI assistance', 
        badgeColor: 'purple',
        highlight: true
      },
      { 
        title: 'Operational Cost Savings', 
        value: formatCurrency(kpiData.dashboard_kpis?.cost_savings || 0), 
        trend: 'Automation efficiency', 
        badgeColor: 'cyan',
        highlight: true
      },
      { 
        title: 'AI Investment ROI', 
        value: `${kpiData.dashboard_kpis?.roi_percentage}%`, 
        trend: 'Return on investment', 
        badgeColor: 'teal',
        highlight: true
      },
    ]
  } : {
    executive: [],
    sales: [],
    marketing: [],
    customerSuccess: [],
    smb: []
  };
  
  // For backward compatibility
  const highImpactKpis = kpiData ? personaKpis.executive : [];

  const roiData = {
    labels: ['AI Gains', 'Cost of AI'],
    datasets: [
      {
        data: kpiData ? [kpiData.dashboard_kpis?.roi_percentage, 100] : [368, 100],
        backgroundColor: ['#22d3ee', '#94A3B8'],
        hoverOffset: 6,
      },
    ],
  };

  const productivityTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Hours Saved',
        data: [320, 580, 760, 980, 1240],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="text-white w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Left: KPIs and Charts */}
        <div className="flex-1 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-1">Executive Intelligence – Powered by ApexSalesAI</h1>
          <p className="text-slate-400 mb-2">Live performance of autonomous AI agents across key business functions</p>
          {/* High-Impact KPIs Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 shadow-md mb-3"
          >
            <h2 className="text-xl font-bold text-cyan-300 mb-2">🚀 AI Business Impact Metrics</h2>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Business Impact</h2>
              <Tabs variant="soft-rounded" colorScheme="cyan" onChange={(index) => setActivePersona(index)} mb={4}>
                <TabList className="mb-4 flex flex-wrap gap-2">
                  <Tab className="bg-slate-800/50 text-cyan-300 _hover:bg-slate-700/80 rounded-full px-4 py-2">
                    Real Estate
                  </Tab>
                  <Tab className="bg-slate-800/50 text-cyan-300 _hover:bg-slate-700/80 rounded-full px-4 py-2">
                    Mortgage
                  </Tab>
                  <Tab className="bg-slate-800/50 text-cyan-300 _hover:bg-slate-700/80 rounded-full px-4 py-2">
                    Executive
                  </Tab>
                  <Tab className="bg-slate-800/50 text-cyan-300 _hover:bg-slate-700/80 rounded-full px-4 py-2">
                    Sales
                  </Tab>
                  <Tab className="bg-slate-800/50 text-cyan-300 _hover:bg-slate-700/80 rounded-full px-4 py-2">
                    Marketing
                  </Tab>
                  <Tab>Pipeline AI</Tab>
                  <Tab>Performance</Tab>
                </TabList>
                <TabPanels>
                  {/* Real Estate Agent KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.realEstate?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Mortgage KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.mortgage?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Executive KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.executive?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Sales KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.sales?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Marketing KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.marketing?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Customer Success KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.customerSuccess?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Small Business KPIs */}
                  <TabPanel padding={0}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {personaKpis?.smb?.map((kpi, index) => (
                        <KPIBlock
                          key={index}
                          title={kpi.title}
                          value={kpi.value}
                          trend={kpi.trend}
                          badgeColor={kpi.badgeColor}
                          highlight={kpi.highlight}
                        />
                      ))}
                    </div>
                  </TabPanel>
                  {/* Pipeline AI Tab */}
                  <TabPanel padding={0}>
                    <PipelineForecastWidget />
                  </TabPanel>
                  {/* New Performance Tab with Premium Visualizations */}
                  <TabPanel padding={0}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>AI Performance Analytics</Text>
                    
                    {/* Agent ROI Tracker */}
                    <Box mb={6}>
                      <AgentROITracker 
                        agentData={agentROIData?.agentData || []} 
                        isLoading={agentROILoading} 
                      />
                    </Box>
                    
                    {/* Lead Lifecycle Visualization */}
                    <Box mb={6}>
                      <LeadLifecycleVisualization 
                        stageData={leadLifecycleData?.stageData || []} 
                        timelineData={leadLifecycleData?.timelineData || []} 
                        isLoading={leadLifecycleLoading} 
                      />
                    </Box>
                    
                    {/* Apex vs Human Comparison */}
                    <Box mb={6}>
                      <ApexVsHumanComparison 
                        performanceMetrics={apexVsHumanData?.performanceMetrics || []} 
                        timeSavings={apexVsHumanData?.timeSavings || []} 
                        actionDistribution={apexVsHumanData?.actionDistribution || []} 
                        isLoading={apexVsHumanLoading} 
                      />
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </motion.div>
          {/* Traditional KPIs and Pipeline Forecast */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch mb-2">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <PipelineForecastWidget />
            </motion.div>
            <div className="flex-1 grid grid-cols-2 xl:grid-cols-3 gap-2">
              {traditionalKpis.map((kpi, i) => (
                <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mt-1">
            <div className="flex-1 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 shadow-md">
              <h2 className="text-lg font-bold text-cyan-200 mb-1">AI ROI Breakdown</h2>
              <Pie data={roiData} />
            </div>
            <div className="flex-1 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 shadow-md">
              <h2 className="text-lg font-bold text-cyan-200 mb-1">Productivity Gains Over Time</h2>
              <Line data={productivityTrend} />
            </div>
          </div>
        </div>
        {/* Right: Activity Feed */}
        <div className="w-full md:w-96 bg-slate-900/90 rounded-2xl border border-slate-700 p-3 shadow-xl flex flex-col">
          <h3 className="text-2xl font-extrabold text-cyan-300 mb-2">🔁 Max Activity Feed</h3>
          {feedLoading ? (
            <div className="flex justify-center py-8">
              <Spinner color="cyan.400" size="lg" />
            </div>
          ) : (
            <ul className="space-y-1 text-base text-slate-200 mb-2">
              {feedData?.feed_events.map((event: FeedEvent, i: number) => (
                <li key={i} className="bg-slate-800/60 p-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
                  <Badge colorScheme={event.type === 'Revenue' ? 'green' : 
                                      event.type === 'Lead' ? 'blue' : 
                                      event.type === 'Action' ? 'purple' : 
                                      event.type === 'Alert' ? 'red' : 
                                      event.type === 'Support' ? 'orange' : 'gray'} 
                         mr={2}>
                    {event.type}
                  </Badge>
                  {event.text}
                  <Text fontSize="xs" color="gray.500" mt={1}>{event.time}</Text>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-slate-500">Last updated just now by Max • AI Agent ID #001</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
