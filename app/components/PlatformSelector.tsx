'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useContentStore, Platform } from '@/lib/store/contentStore';

const platforms = [
  { id: 'linkedin' as Platform, name: 'LinkedIn', icon: '💼', charLimit: 3000, color: '#0077b5' },
  { id: 'twitter' as Platform, name: 'Twitter/X', icon: '🐦', charLimit: 280, color: '#1DA1F2' },
  { id: 'facebook' as Platform, name: 'Facebook', icon: '👥', charLimit: 63206, color: '#1877F2' },
  { id: 'instagram' as Platform, name: 'Instagram', icon: '📸', charLimit: 2200, color: '#E4405F' },
];

export function PlatformSelector() {
  const { activeMode, selectedPlatforms, togglePlatform } = useContentStore();

  if (activeMode !== 'social') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
      >
        <label className="text-white font-bold text-lg mb-4 block">
          Select Platforms
        </label>
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            
            return (
              <motion.button
                key={platform.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => togglePlatform(platform.id)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{platform.icon}</span>
                    <div className="text-left">
                      <div className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                        {platform.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {platform.charLimit.toLocaleString()} char limit
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
