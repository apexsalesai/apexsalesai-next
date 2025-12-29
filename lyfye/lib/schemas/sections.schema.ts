import { z } from 'zod';

// Common button schema
export const ButtonSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'secondary', 'ghost']).optional(),
  external: z.boolean().optional(),
});

// Hero section schema
export const HeroSectionSchema = z.object({
  type: z.literal('hero'),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  buttons: z.array(ButtonSchema).optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  badge: z.string().optional(),
});

// Feature item schema
export const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  image: z.string().optional(),
});

// Features section schema
export const FeaturesSectionSchema = z.object({
  type: z.literal('features'),
  title: z.string(),
  description: z.string().optional(),
  features: z.array(FeatureItemSchema),
  layout: z.enum(['grid', 'list', 'carousel']).optional(),
});

// Stats/metrics schema
export const StatsItemSchema = z.object({
  value: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export const StatsSectionSchema = z.object({
  type: z.literal('stats'),
  title: z.string().optional(),
  stats: z.array(StatsItemSchema),
});

// CTA section schema
export const CTASectionSchema = z.object({
  type: z.literal('cta'),
  title: z.string(),
  description: z.string().optional(),
  buttons: z.array(ButtonSchema),
  background: z.enum(['gradient', 'solid', 'image']).optional(),
  image: z.string().optional(),
});

// Card item schema
export const CardItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  icon: z.string().optional(),
  href: z.string().optional(),
  badge: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Grid section schema
export const GridSectionSchema = z.object({
  type: z.literal('grid'),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(CardItemSchema),
  columns: z.number().optional(),
});

// Testimonial schema
export const TestimonialItemSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  company: z.string().optional(),
  avatar: z.string().optional(),
});

export const TestimonialsSectionSchema = z.object({
  type: z.literal('testimonials'),
  title: z.string(),
  description: z.string().optional(),
  testimonials: z.array(TestimonialItemSchema),
});

// FAQ schema
export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const FAQSectionSchema = z.object({
  type: z.literal('faq'),
  title: z.string(),
  description: z.string().optional(),
  faqs: z.array(FAQItemSchema),
});

// Timeline/changelog schema
export const TimelineItemSchema = z.object({
  date: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
});

export const TimelineSectionSchema = z.object({
  type: z.literal('timeline'),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(TimelineItemSchema),
});

// Content section (rich text)
export const ContentSectionSchema = z.object({
  type: z.literal('content'),
  title: z.string().optional(),
  content: z.string(),
  layout: z.enum(['centered', 'wide', 'narrow']).optional(),
});

// Logo cloud section
export const LogoCloudSectionSchema = z.object({
  type: z.literal('logoCloud'),
  title: z.string(),
  description: z.string().optional(),
  logos: z.array(
    z.object({
      name: z.string(),
      image: z.string(),
      url: z.string().optional(),
    })
  ),
});

// Union of all section types
export const PageSectionSchema = z.discriminatedUnion('type', [
  HeroSectionSchema,
  FeaturesSectionSchema,
  StatsSectionSchema,
  CTASectionSchema,
  GridSectionSchema,
  TestimonialsSectionSchema,
  FAQSectionSchema,
  TimelineSectionSchema,
  ContentSectionSchema,
  LogoCloudSectionSchema,
]);

export type Button = z.infer<typeof ButtonSchema>;
export type HeroSection = z.infer<typeof HeroSectionSchema>;
export type FeatureItem = z.infer<typeof FeatureItemSchema>;
export type FeaturesSection = z.infer<typeof FeaturesSectionSchema>;
export type StatsItem = z.infer<typeof StatsItemSchema>;
export type StatsSection = z.infer<typeof StatsSectionSchema>;
export type CTASection = z.infer<typeof CTASectionSchema>;
export type CardItem = z.infer<typeof CardItemSchema>;
export type GridSection = z.infer<typeof GridSectionSchema>;
export type TestimonialItem = z.infer<typeof TestimonialItemSchema>;
export type TestimonialsSection = z.infer<typeof TestimonialsSectionSchema>;
export type FAQItem = z.infer<typeof FAQItemSchema>;
export type FAQSection = z.infer<typeof FAQSectionSchema>;
export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type TimelineSection = z.infer<typeof TimelineSectionSchema>;
export type ContentSection = z.infer<typeof ContentSectionSchema>;
export type LogoCloudSection = z.infer<typeof LogoCloudSectionSchema>;
export type PageSection = z.infer<typeof PageSectionSchema>;
