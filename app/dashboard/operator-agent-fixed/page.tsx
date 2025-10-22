'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ContentTabs } from './components/ContentTabs';
import { GeneratorPanel } from './components/GeneratorPanel';
import { LivePreview } from './components/LivePreview';
import { TelemetryPanel } from './components/TelemetryPanel';
import { staggerContainer, staggerItem } from '@lib/motion-presets';
import { colors, typography, spacing } from '@lib/theme';

export default function OperatorAgentFixed() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.deepBlue} 0%, ${colors.charcoal} 100%)`,
        padding: spacing.xl,
      }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <motion.div variants={staggerItem} style={{ marginBottom: spacing.xl }}>
          <h1
            style={{
              fontSize: typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.bold,
              color: '#ffffff',
              marginBottom: spacing.sm,
              background: `linear-gradient(135deg, #ffffff 0%, ${colors.electricTeal} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI Marketing Studio
          </h1>
          <p
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.gray[400],
            }}
          >
            Enterprise-grade content generation with real-time telemetry
          </p>
        </motion.div>

        {/* Content Tabs */}
        <motion.div variants={staggerItem} style={{ marginBottom: spacing.xl }}>
          <ContentTabs />
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={staggerItem}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.xl,
            marginBottom: spacing.xl,
          }}
        >
          {/* Left Column - Generator */}
          <GeneratorPanel />

          {/* Right Column - Preview */}
          <LivePreview />
        </motion.div>

        {/* Telemetry Panel */}
        <motion.div variants={staggerItem}>
          <TelemetryPanel />
        </motion.div>
      </motion.div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 224, 198, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 224, 198, 0.5);
        }

        /* Selection Styling */
        ::selection {
          background: rgba(0, 224, 198, 0.3);
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
