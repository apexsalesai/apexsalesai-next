import crypto from 'crypto';

// Encryption constants
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16 bytes
const TAG_LENGTH = 16; // For GCM mode
const SALT_LENGTH = 64;
const KEY_LENGTH = 32; // 256 bits

/**
 * Get the encryption key from environment or generate one
 * In production, this should be stored in a secure environment variable
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    console.warn('ENCRYPTION_KEY not found in environment variables. Using fallback key for development only.');
    // In development, use a consistent key for testing
    // In production, this should be replaced with a secure key from environment variables
    return crypto.scryptSync('apex-ai-revenue-operator-dev-key', 'salt', KEY_LENGTH);
  }
  
  // If key is provided as hex string, convert to buffer
  if (key.length === KEY_LENGTH * 2) {
    return Buffer.from(key, 'hex');
  }
  
  // If key is provided as base64, convert to buffer
  return Buffer.from(key, 'base64');
}

/**
 * Encrypt a string value
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:tag:encrypted
 */
export function encrypt(text: string): string {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Get the encryption key
  const key = getEncryptionKey();
  
  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get the authentication tag
  const tag = cipher.getAuthTag();
  
  // Return IV, tag, and encrypted text as a single string
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt an encrypted string
 * @param encryptedText - Encrypted string in format: iv:tag:encrypted
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  // Split the encrypted text into IV, tag, and encrypted data
  const parts = encryptedText.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  // Get the encryption key
  const key = getEncryptionKey();
  
  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  // Decrypt the text
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate a secure random encryption key
 * Use this to generate a new key for production environments
 * @returns Encryption key in hex format
 */
export function generateEncryptionKey(): string {
  const key = crypto.randomBytes(KEY_LENGTH);
  return key.toString('hex');
}
