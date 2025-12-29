import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function for merging Tailwind CSS class names
 * Simplified version without tailwind-merge to avoid dependency
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
