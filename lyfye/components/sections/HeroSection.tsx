'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { HeroSection as HeroSectionType } from '@/lib/schemas';

export const HeroSection: React.FC<HeroSectionType> = ({
  title,
  subtitle,
  description,
  buttons,
  badge,
}) => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden noise-overlay">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          {badge && (
            <Badge variant="default" className="mb-6">
              {badge}
            </Badge>
          )}

          {subtitle && (
            <p className="text-sm font-medium text-primary mb-4 uppercase tracking-wider">
              {subtitle}
            </p>
          )}

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
            {title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-10">
            {description}
          </p>

          {buttons && buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {buttons.map((button, index) => (
                <Link key={index} href={button.href}>
                  <Button variant={button.variant || 'primary'} size="lg">
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
