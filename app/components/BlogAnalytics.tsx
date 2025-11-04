'use client';

import { useEffect, useState } from 'react';
import { Eye, TrendingUp, Users, Clock, ThumbsUp } from 'lucide-react';

interface BlogAnalytics {
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  engagementRate: number;
  topPosts: { title: string; views: number; slug: string }[];
}

export function BlogAnalytics() {
  const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/analytics?range=${timeRange}`);
      // const data = await response.json();
      
      // Mock data
      const mockData: BlogAnalytics = {
        views: 12547,
        uniqueVisitors: 8932,
        avgTimeOnPage: 245,
        engagementRate: 68.5,
        topPosts: [
          { title: 'AI Agents Transform Revenue Operations', views: 2341, slug: 'ai-agents-revenue' },
          { title: 'Predictive Analytics for Sales Leaders', views: 1876, slug: 'predictive-analytics' },
          { title: 'Automation Best Practices', views: 1654, slug: 'automation-best-practices' }
        ]
      };
      
      setAnalytics(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !analytics) {
    return (
      <div className="bg-[#1a202c] rounded-lg p-6 border border-gray-800">
        <h3 className="font-semibold text-white mb-4">Blog Analytics</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c2cb]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a202c] rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white">Blog Analytics</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="text-xs bg-[#0d1321] border border-gray-700 rounded px-3 py-1.5 text-gray-300"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0d1321] rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-[#00c2cb]" />
            <span className="text-xs text-gray-400">Total Views</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.views.toLocaleString()}</div>
        </div>

        <div className="bg-[#0d1321] rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#00c2cb]" />
            <span className="text-xs text-gray-400">Unique Visitors</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.uniqueVisitors.toLocaleString()}</div>
        </div>

        <div className="bg-[#0d1321] rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#00c2cb]" />
            <span className="text-xs text-gray-400">Avg Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatTime(analytics.avgTimeOnPage)}</div>
        </div>

        <div className="bg-[#0d1321] rounded-lg p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="w-4 h-4 text-[#00c2cb]" />
            <span className="text-xs text-gray-400">Engagement</span>
          </div>
          <div className="text-2xl font-bold text-white">{analytics.engagementRate}%</div>
        </div>
      </div>

      {/* Top Posts */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Top Performing Posts</h4>
        <div className="space-y-2">
          {analytics.topPosts.map((post, index) => (
            <div
              key={post.slug}
              className="flex items-center justify-between p-3 bg-[#0d1321] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00c2cb]/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#00c2cb]">{index + 1}</span>
                </div>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-sm text-white hover:text-[#00c2cb] transition-colors truncate"
                >
                  {post.title}
                </a>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Eye className="w-3 h-3" />
                <span className="text-xs">{post.views.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
