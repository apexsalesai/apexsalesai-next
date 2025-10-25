'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Shield,
  Key,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Zap
} from 'lucide-react';

interface Connection {
  platform: string;
  label: string;
  icon: string;
  connected: boolean;
  status: 'connected' | 'expired' | 'error' | 'disconnected';
  lastSync?: string;
  expiresAt?: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function ConnectionsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      icon: '💼',
      connected: false,
      status: 'disconnected',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
    },
    {
      platform: 'x',
      label: 'X (Twitter)',
      icon: '𝕏',
      connected: false,
      status: 'disconnected',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
    },
    {
      platform: 'instagram',
      label: 'Instagram',
      icon: '📸',
      connected: false,
      status: 'disconnected',
      color: 'from-pink-500 to-purple-500',
      bgColor: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-500/30',
    },
    {
      platform: 'wordpress',
      label: 'WordPress',
      icon: '📝',
      connected: true,
      status: 'connected',
      lastSync: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'from-blue-600/20 to-cyan-600/20',
      borderColor: 'border-blue-600/30',
    },
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleConnect = async (platform: string) => {
    try {
      console.log(`🔗 Initiating OAuth for ${platform}`);
      // Redirect to OAuth authorization endpoint
      window.location.href = `/api/oauth/${platform}/authorize`;
    } catch (error) {
      console.error(`❌ Failed to connect ${platform}:`, error);
      alert(`Failed to connect to ${platform}. Please try again.`);
    }
  };

  const handleDisconnect = async (platform: string) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.platform === platform
          ? { ...conn, connected: false, status: 'disconnected', lastSync: undefined, expiresAt: undefined }
          : conn
      )
    );
  };

  const handleRefresh = async (platform: string) => {
    setRefreshing(platform);
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(null);
  };

  const getStatusBadge = (status: Connection['status']) => {
    switch (status) {
      case 'connected':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 text-green-400 text-sm font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            CONNECTED
          </motion.div>
        );
      case 'expired':
        return (
          <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold">
            <Clock className="w-4 h-4" />
            EXPIRED
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
            <XCircle className="w-4 h-4" />
            ERROR
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
            NOT CONNECTED
          </div>
        );
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
            <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-slate-400 text-lg">Loading connections...</p>
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
          className="max-w-6xl mx-auto"
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
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Platform Connections
              </h1>
              <p className="text-slate-400 text-lg">Manage your social media and publishing integrations</p>
            </div>
          </motion.div>

          {/* Security Notice */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Secure OAuth 2.0 Authentication</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  All tokens are encrypted with AES-256-GCM and stored securely. We never store your passwords. 
                  You can revoke access at any time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Connection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.map((conn, idx) => (
              <motion.div
                key={conn.platform}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative overflow-hidden bg-gradient-to-br ${conn.bgColor} border ${conn.borderColor} rounded-2xl p-6 shadow-xl`}
              >
                {/* Connection status indicator */}
                {conn.connected && (
                  <motion.div
                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  />
                )}

                {/* Animated connection lines */}
                {conn.connected && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg className="w-full h-full">
                      <motion.line
                        x1="0"
                        y1="50%"
                        x2="100%"
                        y2="50%"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`text-5xl`}
                      >
                        {conn.icon}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-xl">{conn.label}</h3>
                        {getStatusBadge(conn.status)}
                      </div>
                    </div>
                  </div>

                  {/* Connection Details */}
                  {conn.connected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-4 space-y-2 text-sm"
                    >
                      {conn.lastSync && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Last synced:</span>
                          <span className="font-semibold">
                            {new Date(conn.lastSync).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {conn.expiresAt && (
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Token expires:</span>
                          <span className="font-semibold">
                            {new Date(conn.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-green-400 text-xs">
                        <Key className="w-3 h-3" />
                        <span>Token encrypted with AES-256-GCM</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    {!conn.connected ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleConnect(conn.platform)}
                        className={`flex-1 py-3 bg-gradient-to-r ${conn.color} hover:opacity-90 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2`}
                      >
                        <Zap className="w-5 h-5" />
                        Connect {conn.label}
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRefresh(conn.platform)}
                          disabled={refreshing === conn.platform}
                          className="flex-1 py-3 bg-slate-800/50 hover:bg-slate-800/80 rounded-xl font-semibold transition-all border border-slate-700/50 flex items-center justify-center gap-2"
                        >
                          {refreshing === conn.platform ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Refreshing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5" />
                              Refresh
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDisconnect(conn.platform)}
                          className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Disconnect
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* OAuth Scopes */}
                  {conn.connected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 pt-4 border-t border-slate-700/50"
                    >
                      <p className="text-xs text-slate-500 mb-2">Permissions granted:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Read', 'Write', 'Publish'].map((scope) => (
                          <span
                            key={scope}
                            className="px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-xs font-semibold"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Platforms Coming Soon */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Coming Soon
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: 'YouTube', icon: '🎥', key: 'youtube' },
                  { name: 'TikTok', icon: '🎵', key: 'tiktok' },
                  { name: 'Reddit', icon: '🤖', key: 'reddit' },
                  { name: 'Pinterest', icon: '📌', key: 'pinterest' },
                  { name: 'Facebook', icon: '👥', key: 'facebook' },
                ].map((platform, idx) => (
                  <motion.button
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      alert(`${platform.name} integration coming soon! We'll notify you when it's ready.`);
                      // TODO: Store interest in database
                      // fetch('/api/platforms/reserve', { 
                      //   method: 'POST', 
                      //   body: JSON.stringify({ platform: platform.key, userId: 'demo-user' })
                      // });
                    }}
                    className="p-4 bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 rounded-xl text-center transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{platform.icon}</div>
                    <div className="text-sm font-semibold">{platform.name}</div>
                    <div className="text-xs text-slate-500 mt-1">Reserve Integration</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div variants={itemVariants} className="mt-8">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Having trouble connecting a platform? Check our documentation or contact support.
                  </p>
                  <div className="flex gap-3">
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Docs
                    </motion.a>
                    <motion.a
                      href="#"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-lg font-semibold text-sm transition-all"
                    >
                      Contact Support
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
