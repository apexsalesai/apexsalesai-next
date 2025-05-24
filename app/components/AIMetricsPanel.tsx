import React from 'react';
import type { ApexOptions } from 'apexcharts';
import { motion } from 'framer-motion';
import ReactApexChart from 'react-apexcharts';

const AIMetricsPanel: React.FC = () => {
  const series = [45, 30, 15, 10];
  const options: ApexOptions = {
    chart: {
      type: 'donut',
      height: 300,
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    labels: ['Conversations Resolved', 'Escalations to Human', 'Errors/Fallbacks', 'Successful Handoffs'],
    colors: ['#0ea5e9', '#3b82f6', '#f43f5e', '#10b981'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Inter',
      labels: {
        colors: '#e2e8f0',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#e2e8f0'],
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1e29] rounded-2xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">AI Agent Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d1321] rounded-xl p-6">
          <ReactApexChart options={options} series={series} type="donut" height={300} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">Conversations Resolved</h4>
              <p className="text-gray-400">Automated by AI</p>
            </div>
            <div className="text-3xl font-bold text-[#0ea5e9]">45%</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">Escalations to Human</h4>
              <p className="text-gray-400">Complex cases</p>
            </div>
            <div className="text-3xl font-bold text-[#3b82f6]">30%</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">Errors/Fallbacks</h4>
              <p className="text-gray-400">System recoveries</p>
            </div>
            <div className="text-3xl font-bold text-[#f43f5e]">15%</div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white">Successful Handoffs</h4>
              <p className="text-gray-400">Smooth transitions</p>
            </div>
            <div className="text-3xl font-bold text-[#10b981]">10%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIMetricsPanel;
