'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { useContentStore } from '@lib/store/contentStore';
import { logEvent } from '@lib/telemetry';
import { slideUp } from '@lib/motion-presets';
import { colors, typography, spacing, borderRadius, glassmorphism } from '@lib/theme';

// Toast notification component (inline for now)
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    style={{
      position: 'fixed',
      bottom: spacing.lg,
      right: spacing.lg,
      padding: spacing.md,
      background: type === 'success' ? colors.success : colors.error,
      color: '#ffffff',
      borderRadius: borderRadius.lg,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      zIndex: 9999,
      fontWeight: typography.fontWeight.semibold,
    }}
  >
    {message}
  </motion.div>
);

export function GeneratorPanel() {
  const {
    activeMode,
    prompt,
    setPrompt,
    tone,
    setTone,
    targetLength,
    setTargetLength,
    selectedPlatforms,
    isGenerating,
    setIsGenerating,
    setGeneratedContent,
    setError,
  } = useContentStore();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter a topic', 'error');
      return;
    }

    setIsGenerating(true);
    setError(null);

    const startTime = Date.now();

    try {
      const response = await fetch(`/api/generate/${activeMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: prompt,
          tone,
          length: targetLength,
          platform: selectedPlatforms[0] || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Generation failed: ${response.status}`);
      }

      const data = await response.json();
      const generationTime = Date.now() - startTime;

      setGeneratedContent({
        content: data.result,
        wordCount: data.metadata?.wordCount || 0,
        charCount: data.metadata?.charCount || 0,
        readingTime: Math.ceil((data.metadata?.wordCount || 0) / 200),
        timestamp: new Date(),
        mode: activeMode,
        platforms: selectedPlatforms,
      });

      // Log telemetry
      logEvent('content_generated', {
        type: activeMode,
        topic: prompt,
        platform: selectedPlatforms[0] || 'none',
        timestamp: new Date().toISOString(),
        userId: 'system-user',
        metadata: {
          generationTime,
          wordCount: data.metadata?.wordCount,
          model: data.metadata?.model,
        },
      });

      showToast(`✅ ${activeMode} generated successfully`, 'success');
    } catch (err: any) {
      console.error('[GeneratorPanel] Generation error:', err);
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      {...slideUp}
      style={{
        ...glassmorphism.dark,
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
      }}
    >
      <h2
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.bold,
          color: '#ffffff',
          marginBottom: spacing.lg,
        }}
      >
        🎨 AI-Powered Studio Experience
      </h2>

      {/* Topic Input */}
      <div style={{ marginBottom: spacing.lg }}>
        <label
          style={{
            display: 'block',
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            color: colors.gray[300],
            marginBottom: spacing.sm,
          }}
        >
          What's your topic?
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., How AI Agents Transform Revenue Operations"
          style={{
            width: '100%',
            padding: spacing.md,
            fontSize: typography.fontSize.base,
            color: '#ffffff',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: borderRadius.lg,
            outline: 'none',
            transition: 'all 0.25s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.electricTeal;
            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        />
      </div>

      {/* Tone & Length */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[300],
              marginBottom: spacing.sm,
            }}
          >
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            style={{
              width: '100%',
              padding: spacing.md,
              fontSize: typography.fontSize.base,
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: borderRadius.lg,
              cursor: 'pointer',
            }}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="persuasive">Persuasive</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[300],
              marginBottom: spacing.sm,
            }}
          >
            Length
          </label>
          <select
            value={targetLength}
            onChange={(e) => setTargetLength(e.target.value as any)}
            style={{
              width: '100%',
              padding: spacing.md,
              fontSize: typography.fontSize.base,
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: borderRadius.lg,
              cursor: 'pointer',
            }}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        whileHover={!isGenerating && prompt.trim() ? { scale: 1.02 } : {}}
        whileTap={!isGenerating && prompt.trim() ? { scale: 0.98 } : {}}
        style={{
          width: '100%',
          padding: spacing.md,
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.bold,
          color: '#ffffff',
          background: isGenerating || !prompt.trim()
            ? colors.gray[600]
            : `linear-gradient(135deg, ${colors.electricTeal} 0%, ${colors.deepBlue} 100%)`,
          border: 'none',
          borderRadius: borderRadius.lg,
          cursor: isGenerating || !prompt.trim() ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          transition: 'all 0.25s',
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap size={20} />
            Generate Content
          </>
        )}
      </motion.button>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
    </motion.div>
  );
}
