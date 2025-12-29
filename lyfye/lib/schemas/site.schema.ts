import { z } from 'zod';

// Site configuration schema
export const SiteConfigSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  logo: z.object({
    light: z.string(),
    dark: z.string(),
    favicon: z.string(),
  }),
  social: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    youtube: z.string().optional(),
  }),
  contact: z.object({
    email: z.string().email(),
    press: z.string().email().optional(),
    business: z.string().email().optional(),
  }),
  legal: z.object({
    companyName: z.string(),
    foundedYear: z.number(),
  }),
  seo: z.object({
    defaultTitle: z.string(),
    titleTemplate: z.string(),
    defaultDescription: z.string(),
    defaultOgImage: z.string(),
    twitterHandle: z.string().optional(),
  }),
  analytics: z
    .object({
      googleAnalyticsId: z.string().optional(),
    })
    .optional(),
  theme: z.object({
    defaultMode: z.enum(['light', 'dark']),
    primaryColor: z.string(),
    accentColor: z.string(),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
