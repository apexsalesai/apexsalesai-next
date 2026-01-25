import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';

import type { KPI } from '../lib/mockData';

const FinanceDashboard = () => {
  const kpis = [
    { title: 'Cash Runway', value: '18 months', trend: '+3 mo YoY', badgeColor: 'green' },
    { title: 'Burn Rate', value: '$220K/mo', trend: '-8% YoY', badgeColor: 'red' },
    { title: 'EBITDA', value: '$1.4M', trend: '+12% YoY', badgeColor: 'blue' },
    { title: 'Budget Variance', value: '+2.7%', trend: 'Within Target', badgeColor: 'cyan' },
    { title: 'Procurement Savings', value: '15%', trend: '+2% YoY', badgeColor: 'teal' },
  ];

  const varianceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Budget Variance (%)',
        data: [1.2, 2.1, 2.8, 2.4, 2.7],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.2)',
        borderColor: '#0EA5E9',
        tension: 0.4,
      },
    ],
  };

  const savingsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Procurement Savings (%)',
        data: [12, 13, 14, 15, 15],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4 text-center text-cyan-400">Finance & Procurement Intelligence</h1>
      <p className="text-center text-slate-400 mb-10">Max's AI-powered finance analytics dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
        {kpis.map((kpi: KPI, i: number) => (
          <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Budget Variance</h2>
          <Line data={varianceData} />
        </div>

        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Procurement Savings</h2>
          <Line data={savingsData} />
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 shadow-inner max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300"> Max's Finance Activity</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>
              Closed Q1 books 3 days ahead of schedule
            </motion.div>
          </li>
          <li className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              Detected and flagged 2 duplicate invoices
            </motion.div>
          </li>
          <li className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              Negotiated 8% savings on vendor contract
            </motion.div>
          </li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated 30s ago by Max • AI Agent ID #001</p>
      </div>

      <div className="mt-12">
        <div className="bg-slate-900/80 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300"> Financial Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Invoice Processing</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Processed Today</span>
                  <span className="text-cyan-300">150 invoices</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Average Time</span>
                  <span className="text-cyan-300">2h 15m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Success Rate</span>
                  <span className="text-cyan-300">99.9%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Procurement Savings</h4>
              <div className="bg-slate-800 rounded-full h-2.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5 }}
                  className="bg-green-400 h-2.5 rounded-full"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">15% cost savings through optimized procurement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
