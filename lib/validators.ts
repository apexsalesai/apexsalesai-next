/**
 * Validation Schemas
 * Zod schemas for request validation
 */

import { z } from 'zod';

// Platform enum
export const PlatformEnum = z.enum([
  'linkedin',
  'x',
  'youtube',
  'instagram',
  'tiktok',
  'wordpress',
  'reddit',
  'pinterest',
  'facebook',
]);

export type Platform = z.infer<typeof PlatformEnum>;

// Publish request
export const PublishRequestSchema = z.object({
  assetId: z.string().cuid(),
  platform: PlatformEnum,
  scheduledAt: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type PublishRequest = z.infer<typeof PublishRequestSchema>;

// Career profile
export const CareerProfileSchema = z.object({
  headline: z.string().min(3).max(200),
  bio: z.string().min(10).max(5000),
  skills: z.array(z.string()).max(50),
  portfolioUrls: z.array(z.string().url()).max(20),
  socialLinks: z.record(z.string(), z.string().url()).optional(),
  visibility: z.enum(['private', 'org', 'public']).optional(),
});

export type CareerProfileInput = z.infer<typeof CareerProfileSchema>;

// Performance update
export const PerformanceUpdateSchema = z.object({
  jobId: z.string().cuid(),
  impressions: z.number().int().min(0).optional(),
  clicks: z.number().int().min(0).optional(),
  engagement: z.number().min(0).max(1).optional(),
  conversions: z.number().int().min(0).optional(),
});

export type PerformanceUpdate = z.infer<typeof PerformanceUpdateSchema>;

// OAuth callback
export const OAuthCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export type OAuthCallback = z.infer<typeof OAuthCallbackSchema>;

// Resume upload
export const ResumeUploadSchema = z.object({
  fileName: z.string(),
  fileSize: z.number().max(10 * 1024 * 1024), // 10MB max
  mimeType: z.enum([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
});

export type ResumeUpload = z.infer<typeof ResumeUploadSchema>;

// Content generation request (from Phase 6)
export const ContentGenerationSchema = z.object({
  campaignId: z.string().cuid().optional(),
  channel: z.string(),
  goal: z.string().min(10),
  tone: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  targetAudience: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  mode: z.enum(['B2B', 'B2C']).optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  experience: z.string().optional(),
  companyName: z.string().optional(),
  productName: z.string().optional(),
});

export type ContentGeneration = z.infer<typeof ContentGenerationSchema>;

// Channel publishing schemas
export const publishBase = z.object({
  assetId: z.string().min(1),
  title: z.string().optional(),
  body: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const publishEmail = publishBase.extend({
  provider: z.enum(['resend', 'sendgrid']).default('resend'),
  to: z.array(z.string().email()).min(1),
  subject: z.string().min(1),
});

export const publishBlog = publishBase.extend({
  slug: z.string().min(2),
});

export const publishLinkedIn = publishBase.extend({
  visibility: z.enum(['PUBLIC', 'CONNECTIONS']).default('PUBLIC'),
});

export const publishX = publishBase;

export const publishSocial = z.object({
  assetId: z.string().min(1),
  title: z.string().optional(),
  body: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  channels: z.array(z.enum(['blog', 'email', 'linkedin', 'x'])).min(1),
});

// Helper function to validate and parse
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`);
      throw new Error(`Validation failed: ${messages.join(', ')}`);
    }
    throw error;
  }
}
