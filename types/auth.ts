/**
 * Authentication and Token Management Types
 */

import { AuthToken } from '@prisma/client';

/**
 * Extended AuthToken with metadata field
 */
export interface AuthTokenWithMetadata extends AuthToken {
  metadata: string | null;
}

/**
 * Parameters for storing a new token
 */
export interface TokenStorageParams {
  provider: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date;
  userId: number;
  tenantId: number;
  environmentUrl?: string | null;
}

/**
 * OAuth token response from provider
 */
export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

/**
 * Dataverse-specific token metadata
 */
export interface DataverseTokenMetadata {
  environmentUrl: string;
  resource?: string;
}
