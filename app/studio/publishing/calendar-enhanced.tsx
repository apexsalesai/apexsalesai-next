'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { 
  Calendar, 
  List, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface PublishJob {
  id: string;
  platform: string;
  status: string;
  scheduledAt: string | null;
  postedAt: string | null;
  postUrl: string | null;
  errorMessage: string | null;
  assetId: string;
  createdAt: string;
}

interface PlatformStatus {
  platform: string;
  connected: boolean;
  label: string;
  icon: string;
}

const platformIcons: Record<string, string> = {
  linkedin: '💼',
  x: '𝕏',
  instagram: '📸',
  wordpress: '📝',
  youtube: '🎥',
  tiktok: '🎵',
  reddit: '🤖',
  pinterest: '📌',
  facebook: '👥',
};

export default function PublishingCalendarEnhanced() {
  const [jobs, setJobs] = useState<PublishJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Platform connection status
  const platforms: PlatformStatus[] = [
    { platform: 'linkedin', connected: false, label: 'LinkedIn', icon: '💼' },
    { platform: 'x', connected: false, label: 'X (Twitter)', icon: '𝕏' },
    { platform: 'instagram', connected: false, label: 'Instagram', icon: '📸' },
    { platform: 'wordpress', connected: true, label: 'WordPress', icon: '📝' },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await fetch('/api/studio/publish', {
        headers: {
          'x-user-id': 'demo-user',
        },
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calendar helpers
  const getWeekDays = () => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getJobsForDay = (day: Date) => {
    return jobs.filter(job => {
      if (!job.scheduledAt) return false;
      return isSameDay(parseISO(job.scheduledAt), day);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'posting':
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'failed':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'posting':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'queued':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="relative z-10 p-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link 
              href="/studio" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Studio
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Publishing Calendar
                </h1>
                <p className="text-slate-400 text-lg">Schedule and manage posts across all platforms</p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('list')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    view === 'list'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-800/50 backdrop-blur-xl text-slate-400 hover:bg-slate-800/80 border border-slate-700/50'
                  }`}
                >
                  <List className="w-5 h-5" />
                  List
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('calendar')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    view === 'calendar'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-800/50 backdrop-blur-xl text-slate-400 hover:bg-slate-800/80 border border-slate-700/50'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  Calendar
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Platform Connection Status */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Connected Platforms
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((p, idx) => (
                  <motion.div
                    key={p.platform}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      p.connected
                        ? 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 shadow-lg shadow-green-500/20'
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{p.icon}</span>
                      {p.connected ? (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-400 text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          CONNECTED
                        </motion.span>
                      ) : (
                        <span className="text-slate-500 text-xs font-bold">NOT CONNECTED</span>
                      )}
                    </div>
                    <div className="font-semibold mb-2">{p.label}</div>
                    {!p.connected && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-cyan-500/30"
                      >
                        Connect
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowScheduleModal(true)}
              className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl hover:border-cyan-500/50 transition-all shadow-xl hover:shadow-cyan-500/20"
            >
              <div className="text-5xl mb-3">📅</div>
              <h3 className="font-bold text-xl mb-1">Schedule Post</h3>
              <p className="text-sm text-slate-400">Pick asset, platform, and time</p>
            </motion.button>

            <Link href="/studio/create">
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl hover:border-purple-500/50 transition-all shadow-xl hover:shadow-purple-500/20 h-full"
              >
                <div className="text-5xl mb-3">✨</div>
                <h3 className="font-bold text-xl mb-1">Generate Content</h3>
                <p className="text-sm text-slate-400">Create new content with AI</p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Calendar/List View */}
          <motion.div variants={itemVariants}>
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {view === 'calendar' ? <Calendar className="w-6 h-6 text-cyan-400" /> : <List className="w-6 h-6 text-cyan-400" />}
                  {view === 'calendar' ? 'Week View' : 'Publishing Jobs'}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: refreshing ? 360 : 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchJobs(true)}
                  disabled={refreshing}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800/80 rounded-xl font-semibold transition-all flex items-center gap-2 border border-slate-700/50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading publishing jobs...</p>
                  </motion.div>
                ) : view === 'calendar' ? (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800/80 rounded-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <h3 className="text-lg font-semibold">
                        {format(getWeekDays()[0], 'MMM d')} - {format(getWeekDays()[6], 'MMM d, yyyy')}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800/80 rounded-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {getWeekDays().map((day, idx) => {
                        const dayJobs = getJobsForDay(day);
                        const isToday = isSameDay(day, new Date());
                        
                        return (
                          <motion.div
                            key={day.toISOString()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-4 rounded-xl border-2 min-h-[200px] ${
                              isToday
                                ? 'border-cyan-500/50 bg-cyan-500/5'
                                : 'border-slate-700/30 bg-slate-800/20'
                            }`}
                          >
                            <div className="text-center mb-3">
                              <div className="text-xs text-slate-500 font-semibold uppercase">
                                {format(day, 'EEE')}
                              </div>
                              <div className={`text-2xl font-bold ${isToday ? 'text-cyan-400' : ''}`}>
                                {format(day, 'd')}
                              </div>
                            </div>

                            <div className="space-y-2">
                              {dayJobs.map((job) => (
                                <motion.div
                                  key={job.id}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  whileHover={{ scale: 1.05 }}
                                  className={`p-2 rounded-lg bg-gradient-to-br ${getStatusColor(job.status)} border cursor-pointer`}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">{platformIcons[job.platform]}</span>
                                    {getStatusIcon(job.status)}
                                  </div>
                                  <div className="text-xs text-slate-300 capitalize">
                                    {job.platform}
                                  </div>
                                  {job.scheduledAt && (
                                    <div className="text-xs text-slate-500 mt-1">
                                      {format(parseISO(job.scheduledAt), 'h:mm a')}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : jobs.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-16"
                  >
                    <div className="text-7xl mb-4">📭</div>
                    <p className="text-slate-400 mb-6 text-lg">No publishing jobs yet</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowScheduleModal(true)}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30"
                    >
                      Schedule Your First Post
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left py-4 px-4 font-semibold text-slate-400">Platform</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-400">Status</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-400">Scheduled</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-400">Posted</th>
                          <th className="text-left py-4 px-4 font-semibold text-slate-400">Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job, idx) => (
                          <motion.tr
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-all"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{platformIcons[job.platform]}</span>
                                <span className="font-semibold capitalize">{job.platform}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(job.status)}
                                <span className="text-sm font-medium capitalize">{job.status}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                              {job.scheduledAt
                                ? format(parseISO(job.scheduledAt), 'MMM d, h:mm a')
                                : 'Immediate'}
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                              {job.postedAt
                                ? format(parseISO(job.postedAt), 'MMM d, h:mm a')
                                : '-'}
                            </td>
                            <td className="py-4 px-4">
                              {job.postUrl ? (
                                <a
                                  href={job.postUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                                >
                                  View Post
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              ) : job.errorMessage ? (
                                <span className="text-red-400 text-sm">{job.errorMessage}</span>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Schedule Post
              </h2>
              <p className="text-slate-400 mb-6">
                Schedule modal coming soon! For now, use the API directly or generate content first.
              </p>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-800/50 hover:bg-slate-800/80 rounded-xl font-semibold transition-all border border-slate-700/50"
                >
                  Close
                </motion.button>
                <Link href="/studio/create" className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold text-center transition-all shadow-lg shadow-cyan-500/30"
                  >
                    Generate Content First
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
