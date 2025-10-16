'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, change, icon, trend = 'neutral' }: StatCardProps) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 194, 203, 0.2)' }}
      className="bg-gradient-to-br from-[#1a202c] to-[#2d3748] rounded-xl p-6 border border-[#00c2cb]/20 hover:border-[#00c2cb]/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        {change && (
          <div className={`text-sm font-semibold ${trendColors[trend]}`}>
            {trend === 'up' && '↑'} {trend === 'down' && '↓'} {change}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
    </motion.div>
  );
}

export default function StatsCards() {
  const stats = [
    {
      title: 'Blog Posts Published',
      value: '127',
      change: '+12 this week',
      icon: '📝',
      trend: 'up' as const
    },
    {
      title: 'Total Views',
      value: '24.5K',
      change: '+18% vs last month',
      icon: '👁️',
      trend: 'up' as const
    },
    {
      title: 'Leads Generated',
      value: '342',
      change: '+24 this week',
      icon: '🎯',
      trend: 'up' as const
    },
    {
      title: 'Engagement Rate',
      value: '4.2K',
      change: '68% avg time',
      icon: '⚡',
      trend: 'neutral' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
