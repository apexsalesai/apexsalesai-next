import { z } from 'zod';

// Share template schema
export const ShareTemplateSchema = z.object({
  template: z.string(),
  variables: z.array(z.string()).optional(),
});

// Social sharing configuration schema
export const SocialConfigSchema = z.object({
  defaultOgImage: z.string(),
  twitterCard: z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
  shareTemplates: z.object({
    default: z.string(),
    blog: z.string(),
    product: z.string(),
    custom: z.record(z.string(), z.string()).optional(),
  }),
  platforms: z.object({
    twitter: z.object({
      enabled: z.boolean(),
      handle: z.string().optional(),
      templates: z.array(ShareTemplateSchema).optional(),
    }),
    linkedin: z.object({
      enabled: z.boolean(),
      templates: z.array(ShareTemplateSchema).optional(),
    }),
    facebook: z.object({
      enabled: z.boolean(),
      templates: z.array(ShareTemplateSchema).optional(),
    }),
    reddit: z.object({
      enabled: z.boolean(),
      templates: z.array(ShareTemplateSchema).optional(),
    }),
    email: z.object({
      enabled: z.boolean(),
      subject: z.string().optional(),
      templates: z.array(ShareTemplateSchema).optional(),
    }),
  }),
  utmDefaults: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
    })
    .optional(),
});

export type ShareTemplate = z.infer<typeof ShareTemplateSchema>;
export type SocialConfig = z.infer<typeof SocialConfigSchema>;
