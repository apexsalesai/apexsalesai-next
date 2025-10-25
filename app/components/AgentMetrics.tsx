'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, FileText, Share2, Mail, Clock, Zap } from 'lucide-react';

interface Metrics {
  totalBlogPosts: number;
  totalSocialPosts: number;
  totalEmails: number;
  avgResponseTime: number;
  successRate: number;
  activeToday: number;
}

export function AgentMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalBlogPosts: 0,
    totalSocialPosts: 0,
    totalEmails: 0,
    avgResponseTime: 0,
    successRate: 0,
    activeToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/metrics');
      // const data = await response.json();
      
      // Mock data for now
      const mockMetrics: Metrics = {
        totalBlogPosts: 24,
        totalSocialPosts: 156,
        totalEmails: 89,
        avgResponseTime: 12.5,
        successRate: 98.5,
        activeToday: 8
      };
      
      setMetrics(mockMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    }
  };

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    suffix = '', 
    trend 
  }: { 
    icon: any; 
    label: string; 
    value: number; 
    suffix?: string; 
    trend?: number;
  }) => (
    <div className="bg-[#0d1321] rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-[#00c2cb]/10 rounded-lg">
          <Icon className="w-4 h-4 text-[#00c2cb]" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {value}{suffix}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-[#1a202c] rounded-lg p-6 border border-gray-800">
        <h3 className="font-semibold text-white mb-4">Agent Performance</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c2cb]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a202c] rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white">Agent Performance</h3>
        <button 
          onClick={fetchMetrics}
          className="text-xs text-gray-400 hover:text-[#00c2cb] transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          icon={FileText}
          label="Blog Posts"
          value={metrics.totalBlogPosts}
          trend={12}
        />
        <MetricCard
          icon={Share2}
          label="Social Posts"
          value={metrics.totalSocialPosts}
          trend={8}
        />
        <MetricCard
          icon={Mail}
          label="Emails Sent"
          value={metrics.totalEmails}
          trend={15}
        />
        <MetricCard
          icon={Clock}
          label="Avg Response"
          value={metrics.avgResponseTime}
          suffix="s"
        />
        <MetricCard
          icon={Zap}
          label="Success Rate"
          value={metrics.successRate}
          suffix="%"
          trend={2}
        />
        <MetricCard
          icon={TrendingUp}
          label="Active Today"
          value={metrics.activeToday}
        />
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white">Activity Trend (7 Days)</h4>
          <select className="text-xs bg-[#0d1321] border border-gray-700 rounded px-2 py-1 text-gray-300">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        
        {/* Simple bar chart */}
        <div className="flex items-end justify-between gap-2 h-24">
          {[65, 78, 82, 90, 75, 88, 95].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-[#00c2cb] to-[#00a8b3] rounded-t transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
