import { loadJsonContent } from './content.loader';
import { SiteConfigSchema, NavigationConfigSchema, SocialConfigSchema } from '../schemas';
import type { SiteConfig, NavigationConfig, SocialConfig } from '../schemas';

/**
 * Load site configuration
 */
export async function loadSiteConfig(): Promise<SiteConfig> {
  return loadJsonContent('site.json', SiteConfigSchema);
}

/**
 * Load navigation configuration
 */
export async function loadNavigationConfig(): Promise<NavigationConfig> {
  return loadJsonContent('nav.json', NavigationConfigSchema);
}

/**
 * Load social sharing configuration
 */
export async function loadSocialConfig(): Promise<SocialConfig> {
  return loadJsonContent('social.json', SocialConfigSchema);
}
