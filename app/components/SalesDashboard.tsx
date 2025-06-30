'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useEffect } from 'react';
import { ChartGlowPlugin } from './ChartGlowPlugin';
import { AgentActivityFeed } from '../../components/dashboard/AgentActivityFeed';
import { demoAgentActions } from '../../lib/services/agent/demoAgentActions';

// Custom plugin to show value label on latest data point
const ValueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart: any) {
    const { ctx, data } = chart;
    (chart.data.datasets as any[]).forEach((dataset, i: number) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        const last = meta.data[meta.data.length - 1];
        if (last) {
          ctx.save();
          ctx.font = 'bold 13px sans-serif';
          ctx.fillStyle = dataset.borderColor || '#000';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          const value = dataset.data[dataset.data.length - 1];
          ctx.fillText(value + (typeof value === 'number' && dataset.label && dataset.label.includes('%') ? '%' : ''), last.x + 8, last.y);
          ctx.restore();
        }
      }
    });
  },
};

import { KPIBlock } from './KPIBlock';

import type { KPI } from '../lib/mockData';

const SalesDashboard = () => {
  useEffect(() => {
    // Register plugins once
    if (!(Chart as any)._glowRegistered) {
      Chart.register(ChartGlowPlugin as any);
      (Chart as any)._glowRegistered = true;
    }
    if (!(Chart as any)._valueLabelRegistered) {
      Chart.register(ValueLabelPlugin);
      (Chart as any)._valueLabelRegistered = true;
    }
    
    // Start demo agent actions for wow factor
    if (!demoAgentActions.isActive) {
      demoAgentActions.startDemo(4000); // Generate action every 4 seconds
    }
    
    return () => {
      // Cleanup on unmount
      demoAgentActions.stopDemo();
    };
  }, []);

  const kpis = [
    { title: 'Total Pipeline Value', value: '$7.8M', trend: '+18% QoQ', badgeColor: 'blue', tooltip: 'Sum of all open opportunities in the sales funnel.' },
    { title: 'Qualified Opportunities', value: '132', trend: '+12% MoM', badgeColor: 'green', tooltip: 'Deals that meet criteria for active pursuit.' },
    { title: 'Average Deal Size', value: '$52,800', trend: '+7.4% YoY', badgeColor: 'cyan', tooltip: 'Mean value of all closed deals.' },
    { title: 'Sales Velocity', value: '$2.5M/mo', trend: '+14% MoM', badgeColor: 'teal', tooltip: 'Revenue generated per month based on pipeline movement.' },
    { title: 'Lead-to-Customer Rate', value: '23%', trend: '+2.6% MoM', badgeColor: 'purple', tooltip: 'Percentage of leads converted to paying customers.' },
    { title: 'Marketing Sourced Revenue', value: '$2.1M', trend: '+25% QoQ', badgeColor: 'pink', tooltip: 'Revenue from marketing-generated leads.' },
  ];

  const pipelineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Pipeline Value ($M)',
        data: [4.8, 5.2, 5.9, 6.4, 7.2, 7.8],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9', // blue (colorblind-friendly)
        pointBackgroundColor: '#0EA5E9',
        tension: 0.4,
      },
      {
        label: 'Closed Won ($M)',
        data: [1.2, 1.5, 1.7, 2.1, 2.6, 3.0],
        fill: false,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34,211,238,0.1)',
        borderDash: [6, 6],
        tension: 0.4,
      },
    ],
  };


  const conversionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Lead Conversion Rate (%)',
        data: [16.2, 17.1, 18.4, 20.0, 21.5, 23.0],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
      {
        label: 'MQL to SQL (%)',
        data: [41, 43, 46, 48, 50, 53],
        fill: false,
        borderColor: '#f472b6', // pink (colorblind-friendly)
        borderDash: [4, 4],
        pointBackgroundColor: '#f472b6',
        backgroundColor: 'rgba(244,114,182,0.1)',
        tension: 0.4,
      },
    ],
  };


  const activity = [
    'Closed $450K multi-year deal with Acme Corp',
    'Generated 320 new MQLs from AI-driven campaigns',
    'Secured renewal with BigCo ($1.2M, 3-year contract)',
    'Hosted SaaS Summit 2025 with 2,400+ attendees',
    'Launched AI-powered lead scoring, boosting SQLs by 18%',
    'Achieved 98% forecast accuracy for Q2',
    'Marketing campaign: "AI for Revenue Teams" drove $800K pipeline',
    'Reduced sales cycle by 14 days using automation',
  ];

  return (
    <div className="panel shadow-lg radius-lg w-full max-w-7xl mx-auto">
      <h1 className="heading-xl text-center">Sales & Marketing Intelligence</h1>
      <p className="text-center text-slate-400 mb-10">Max's AI-powered sales performance dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
        {kpis.map((kpi, i) => (
          <div key={i} title={kpi.tooltip} className="relative">
            <KPIBlock title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
            <span className="sr-only">{kpi.tooltip}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="panel mb-6" style={{ height: 320 }}>
          <h2 className="heading-lg" title="Pipeline Growth: Tracks the value of all open opportunities and closed deals over time.">Pipeline Growth
            <span className="ml-1 text-xs text-slate-400 align-top" title="Pipeline Value: Total value of open opportunities. Closed Won: Value of deals won.">ⓘ</span>
          </h2>
          <div style={{ height: 240 }}>
            <Line
              data={pipelineData}
              options={(
                {
                  plugins: {
                    glow: { color: '#38bdf8', blur: 18 },
                    valueLabel: {},
                    legend: {
                      position: 'top',
                      labels: { color: '#e0f2fe', font: { weight: 'bold', size: 14 } },
                      display: true,
                    },
                    tooltip: {
                      backgroundColor: '#181f2f',
                      borderColor: '#38bdf8',
                      borderWidth: 1,
                      titleColor: '#38bdf8',
                      bodyColor: '#e0f2fe',
                      displayColors: false,
                      callbacks: {
                        label: (ctx: any) => `${ctx.dataset.label}: $${ctx.parsed.y}M`,
                        afterLabel: (ctx: any) => ctx.dataset.label === 'Closed Won ($M)' ? ' (deals won)' : '',
                      },
                    },
                  },
                  animation: {
                    duration: 1200,
                    easing: 'easeOutQuart',
                  },
                  elements: {
                    line: {
                      borderWidth: 4,
                    },
                    point: {
                      radius: 5,
                      hoverRadius: 8,
                      hoverBackgroundColor: '#e0f2fe',
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                }
              ) as any}
              height={240}
            />
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="font-bold">Insight:</span> Pipeline growth has outpaced closed won by <span className="text-cyan-300">35%</span> in the last 6 months, indicating strong future revenue potential.
          </div>
        </div>

        <div className="panel mb-6" style={{ height: 320 }}>
          <h2 className="heading-lg" title="Conversion Rate Trend: Shows how efficiently leads move through the funnel.">Conversion Rate Trend
            <span className="ml-1 text-xs text-slate-400 align-top" title="Lead Conversion Rate: % of leads becoming customers. MQL to SQL: % of marketing leads accepted by sales.">ⓘ</span>
          </h2>
          <div style={{ height: 240 }}>
            <Line
              data={conversionData}
              options={(
                {
                  plugins: {
                    glow: { color: '#22d3ee', blur: 18 },
                    valueLabel: {},
                    legend: {
                      position: 'top',
                      labels: { color: '#e0f2fe', font: { weight: 'bold', size: 14 } },
                      display: true,
                    },
                    tooltip: {
                      backgroundColor: '#181f2f',
                      borderColor: '#22d3ee',
                      borderWidth: 1,
                      titleColor: '#22d3ee',
                      bodyColor: '#e0f2fe',
                      displayColors: false,
                      callbacks: {
                        label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
                        afterLabel: (ctx: any) => ctx.dataset.label === 'MQL to SQL (%)' ? ' (marketing to sales handoff)' : '',
                      },
                    },
                  },
                  animation: {
                    duration: 1200,
                    easing: 'easeOutQuart',
                  },
                  elements: {
                    line: {
                      borderWidth: 4,
                    },
                    point: {
                      radius: 5,
                      hoverRadius: 8,
                      hoverBackgroundColor: '#e0f2fe',
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                }
              ) as any}
              height={240}
            />
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="font-bold">Insight:</span> Lead conversion rate and MQL-to-SQL handoff are both trending upward, reflecting tighter sales-marketing alignment and improved funnel efficiency.
          </div>
        </div>
      </div>

      {/* Real-time Agent Activity Feed - The WOW Factor */}
      <div className="max-w-5xl mx-auto">
        <AgentActivityFeed 
          maxEvents={25}
          showFilters={true}
          autoRefresh={true}
          className="shadow-lg"
        />
      </div>

      {/* Add interactive features */}
      <div className="mt-12">
        <div className="panel shadow-lg radius-lg">
          <h3 className="heading-lg">🎯 Lead Generation Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="heading-lg">Top Performing Channels</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">LinkedIn</span>
                  <span className="text-cyan-300">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Email Campaigns</span>
                  <span className="text-cyan-300">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Webinars</span>
                  <span className="text-cyan-300">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Referrals</span>
                  <span className="text-cyan-300">17%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Lead Quality Score</h4>
              <div className="bg-slate-800 rounded-full h-2.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5 }}
                  className="bg-cyan-400 h-2.5 rounded-full"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">85% of leads meet qualification criteria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
