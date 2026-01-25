import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SparklesIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const analyticsData = [
  {
    name: 'Lead Generation',
    AI: 7500,
    Human: 3000,
    percentage: 150,
  },
  {
    name: 'Qualification Rate',
    AI: 85,
    Human: 60,
    percentage: 142,
  },
  {
    name: 'Close Rate',
    AI: 45,
    Human: 30,
    percentage: 150,
  },
  {
    name: 'Customer Satisfaction',
    AI: 97,
    Human: 85,
    percentage: 114,
  },
];

export default function PremiumAnalyticsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1e29] rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Premium Analytics</h3>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-colors duration-200">
            <SparklesIcon className="w-5 h-5" />
            Premium Insights
          </button>
          <button className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors duration-200">
            <ChartBarIcon className="w-5 h-5" />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0d1321] rounded-xl p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#e2e8f0" />
              <YAxis stroke="#e2e8f0" />
              <Tooltip />
              <Legend />
              <Bar dataKey="AI" name="AI" fill="#0ea5e9" />
              <Bar dataKey="Human" name="Human" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          {analyticsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a101b] rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                  <p className="text-gray-400">AI vs Human Performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#0ea5e9] flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#0ea5e9]">{item.percentage}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
