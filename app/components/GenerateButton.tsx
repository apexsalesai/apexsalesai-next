'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2, ChevronRight } from 'lucide-react';
import { useContentStore } from '@lib/store/contentStore';
import { logContentMetrics, logAudit } from '@lib/telemetry';
import confetti from 'canvas-confetti';

export function GenerateButton() {
  const {
    activeMode,
    prompt,
    tone,
    targetLength,
    charLimit,
    selectedPlatforms,
    isGenerating,
    generationProgress,
    setIsGenerating,
    setGenerationProgress,
    setGeneratedContent,
    setError,
    setShowSuccess,
  } = useContentStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    const startTime = Date.now();
    const userId = 'demo-user'; // TODO: Get from auth session

    // Log audit event
    await logAudit({
      userId,
      action: 'content_generation_started',
      resourceType: 'content',
      resourceId: `${activeMode}-${Date.now()}`,
      metadata: {
        mode: activeMode,
        promptLength: prompt.length,
        platforms: selectedPlatforms,
      },
    });

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev: number) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const response = await fetch('/api/agent/generate-universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeMode,
          prompt,
          targetLength,
          tone,
          platforms: selectedPlatforms,
          charLimit,
        }),
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (data.success) {
        const content = data.content;
        const wordCount = content.trim().split(/\s+/).length;
        const charCount = content.length;
        const readingTime = Math.ceil(wordCount / 200);

        // Set generated content
        setGeneratedContent({
          content,
          wordCount,
          charCount,
          readingTime,
          timestamp: new Date(),
          mode: activeMode,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
        });

        // Log telemetry
        const duration = Date.now() - startTime;
        await logContentMetrics({
          userId,
          contentType: activeMode,
          wordCount,
          charCount,
          generationTime: duration,
          cost: data.cost || 0.002,
          model: data.model || 'gpt-4o-mini',
          success: true,
          platforms: selectedPlatforms.length > 0 ? selectedPlatforms.join(',') : undefined,
        });

        // Success feedback
        setShowSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError(data.error || 'Generation failed');
        
        // Log failure
        await logContentMetrics({
          userId,
          contentType: activeMode,
          wordCount: 0,
          charCount: 0,
          generationTime: Date.now() - startTime,
          cost: 0,
          model: 'gpt-4o-mini',
          success: false,
          errorMessage: data.error,
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError('Failed to generate content. Please try again.');
      clearInterval(progressInterval);
      
      // Log error
      await logContentMetrics({
        userId,
        contentType: activeMode,
        wordCount: 0,
        charCount: 0,
        generationTime: Date.now() - startTime,
        cost: 0,
        model: 'gpt-4o-mini',
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGenerate}
      disabled={isGenerating || !prompt.trim()}
      className="w-full py-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10 flex items-center gap-3">
        {isGenerating ? (
          <>
            <Loader2 className="w-7 h-7 animate-spin" />
            Generating Magic...
          </>
        ) : (
          <>
            <Zap className="w-7 h-7" />
            Generate Content
            <ChevronRight className="w-6 h-6" />
          </>
        )}
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${generationProgress}%` }}
          className="absolute bottom-0 left-0 h-1 bg-white/50"
        />
      )}
    </motion.button>
  );
}
