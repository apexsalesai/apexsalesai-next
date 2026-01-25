'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const agentInsights = [
  {
    title: 'Sales Performance',
    metrics: [
      { label: 'Total Sales', value: '$1.5M', icon: <ChartBarIcon className="w-5 h-5" /> },
      { label: 'Conversion Rate', value: '45%', icon: <ArrowTrendingUpIcon className="w-5 h-5" /> },
      { label: 'Average Deal Size', value: '$25K', icon: <SparklesIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Customer Engagement',
    metrics: [
      { label: 'Engagement Rate', value: '97%', icon: <UserGroupIcon className="w-5 h-5" /> },
      { label: 'Response Time', value: '99.9%', icon: <SparklesIcon className="w-5 h-5" /> },
      { label: 'Customer Satisfaction', value: '98%', icon: <ArrowTrendingUpIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'AI Performance',
    metrics: [
      { label: 'Accuracy', value: '99.5%', icon: <ChartBarIcon className="w-5 h-5" /> },
      { label: 'Response Quality', value: '98%', icon: <SparklesIcon className="w-5 h-5" /> },
      { label: 'Context Understanding', value: '97%', icon: <ArrowTrendingUpIcon className="w-5 h-5" /> },
    ],
  },
];

export default function AIInsightsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Agent Insights</h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Deep dive into your AI agent's performance and impact
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {agentInsights.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1e29] rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">{section.title}</h3>
              <div className="space-y-4">
                {section.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {metric.icon}
                      <span className="text-gray-400">{metric.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#0ea5e9]">{metric.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1e29] rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Real-time Agent Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0d1321] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Active Conversations</h4>
                <div className="text-4xl font-bold text-[#0ea5e9]">45</div>
                <p className="text-gray-400">Current ongoing interactions</p>
              </div>
              <div className="bg-[#0d1321] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Pending Requests</h4>
                <div className="text-4xl font-bold text-[#0ea5e9]">12</div>
                <p className="text-gray-400">Waiting in queue</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
