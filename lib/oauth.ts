/**
 * OAuth Utilities
 * Secure state management and token handling
 */

import crypto from 'crypto';
import { cookies } from 'next/headers';

export interface OAuthState {
  userId: string;
  platform: string;
  returnUrl?: string;
  timestamp: number;
}

/**
 * Sign OAuth state with HMAC to prevent tampering
 */
export function signState(payload: OAuthState): string {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    throw new Error('HMAC_SECRET environment variable not set');
  }
  
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
  
  return `${data}.${signature}`;
}

/**
 * Verify and decode OAuth state
 */
export function verifyState(state: string): OAuthState {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    throw new Error('HMAC_SECRET environment variable not set');
  }
  
  const parts = state.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid state format');
  }
  
  const [data, signature] = parts;
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid state signature');
  }
  
  // Decode payload
  const payload: OAuthState = JSON.parse(
    Buffer.from(data, 'base64url').toString('utf8')
  );
  
  // Check timestamp (state valid for 10 minutes)
  const now = Date.now();
  const age = now - payload.timestamp;
  if (age > 10 * 60 * 1000) {
    throw new Error('State expired');
  }
  
  return payload;
}

/**
 * Set secure HTTP-only cookie
 */
export function setAuthCookie(name: string, value: string, maxAge?: number) {
  cookies().set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAge || 60 * 60 * 24 * 7, // 7 days default
  });
}

/**
 * Get cookie value
 */
export function getAuthCookie(name: string): string | undefined {
  return cookies().get(name)?.value;
}

/**
 * Delete cookie
 */
export function deleteAuthCookie(name: string) {
  cookies().delete(name);
}

/**
 * Generate OAuth authorization URL
 */
export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  authUrl: string;
  responseType?: string;
  accessType?: string;
}

export function buildAuthUrl(config: OAuthConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state: config.state,
    response_type: config.responseType || 'code',
  });
  
  if (config.accessType) {
    params.append('access_type', config.accessType);
  }
  
  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export interface TokenExchangeConfig {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tokenUrl: string;
  grantType?: string;
}

export async function exchangeCodeForToken(
  config: TokenExchangeConfig
): Promise<any> {
  const params = new URLSearchParams({
    code: config.code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: config.grantType || 'authorization_code',
  });
  
  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }
  
  return response.json();
}

/**
 * Refresh access token
 */
export interface TokenRefreshConfig {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
}

export async function refreshAccessToken(
  config: TokenRefreshConfig
): Promise<any> {
  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  });
  
  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }
  
  return response.json();
}
