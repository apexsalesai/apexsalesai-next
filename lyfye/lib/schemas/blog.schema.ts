import { z } from 'zod';

// Blog post author schema
export const BlogAuthorSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

// Blog post metadata schema
export const BlogMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

// Blog post schema
export const BlogPostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  content: z.string(),
  author: BlogAuthorSchema,
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  metadata: BlogMetadataSchema.optional(),
});

export type BlogAuthor = z.infer<typeof BlogAuthorSchema>;
export type BlogMetadata = z.infer<typeof BlogMetadataSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
