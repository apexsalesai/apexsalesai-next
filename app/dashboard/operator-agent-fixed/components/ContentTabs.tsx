'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Share2, Video, Mail } from 'lucide-react';
import { useContentStore, ContentMode } from '@lib/store/contentStore';
import { tabTransition } from '@lib/motion-presets';
import { colors, typography, spacing, borderRadius } from '@lib/theme';

const contentModes = [
  { id: 'blog' as ContentMode, label: 'Blog', icon: FileText },
  { id: 'social' as ContentMode, label: 'Social', icon: Share2 },
  { id: 'video' as ContentMode, label: 'Video', icon: Video },
  { id: 'email' as ContentMode, label: 'Email', icon: Mail },
];

export function ContentTabs() {
  const { activeMode, setActiveMode } = useContentStore();

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.sm,
        padding: spacing.md,
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(16px)',
        borderRadius: borderRadius.xl,
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {contentModes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;

        return (
          <motion.button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.lg}`,
              fontSize: typography.fontSize.base,
              fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.medium,
              color: isActive ? '#ffffff' : colors.gray[400],
              background: isActive
                ? 'linear-gradient(135deg, #00E0C6 0%, #001F3F 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: borderRadius.lg,
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
              overflow: 'hidden',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #00E0C6 0%, #001F3F 100%)',
                  borderRadius: borderRadius.lg,
                  zIndex: -1,
                }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              />
            )}
            <Icon size={20} />
            <span>{mode.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
