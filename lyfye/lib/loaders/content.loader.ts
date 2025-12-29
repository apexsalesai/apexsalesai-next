import fs from 'fs';
import path from 'path';
import { ZodSchema } from 'zod';

/**
 * Generic JSON content loader with Zod validation
 * Loads JSON files and validates them against a Zod schema
 * Throws clear errors if validation fails
 */
export async function loadJsonContent<T>(
  filePath: string,
  schema: ZodSchema<T>
): Promise<T> {
  const contentDir = path.join(process.cwd(), 'content');
  const fullPath = path.join(contentDir, filePath);

  try {
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Content file not found: ${filePath}`);
    }

    // Read file
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse JSON
    let data: unknown;
    try {
      data = JSON.parse(fileContents);
    } catch (error) {
      throw new Error(`Invalid JSON in file: ${filePath}\n${error}`);
    }

    // Validate against schema
    const result = schema.safeParse(data);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(
        `Schema validation failed for ${filePath}:\n${errorMessage}`
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load content from ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Load multiple JSON files from a directory
 */
export async function loadJsonDirectory<T>(
  dirPath: string,
  schema: ZodSchema<T>
): Promise<T[]> {
  const contentDir = path.join(process.cwd(), 'content', dirPath);

  try {
    if (!fs.existsSync(contentDir)) {
      throw new Error(`Content directory not found: ${dirPath}`);
    }

    const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.json'));

    const contents = await Promise.all(
      files.map((file) => loadJsonContent(path.join(dirPath, file), schema))
    );

    return contents;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load directory ${dirPath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get list of JSON files in a directory
 */
export function getJsonFiles(dirPath: string): string[] {
  const contentDir = path.join(process.cwd(), 'content', dirPath);

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''));
}

/**
 * Calculate reading time for blog content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
