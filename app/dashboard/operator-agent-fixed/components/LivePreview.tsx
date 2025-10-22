'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Share2, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useContentStore } from '@lib/store/contentStore';
import { slideUp } from '@lib/motion-presets';
import { colors, typography, spacing, borderRadius, glassmorphism } from '@lib/theme';

export function LivePreview() {
  const { generatedContent, isGenerating } = useContentStore();
  const [displayedContent, setDisplayedContent] = useState('');
  const [copied, setCopied] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (!generatedContent?.content) {
      setDisplayedContent('');
      return;
    }

    let index = 0;
    const content = generatedContent.content;
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10); // Fast typing effect

    return () => clearInterval(interval);
  }, [generatedContent?.content]);

  const handleCopy = async () => {
    if (generatedContent?.content) {
      await navigator.clipboard.writeText(generatedContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedContent?.content) {
      const blob = new Blob([generatedContent.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedContent.mode}-${Date.now()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      {...slideUp}
      style={{
        ...glassmorphism.dark,
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <h2
          style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: '#ffffff',
          }}
        >
          📄 Live Preview
        </h2>

        {generatedContent && (
          <div style={{ display: 'flex', gap: spacing.sm }}>
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: spacing.sm,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: borderRadius.md,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </motion.button>

            <motion.button
              onClick={handleDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: spacing.sm,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: borderRadius.md,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: spacing.sm,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: borderRadius.md,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: spacing.lg,
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: borderRadius.lg,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: colors.gray[400],
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    border: `3px solid ${colors.electricTeal}`,
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px',
                  }}
                />
                <p>Generating your content...</p>
              </div>
            </motion.div>
          ) : generatedContent ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                color: colors.gray[100],
                lineHeight: 1.8,
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }} {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: colors.electricTeal }} {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginTop: '20px', marginBottom: '10px', color: '#ffffff' }} {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p style={{ marginBottom: '16px', color: colors.gray[200] }} {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul style={{ marginLeft: '24px', marginBottom: '16px', listStyleType: 'disc' }} {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol style={{ marginLeft: '24px', marginBottom: '16px', listStyleType: 'decimal' }} {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li style={{ marginBottom: '8px', color: colors.gray[200] }} {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code
                        style={{
                          background: 'rgba(0, 224, 198, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '14px',
                          color: colors.electricTeal,
                        }}
                        {...props}
                      />
                    ) : (
                      <code
                        style={{
                          display: 'block',
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          overflowX: 'auto',
                          marginBottom: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                        {...props}
                      />
                    ),
                  strong: ({ node, ...props }) => (
                    <strong style={{ fontWeight: 600, color: '#ffffff' }} {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a style={{ color: colors.electricTeal, textDecoration: 'underline' }} {...props} />
                  ),
                }}
              >
                {displayedContent}
              </ReactMarkdown>

              {/* Metrics */}
              {generatedContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: spacing.xl,
                    padding: spacing.md,
                    background: 'rgba(0, 224, 198, 0.1)',
                    borderRadius: borderRadius.lg,
                    border: `1px solid ${colors.electricTeal}`,
                    display: 'flex',
                    gap: spacing.lg,
                    fontSize: typography.fontSize.sm,
                  }}
                >
                  <div>
                    <strong style={{ color: colors.electricTeal }}>Words:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>{generatedContent.wordCount}</span>
                  </div>
                  <div>
                    <strong style={{ color: colors.electricTeal }}>Characters:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>{generatedContent.charCount}</span>
                  </div>
                  <div>
                    <strong style={{ color: colors.electricTeal }}>Reading Time:</strong>{' '}
                    <span style={{ color: '#ffffff' }}>{generatedContent.readingTime} min</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: colors.gray[500],
                textAlign: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: typography.fontSize.lg, marginBottom: spacing.sm }}>
                  Your generated content will appear here
                </p>
                <p style={{ fontSize: typography.fontSize.sm }}>
                  Select a content type and enter a topic to get started
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
