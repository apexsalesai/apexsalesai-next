import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';

import type { KPI } from '../lib/mockData';

const OpsDashboard = () => {
  const kpis = [
    { title: 'On-Time Delivery', value: '98.2%', trend: '+1.1% MoM', badgeColor: 'green' },
    { title: 'Order Accuracy', value: '99.5%', trend: '+0.4% MoM', badgeColor: 'blue' },
    { title: 'Inventory Turnover', value: '7.2', trend: '+0.3 YoY', badgeColor: 'cyan' },
    { title: 'Fulfillment Cost', value: '$12.7K', trend: '-3.2% MoM', badgeColor: 'teal' },
    { title: 'Downtime', value: '1.4h', trend: '-0.5h MoM', badgeColor: 'purple' },
  ];

  const deliveryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'On-Time Delivery (%)',
        data: [96.8, 97.2, 97.9, 98.0, 98.2],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  const accuracyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Order Accuracy (%)',
        data: [98.8, 99.0, 99.3, 99.4, 99.5],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  const activity = [
    'Reduced downtime by 0.5h MoM',
    'Improved inventory turnover',
    'Achieved 99.5% order accuracy',
    'Optimized fulfillment costs',
    'Completed logistics software upgrade',
  ];

  // Uptime Chart (replace operations.charts.uptime)
  const uptimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Uptime (%)',
        data: [99.1, 99.3, 99.5, 99.7, 99.8],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  // Downtime Chart (replace operations.charts.downtime)
  const downtimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Downtime (hrs)',
        data: [2.2, 2.0, 1.8, 1.6, 1.4],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  const automationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Automation Rate',
        data: [80, 85, 90, 92, 95],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4 text-center text-cyan-400">Ops & IT Intelligence</h1>
      <p className="text-center text-slate-400 mb-10">Max's AI-powered operations dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
        {kpis.map((kpi: KPI, i: number) => (
          <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">On-Time Delivery</h2>
          <Line data={deliveryData} />
        </div>

        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Order Accuracy</h2>
          <Line data={accuracyData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Uptime</h2>
          <Line data={uptimeData} />
        </div>

        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Downtime</h2>
          <Line data={downtimeData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Automation Rate</h2>
          <Line data={automationData} />
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 shadow-inner max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">🔄 Max's Operations Activity</h3>
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

      <div className="mt-12">
        <div className="bg-slate-900/80 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">📊 System Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Latency Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Average Latency</span>
                  <span className="text-cyan-300">15ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">95th Percentile</span>
                  <span className="text-cyan-300">25ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Max Latency</span>
                  <span className="text-cyan-300">45ms</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Anomaly Detection</h4>
              <div className="bg-slate-800 rounded-full h-2.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '98%' }}
                  transition={{ duration: 1.5 }}
                  className="bg-green-400 h-2.5 rounded-full"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">98% of anomalies detected & resolved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpsDashboard;
