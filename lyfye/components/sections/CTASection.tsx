'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import type { CTASection as CTASectionType } from '@/lib/schemas';

export const CTASection: React.FC<CTASectionType> = ({
  title,
  description,
  buttons,
  background = 'gradient',
}) => {
  const bgClass =
    background === 'gradient'
      ? 'bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10'
      : background === 'solid'
      ? 'bg-accent'
      : 'bg-background';

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`relative rounded-2xl ${bgClass} p-12 md:p-16 text-center overflow-hidden`}
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>
            {description && (
              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                {description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              {buttons.map((button, index) => (
                <Link key={index} href={button.href}>
                  <Button variant={button.variant || 'primary'} size="lg">
                    {button.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
