'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle } from 'lucide-react';
import { slideUp } from '@lib/motion-presets';
import { colors, typography, spacing, borderRadius, glassmorphism } from '@lib/theme';

export function TelemetryPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        ...glassmorphism.dark,
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
        <Activity size={24} style={{ color: colors.electricTeal }} />
        <h2
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: '#ffffff',
          }}
        >
          Telemetry & Analytics
        </h2>
      </div>

      {/* Connected Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing.xs} ${spacing.md}`,
          background: 'rgba(16, 185, 129, 0.2)',
          border: `1px solid ${colors.success}`,
          borderRadius: borderRadius.full,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: colors.success,
          marginBottom: spacing.lg,
        }}
      >
        <CheckCircle size={16} />
        Connected
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
        {[
          { label: 'Total Generations', value: '0', color: colors.electricTeal },
          { label: 'Success Rate', value: '100%', color: colors.success },
          { label: 'Avg. Generation Time', value: '0s', color: colors.info },
          { label: 'Total Cost', value: '$0.00', color: colors.warning },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: spacing.md,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: borderRadius.lg,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.gray[400],
                marginBottom: spacing.xs,
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: metric.color,
              }}
            >
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Log */}
      <div style={{ marginTop: spacing.lg }}>
        <h3
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.gray[300],
            marginBottom: spacing.sm,
          }}
        >
          Recent Activity
        </h3>
        <div
          style={{
            padding: spacing.md,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: borderRadius.lg,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: typography.fontSize.sm,
            color: colors.gray[400],
            textAlign: 'center',
          }}
        >
          No activity yet. Generate content to see logs here.
        </div>
      </div>
    </motion.div>
  );
}
