import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { KPIBlock } from './KPIBlock';

import type { KPI } from '../lib/mockData';

const HRDashboard = () => {
  const kpis = [
    { title: 'Headcount Growth', value: '+6.1% YoY', trend: 'Upward', badgeColor: 'green' },
    { title: 'Turnover Rate', value: '8.4%', trend: '-1.2% YoY', badgeColor: 'red' },
    { title: 'Time to Fill', value: '28 days', trend: '-4 days YoY', badgeColor: 'cyan' },
    { title: 'Employee Satisfaction (eNPS)', value: '72', trend: '+8 YoY', badgeColor: 'teal' },
    { title: 'Diversity Ratio', value: '48%', trend: '+3% YoY', badgeColor: 'purple' },
  ];

  const hiringData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Time-to-Fill (days)',
        data: [32, 30, 29, 28, 28],
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
        label: 'Employee Satisfaction (eNPS)',
        data: [65, 68, 70, 71, 72],
        fill: true,
        backgroundColor: 'rgba(34,211,238,0.2)',
        borderColor: '#22d3ee',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4 text-center text-cyan-400">HR Intelligence</h1>
      <p className="text-center text-slate-400 mb-10">Max's AI-powered HR analytics dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-14">
        {kpis.map((kpi: KPI, i: number) => (
          <KPIBlock key={i} title={kpi.title} value={kpi.value} trend={kpi.trend} badgeColor={kpi.badgeColor} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Time-to-Fill Trend</h2>
          <Line data={hiringData} />
        </div>

        <div className="bg-slate-800/70 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Employee Satisfaction (eNPS)</h2>
          <Line data={satisfactionData} />
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 shadow-inner max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300"> Max's HR Activity</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>
              Onboarded 4 new hires this month
            </motion.div>
          </li>
          <li className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              Completed annual engagement survey
            </motion.div>
          </li>
          <li className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              Launched diversity & inclusion initiative
            </motion.div>
          </li>
        </ul>
        <p className="text-xs text-slate-500 mt-4">Last updated 30s ago by Max • AI Agent ID #001</p>
      </div>

      <div className="mt-12">
        <div className="bg-slate-900/80 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-cyan-300"> Workforce Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Attrition Risk</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">High Risk Employees</span>
                  <span className="text-red-300">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Medium Risk</span>
                  <span className="text-yellow-300">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Low Risk</span>
                  <span className="text-green-300">165</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Employee Satisfaction</h4>
              <div className="bg-slate-800 rounded-full h-2.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.5 }}
                  className="bg-green-400 h-2.5 rounded-full"
                />
              </div>
              <p className="text-slate-400 text-sm mt-2">92% employee satisfaction score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
