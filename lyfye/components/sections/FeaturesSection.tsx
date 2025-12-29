'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import type { FeaturesSection as FeaturesSectionType } from '@/lib/schemas';

export const FeaturesSection: React.FC<FeaturesSectionType> = ({
  title,
  description,
  features,
  layout = 'grid',
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`grid gap-8 ${
            layout === 'grid'
              ? 'md:grid-cols-2 lg:grid-cols-3'
              : 'md:grid-cols-1 max-w-2xl mx-auto'
          }`}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card hover>
                {feature.icon && (
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                )}
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
