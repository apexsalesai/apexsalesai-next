import { loadJsonContent, loadJsonDirectory, getJsonFiles, calculateReadingTime } from './content.loader';
import { BlogPostSchema } from '../schemas';
import type { BlogPost } from '../schemas';

/**
 * Load a specific blog post by slug
 */
export async function loadBlogPost(slug: string): Promise<BlogPost> {
  const post = await loadJsonContent(`blog/${slug}.json`, BlogPostSchema);

  // Calculate reading time if not provided
  if (!post.readingTime) {
    post.readingTime = calculateReadingTime(post.content);
  }

  return post;
}

/**
 * Load all blog posts
 */
export async function loadAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await loadJsonDirectory('blog', BlogPostSchema);

  // Calculate reading time for posts that don't have it
  posts.forEach((post) => {
    if (!post.readingTime) {
      post.readingTime = calculateReadingTime(post.content);
    }
  });

  // Sort by publishedAt date (newest first)
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Load published blog posts only
 */
export async function loadPublishedBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await loadAllBlogPosts();
  return allPosts.filter((post) => post.published !== false);
}

/**
 * Load featured blog posts
 */
export async function loadFeaturedBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await loadPublishedBlogPosts();
  return allPosts.filter((post) => post.featured === true);
}

/**
 * Load blog posts by category
 */
export async function loadBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await loadPublishedBlogPosts();
  return allPosts.filter((post) => post.category === category);
}

/**
 * Load blog posts by tag
 */
export async function loadBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await loadPublishedBlogPosts();
  return allPosts.filter((post) => post.tags?.includes(tag));
}

/**
 * Get all blog post slugs
 */
export function getAllBlogPostSlugs(): string[] {
  return getJsonFiles('blog');
}

/**
 * Get all blog categories
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await loadAllBlogPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

/**
 * Get all blog tags
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await loadAllBlogPosts();
  const tags = new Set(posts.flatMap((post) => post.tags || []));
  return Array.from(tags);
}
