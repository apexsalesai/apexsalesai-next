import { z } from 'zod';
import { PageSectionSchema } from './sections.schema';

// Page metadata schema
export const PageMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  noindex: z.boolean().optional(),
});

// Page configuration schema
export const PageConfigSchema = z.object({
  slug: z.string(),
  metadata: PageMetadataSchema,
  sections: z.array(PageSectionSchema),
  published: z.boolean().optional(),
});

export type PageMetadata = z.infer<typeof PageMetadataSchema>;
export type PageConfig = z.infer<typeof PageConfigSchema>;
