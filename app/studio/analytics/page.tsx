'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Eye,
  MousePointer,
  Share2,
  Heart,
  ArrowLeft,
  Sparkles,
  Calendar,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

interface KPIData {
  engagement: number;
  reach: number;
  conversions: number;
  followers: number;
}

interface TrendData {
  date: string;
  engagement: number;
  reach: number;
  conversions: number;
}

interface PlatformData {
  platform: string;
  value: number;
  icon: string;
  color: string;
}

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      onUpdate: (latest) => setDisplayValue(Math.round(latest))
    });
    return controls.stop;
  }, [value, duration, count]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPIData>({
    engagement: 12847,
    reach: 45623,
    conversions: 342,
    followers: 8934,
  });

  const [trendData, setTrendData] = useState<TrendData[]>([
    { date: 'Jan 1', engagement: 4200, reach: 12000, conversions: 85 },
    { date: 'Jan 8', engagement: 5100, reach: 15000, conversions: 102 },
    { date: 'Jan 15', engagement: 6800, reach: 18500, conversions: 128 },
    { date: 'Jan 22', engagement: 8200, reach: 22000, conversions: 156 },
    { date: 'Jan 29', engagement: 9500, reach: 28000, conversions: 189 },
    { date: 'Feb 5', engagement: 11200, reach: 35000, conversions: 234 },
    { date: 'Feb 12', engagement: 12847, reach: 45623, conversions: 342 },
  ]);

  const [platformData, setPlatformData] = useState<PlatformData[]>([
    { platform: 'LinkedIn', value: 42, icon: '💼', color: '#0077B5' },
    { platform: 'X (Twitter)', value: 28, icon: '𝕏', color: '#1DA1F2' },
    { platform: 'Instagram', value: 18, icon: '📸', color: '#E4405F' },
    { platform: 'WordPress', value: 12, icon: '📝', color: '#21759B' },
  ]);

  const [aiInsights, setAiInsights] = useState<string[]>([
    '🚀 Engagement up 45% this week - your content is resonating!',
    '💡 Best posting time: Tuesday 10am - 35% higher engagement',
    '📈 LinkedIn posts driving 3x more conversions than other platforms',
    '🎯 Career-focused content generating 2.5x more saves',
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  const kpiCards = [
    {
      title: 'Total Engagement',
      value: kpis.engagement,
      change: '+45%',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/30',
    },
    {
      title: 'Total Reach',
      value: kpis.reach,
      change: '+32%',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
    },
    {
      title: 'Conversions',
      value: kpis.conversions,
      change: '+28%',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      title: 'New Followers',
      value: kpis.followers,
      change: '+18%',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Activity className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-slate-400 text-lg">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background */}
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
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-slate-400 text-lg">Track performance across all platforms</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Last 7 Days
              </motion.button>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <motion.div variants={itemVariants} className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, idx) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`relative overflow-hidden bg-gradient-to-br ${kpi.bgColor} border ${kpi.borderColor} rounded-2xl p-6 shadow-xl`}
              >
                {/* Animated background gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${kpi.color} rounded-xl shadow-lg`}>
                      <kpi.icon className="w-6 h-6 text-white" />
                    </div>
                    <motion.span
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      className="text-green-400 text-sm font-bold flex items-center gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      {kpi.change}
                    </motion.span>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    <AnimatedCounter value={kpi.value} duration={2 + idx * 0.2} />
                  </div>
                  <div className="text-sm text-slate-400">{kpi.title}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trends Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                    Performance Trends
                  </h2>
                  <div className="flex gap-2">
                    {['Engagement', 'Reach', 'Conversions'].map((metric) => (
                      <motion.button
                        key={metric}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-slate-800/50 hover:bg-slate-800/80 rounded-lg text-xs font-semibold transition-all border border-slate-700/50"
                      >
                        {metric}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      fill="url(#colorEngagement)" 
                      animationDuration={2000}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reach" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      fill="url(#colorReach)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Platform Breakdown */}
            <motion.div variants={itemVariants}>
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl h-full">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-purple-400" />
                  Platform Breakdown
                </h2>

                <div className="space-y-4">
                  {platformData.map((platform, idx) => (
                    <motion.div
                      key={platform.platform}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{platform.icon}</span>
                          <span className="font-semibold">{platform.platform}</span>
                        </div>
                        <span className="text-lg font-bold">{platform.value}%</span>
                      </div>
                      <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${platform.value}%` }}
                          transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${platform.color}80, ${platform.color})`,
                            boxShadow: `0 0 20px ${platform.color}40`
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/50">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          padding: '8px 12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Insights Panel */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </motion.div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI-Powered Insights
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiInsights.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="p-4 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-xl"
                  >
                    <p className="text-sm leading-relaxed">{insight}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-6 text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2 mx-auto"
                >
                  <Zap className="w-5 h-5" />
                  Generate More Insights
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
