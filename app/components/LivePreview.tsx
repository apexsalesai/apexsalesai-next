'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Copy, Download, RefreshCw, Sparkles } from 'lucide-react';
import { useContentStore } from '@/lib/store/contentStore';

export function LivePreview() {
  const { isGenerating, generationProgress, generatedContent, setGeneratedContent } = useContentStore();
  const [displayedContent, setDisplayedContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (generatedContent?.content) {
      const content = generatedContent.content;
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= content.length) {
          setDisplayedContent(content.substring(0, currentIndex));
          currentIndex += 20;
        } else {
          clearInterval(typingInterval);
        }
      }, 10);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedContent('');
    }
  }, [generatedContent]);

  const handleCopy = async () => {
    if (generatedContent?.content) {
      await navigator.clipboard.writeText(generatedContent.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedContent?.content) {
      const blob = new Blob([generatedContent.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedContent.mode}-content-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10 min-h-[800px] relative"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <Eye className="w-6 h-6 text-green-400" />
          Live Preview
        </h3>
        {generatedContent && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              title="Copy"
            >
              {copySuccess ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 text-sm font-semibold"
                >
                  ✓ Copied
                </motion.span>
              ) : (
                <Copy className="w-5 h-5 text-gray-300" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setGeneratedContent(null)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              title="Clear"
            >
              <RefreshCw className="w-5 h-5 text-gray-300" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
              title="Download"
            >
              <Download className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"
              />
              <Sparkles className="w-12 h-12 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-gray-400 text-lg mb-2">Creating your content...</p>
            <p className="text-cyan-400 font-semibold">{generationProgress}% Complete</p>
          </motion.div>
        ) : generatedContent ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">
              {displayedContent}
            </div>

            {/* Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{generatedContent.wordCount}</div>
                <div className="text-sm text-gray-400">Words</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{generatedContent.charCount}</div>
                <div className="text-sm text-gray-400">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{generatedContent.readingTime}</div>
                <div className="text-sm text-gray-400">Min Read</div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-gray-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-300 mb-2">Ready to Create</h4>
            <p className="text-gray-500 max-w-md">
              Enter your prompt and click Generate to see your AI-powered content appear here in real-time.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
