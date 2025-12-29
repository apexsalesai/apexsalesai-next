import { loadJsonContent, getJsonFiles } from './content.loader';
import { PageConfigSchema } from '../schemas';
import type { PageConfig } from '../schemas';

/**
 * Load a specific page by slug
 */
export async function loadPage(slug: string): Promise<PageConfig> {
  return loadJsonContent(`pages/${slug}.json`, PageConfigSchema);
}

/**
 * Get all page slugs
 */
export function getAllPageSlugs(): string[] {
  return getJsonFiles('pages');
}

/**
 * Check if a page exists
 */
export function pageExists(slug: string): boolean {
  return getAllPageSlugs().includes(slug);
}
