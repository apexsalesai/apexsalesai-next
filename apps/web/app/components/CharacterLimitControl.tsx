'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Check } from 'lucide-react';

interface CharacterLimitControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function CharacterLimitControl({ value, onChange }: CharacterLimitControlProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const presets = [
    { label: 'Twitter/X', value: 280, icon: '🐦' },
    { label: 'LinkedIn', value: 3000, icon: '💼' },
    { label: 'Instagram', value: 2200, icon: '📸' },
    { label: 'Job (Short)', value: 500, icon: '📝' },
    { label: 'Job (Long)', value: 2000, icon: '📄' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <label className="text-white font-bold text-lg flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          Character Limit
        </label>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold"
        >
          {showCustomInput ? 'Use Presets' : 'Custom Limit'}
        </button>
      </div>

      {!showCustomInput ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {presets.map((preset) => (
              <motion.button
                key={preset.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange(preset.value)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  value === preset.value
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {value === preset.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <div className="text-2xl mb-2">{preset.icon}</div>
                <div className={`font-bold text-sm mb-1 ${value === preset.value ? 'text-blue-400' : 'text-white'}`}>
                  {preset.label}
                </div>
                <div className="text-xs text-gray-400">{preset.value.toLocaleString()} chars</div>
              </motion.button>
            ))}
          </div>

          <div className="p-4 bg-black/30 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current Limit:</span>
              <span className="text-lg font-bold text-white">{value.toLocaleString()} characters</span>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Enter Custom Character Limit</label>
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., 500"
              min="0"
              max="100000"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <span className="text-sm text-blue-400">Custom limit set:</span>
            <span className="text-lg font-bold text-blue-400">{value.toLocaleString()} chars</span>
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl border border-cyan-500/20">
        <div className="text-xs text-gray-400 mb-2">💡 Platform Recommendations:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-gray-500">Twitter/X: 280</div>
          <div className="text-gray-500">LinkedIn: 3,000</div>
          <div className="text-gray-500">Instagram: 2,200</div>
          <div className="text-gray-500">Facebook: 63,206</div>
        </div>
      </div>
    </motion.div>
  );
}
