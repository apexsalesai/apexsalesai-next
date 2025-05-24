import React from 'react';
import { motion } from 'framer-motion';
import { Pie, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';

const ExecutiveDashboard = () => {
  const kpis = [
    { title: 'Revenue Growth Rate', value: '+18.2% YoY', trend: 'Accelerating', badgeColor: 'green' },
    { title: 'Gross Margin', value: '67.5%', trend: '+2.1% YoY', badgeColor: 'blue' },
    { title: 'Customer Acquisition Cost (CAC)', value: '$1,120', trend: '-5.4% MoM', badgeColor: 'cyan' },
    { title: 'Customer Lifetime Value (LTV)', value: '$19,800', trend: '+8.7% YoY', badgeColor: 'teal' },
    { title: 'Net Revenue Retention (NRR)', value: '127%', trend: '+6% YoY', badgeColor: 'purple' },
  ];

  const roiData = {
    labels: ['AI Gains', 'Cost of AI'],
    datasets: [
      {
        data: [368, 100],
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

  const liveFeed = [
    'Max responded to Cisco lead – Booked demo @ 11:00 AM',
    'Max closed Tier 1 support issue in 2m 31s',
    'Max flagged an anomaly in usage trend – Ops notified',
    'Max sent follow-up to qualified prospect (Juniper)',
    'Max updated CRM: Revenue Opportunity +$28,000',
  ];

  return (
    <div className="text-white w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Left: KPIs and Charts */}
        <div className="flex-1 flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-cyan-400 mb-1">Executive Intelligence – Powered by ApexSalesAI</h1>
          <p className="text-slate-400 mb-2">Live performance of autonomous AI agents across key business functions</p>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
            {kpis.map((kpi, i) => (
              <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
            ))}
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
          <ul className="space-y-1 text-base text-slate-200 mb-2">
            {liveFeed.map((entry, i) => (
              <li key={i} className="bg-slate-800/60 p-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
                {entry}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">Last updated 30s ago by Max • AI Agent ID #001</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
