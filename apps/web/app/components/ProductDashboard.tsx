import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';

import type { KPI } from '../lib/mockData';

const ProductDashboard = () => {
  const kpis = [
    { title: 'Active Users', value: '12,340', trend: '+8% MoM', badgeColor: 'green' },
    { title: 'Feature Adoption', value: '67%', trend: '+5% MoM', badgeColor: 'blue' },
    { title: 'Bug Resolution Rate', value: '98.6%', trend: '+1.2% MoM', badgeColor: 'cyan' },
    { title: 'Release Frequency', value: '2/week', trend: 'Stable', badgeColor: 'teal' },
    { title: 'NPS', value: '76', trend: '+4 YoY', badgeColor: 'purple' },
  ];

  const usersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Active Users',
        data: [9500, 10400, 11200, 12000, 12340],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  const adoptionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Feature Adoption (%)',
        data: [55, 58, 61, 65, 67],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  const activity = [
    'Launched new analytics dashboard',
    'Resolved 45 customer bug reports',
    'Released v2.3.1 update',
    'Improved onboarding flow',
    'Completed quarterly NPS survey',
  ];

  // Accuracy Chart (replace product.charts.accuracy)
  const accuracyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Model Accuracy (%)',
        data: [91, 92, 93, 94, 95],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4 text-center text-cyan-400">Product & R&D Intelligence</h1>
      <p className="text-center text-slate-400 mb-10">Max's AI-powered product analytics dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
        {kpis.map((kpi: KPI, i: number) => (
          <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">AI Accuracy</h2>
          <Line data={accuracyData} />
        </div>

        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Innovation Rate</h2>
          <Bar data={adoptionData} options={{ plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 shadow-inner max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">🔄 Max's Product Activity</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {activity.map((entry: string, i: number) => (
            <li key={i} className="text-slate-400 text-sm mb-2">
              {entry}
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated 30s ago by Max • AI Agent ID #001</p>
      </div>

      <div className="mt-12">
        <div className="bg-slate-900/80 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300">📊 Product Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Feature Adoption</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Active Features</span>
                  <span className="text-cyan-300">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Feature Requests</span>
                  <span className="text-cyan-300">125</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Bug Rate</span>
                  <span className="text-cyan-300">0.8%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Code Quality</h4>
              <div className="bg-slate-800 rounded-full h-2.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '95%' }}
                  transition={{ duration: 1.5 }}
                  className="bg-green-400 h-2.5 rounded-full"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">95% code quality score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
