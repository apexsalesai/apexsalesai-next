/**
 * Types for authentication and token handling
 * These types supplement the Prisma-generated types until the client can be regenerated
 */

/**
 * Extended AuthToken interface with metadata field
 * This is a temporary workaround until Prisma client can be regenerated
 */
export interface AuthTokenWithMetadata {
  id: number;
  provider: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  userId: number;
  tenantId: number;
  metadata: string | null;
}

/**
 * Provider-specific token metadata
 */
export interface DataverseTokenMetadata {
  environmentUrl: string;
}

/**
 * OAuth token response structure
 */
export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
}

/**
 * Token storage parameters
 */
export interface TokenStorageParams {
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  userId: number;
  tenantId: number;
  environmentUrl?: string | null;
}
