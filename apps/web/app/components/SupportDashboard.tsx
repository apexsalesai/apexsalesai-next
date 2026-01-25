import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';

import type { KPI } from '../lib/mockData';

const SupportDashboard = () => {
  const kpis = [
    { title: 'Tickets Closed', value: '1,230', trend: '+9% MoM', badgeColor: 'green' },
    { title: 'Avg. Response Time', value: '2m 18s', trend: '-12% MoM', badgeColor: 'blue' },
    { title: 'Customer Satisfaction', value: '94%', trend: '+3% MoM', badgeColor: 'cyan' },
    { title: 'Escalation Rate', value: '2.1%', trend: '-0.7% MoM', badgeColor: 'teal' },
    { title: 'Resolution SLA', value: '99.2%', trend: '+0.6% MoM', badgeColor: 'purple' },
  ];

  const ticketsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Tickets Closed',
        data: [890, 970, 1100, 1200, 1230],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  const satisfactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Customer Satisfaction',
        data: [90, 91, 92, 93, 94],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  const activity = [
    'Resolved critical outage for major client',
    'Achieved 99.2% SLA compliance',
    'Launched new support knowledge base',
    'Handled 250+ live chats this week',
    'Completed Q2 support training',
  ];

  // Response Time Chart
  const responseTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Avg. Response Time (min)',
        data: [2.9, 2.7, 2.5, 2.3, 2.18],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4 text-center text-cyan-400">Customer Support Intelligence</h1>
      <p className="text-center text-slate-400 mb-10">Max's AI-powered support performance dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
        {kpis.map((kpi, i) => (
          <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Response Time Trend</h2>
          <Line data={responseTimeData} options={{ plugins: { legend: { display: false } } }} />
        </div>

        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Customer Satisfaction</h2>
          <Bar data={satisfactionData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 shadow-inner max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">🔄 Max's Support Activity</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {activity.map((entry: string, i: number) => (
            <li key={i} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {entry}
              </motion.div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated 30s ago by Max • AI Agent ID #001</p>
      </div>

      {/* Add interactive features */}
      <div className="mt-12">
        <div className="bg-slate-900/80 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">🔍 Support Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Ticket Volume by Priority</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Critical</span>
                  <span className="text-red-300">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">High</span>
                  <span className="text-yellow-300">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Medium</span>
                  <span className="text-blue-300">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Low</span>
                  <span className="text-green-300">60</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">SLA Compliance</h4>
              <div className="bg-slate-800 rounded-full h-2.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.5 }}
                  className="bg-green-400 h-2.5 rounded-full"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">92% of tickets resolved within SLA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
