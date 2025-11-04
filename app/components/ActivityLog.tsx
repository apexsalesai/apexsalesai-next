'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle, XCircle, Clock, Zap, FileText, Share2 } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'blog_generated' | 'social_generated' | 'email_sent' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent activities
    fetchActivities();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/activities');
      // const data = await response.json();
      
      // Mock data for now
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'blog_generated',
          title: 'Blog Post Generated',
          description: 'AI Agents Transform Revenue Operations',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          status: 'success'
        },
        {
          id: '2',
          type: 'social_generated',
          title: 'Social Posts Created',
          description: 'LinkedIn + Twitter posts for AI automation',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          status: 'success'
        },
        {
          id: '3',
          type: 'email_sent',
          title: 'Newsletter Sent',
          description: 'Welcome email to new subscriber',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'success'
        }
      ];
      
      setActivities(mockActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'blog_generated':
        return <FileText className="w-4 h-4" />;
      case 'social_generated':
        return <Share2 className="w-4 h-4" />;
      case 'email_sent':
        return <Zap className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-[#1a202c] rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-[#00c2cb]" />
          <h3 className="font-semibold text-white">Activity Log</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c2cb]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a202c] rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00c2cb]" />
          <h3 className="font-semibold text-white">Activity Log</h3>
        </div>
        <button 
          onClick={fetchActivities}
          className="text-xs text-gray-400 hover:text-[#00c2cb] transition-colors"
        >
          Refresh
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 bg-[#0d1321] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">
                  {activity.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-800">
        <a
          href="/dashboard/activity"
          className="text-xs text-[#00c2cb] hover:underline"
        >
          View all activity →
        </a>
      </div>
    </div>
  );
}
