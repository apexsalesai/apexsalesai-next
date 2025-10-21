'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { useContentStore } from '@lib/store/contentStore';
import { ModeSelector } from './ModeSelector';
import { PlatformSelector } from './PlatformSelector';
import { CharacterLimitControl } from './CharacterLimitControl';
import { GenerateButton } from './GenerateButton';
import { LivePreview } from './LivePreview';

export function ApexMarketingStudio() {
  const { prompt, setPrompt, tone, setTone, error } = useContentStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1321] to-[#0a0e1a] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 p-8 max-w-[1800px] mx-auto">
        {/* Hero Header - Cinematic */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/30"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-semibold">Powered by Autonomous AI Agents</span>
          </motion.div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            ApexSalesAI Marketing Studio
          </h1>
          <p className="text-2xl text-gray-400">
            Create. <span className="text-cyan-400">Automate.</span> <span className="text-purple-400">Dominate.</span>
          </p>
        </motion.div>

        {/* Mode Selector */}
        <ModeSelector />

        {/* Main Content Area - Split View */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input Controls */}
          <div className="space-y-6">
            {/* Prompt Input - Glass Morphism */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <label className="text-white font-bold text-lg flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  Describe Your Content
                </label>
                <button
                  onClick={() => setPrompt('')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Write a comprehensive guide on AI sales automation for enterprise teams..."
                rows={6}
                className="w-full px-6 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none text-lg"
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-gray-400">
                  {prompt.length} / 1000 characters
                </span>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-semibold">
                    AI-Powered Generation
                  </span>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            {/* Platform Selection (only for social mode) */}
            <PlatformSelector />

            {/* Character Limit Control */}
            <CharacterLimitControl
              value={useContentStore.getState().charLimit}
              onChange={useContentStore.getState().setCharLimit}
            />

            {/* Tone & Length */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10"
            >
              <label className="text-white font-bold text-lg mb-4 block">Tone & Style</label>
              <div className="grid grid-cols-2 gap-3">
                {(['professional', 'casual', 'persuasive', 'friendly'] as const).map((t) => (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTone(t)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      tone === t
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="font-semibold capitalize">{t}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Generate Button - Hero CTA */}
            <GenerateButton />
          </div>

          {/* Right Column - Live Preview */}
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
