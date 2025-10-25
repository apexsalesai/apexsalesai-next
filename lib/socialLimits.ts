/**
 * Social media character limits and text utilities
 */

export const LIMITS = { 
  linkedin: 3000, 
  x: 280 
};

export function count(text: string) {
  const chars = text.length;
  const words = (text.trim().match(/\S+/g) || []).length;
  const readingMin = Math.max(1, Math.round(words / 200));
  return { chars, words, readingMin };
}

export function enforceLimit(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max);
}
