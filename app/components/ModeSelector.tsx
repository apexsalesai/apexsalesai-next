'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, Video, Mail, TrendingUp, Check, Target } from 'lucide-react';
import { useContentStore, ContentMode } from '@lib/store/contentStore';

const modes = [
  {
    id: 'blog' as ContentMode,
    icon: FileText,
    label: 'Blog Post',
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    description: 'SEO-optimized long-form content',
    emoji: '📝'
  },
  {
    id: 'social' as ContentMode,
    icon: Users,
    label: 'Social Media',
    gradient: 'from-pink-600 via-purple-500 to-indigo-400',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    description: 'Multi-platform engagement posts',
    emoji: '📱'
  },
  {
    id: 'video' as ContentMode,
    icon: Video,
    label: 'Video Script',
    gradient: 'from-orange-600 via-red-500 to-pink-400',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    description: 'Sora-powered video generation',
    emoji: '🎥'
  },
  {
    id: 'email' as ContentMode,
    icon: Mail,
    label: 'Email Campaign',
    gradient: 'from-green-600 via-emerald-500 to-teal-400',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    description: 'CRM-ready email sequences',
    emoji: '✉️'
  },
  {
    id: 'sales' as ContentMode,
    icon: TrendingUp,
    label: 'Sales Copy',
    gradient: 'from-yellow-600 via-orange-500 to-red-400',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    description: 'High-conversion sales content',
    emoji: '💰'
  },
];

export function ModeSelector() {
  const { activeMode, setActiveMode } = useContentStore();
  const currentMode = modes.find(m => m.id === activeMode)!;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Target className="w-6 h-6 text-cyan-400" />
          Content Type
        </h2>
        <motion.div
          key={activeMode}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30"
        >
          <span className="text-cyan-400 font-semibold">{currentMode.label} Selected</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveMode(mode.id)}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-500 overflow-hidden group ${
                isActive
                  ? 'border-transparent shadow-2xl'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${mode.gradient.split(' ').map(c => c.replace(/from-|via-|to-/g, '')).join(', ')})`
                  : 'rgba(26, 32, 44, 0.5)',
                boxShadow: isActive ? `0 20px 60px ${mode.glowColor}` : 'none'
              }}
            >
              {/* Animated Background */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 opacity-30"
                  animate={{
                    background: [
                      'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {/* Checkmark */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-black" />
                </motion.div>
              )}

              <div className="relative z-10">
                <mode.icon className={`w-12 h-12 mx-auto mb-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <div className={`text-2xl mb-2 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {mode.emoji}
                </div>
                <div className={`font-bold text-lg mb-2 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {mode.label}
                </div>
                <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {mode.description}
                </div>
              </div>

              {/* Hover Glow */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                isActive
                  ? 'opacity-0'
                  : 'opacity-0 group-hover:opacity-100'
              }`} style={{
                background: `radial-gradient(circle at center, ${mode.glowColor} 0%, transparent 70%)`
              }} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
