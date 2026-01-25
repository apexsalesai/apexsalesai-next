import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Revenue per Hour',
    AI: 1200, Human: 400,
  },
  {
    name: 'Cost per Meeting',
    AI: 25, Human: 150,
  },
  {
    name: 'Cost per Sale',
    AI: 150, Human: 1200,
  },
];

const ROIAnalysisPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1e29] rounded-2xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">Production ROI Analysis</h3>
      <div className="space-y-6">
        <div className="bg-[#0d1321] rounded-xl p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d1321] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-2">Revenue per Hour</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">AI</span>
              <span className="text-[#0ea5e9]">$1,200</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Human</span>
              <span className="text-[#3b82f6]">$400</span>
            </div>
          </div>
          <div className="bg-[#0d1321] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-2">Cost per Meeting</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">AI</span>
              <span className="text-[#0ea5e9]">$25</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Human</span>
              <span className="text-[#3b82f6]">$150</span>
            </div>
          </div>
          <div className="bg-[#0d1321] rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-2">Cost per Sale</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">AI</span>
              <span className="text-[#0ea5e9]">$150</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Human</span>
              <span className="text-[#3b82f6]">$1,200</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ROIAnalysisPanel;
