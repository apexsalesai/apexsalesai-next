/**
 * Phase 3: Dataverse Token Management
 * Handles OAuth2 Client Credentials flow for service principal authentication
 */

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Gets a valid Dataverse access token using Client Credentials flow
 * Implements token caching to avoid unnecessary auth requests
 */
export async function getDataverseToken(): Promise<string> {
  // Return cached token if still valid (with 5min buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 300000) {
    return cachedToken.token;
  }

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  const resource = process.env.DATAVERSE_RESOURCE;

  if (!tenantId || !clientId || !clientSecret || !resource) {
    throw new Error(
      'Missing Dataverse credentials. Required: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, DATAVERSE_RESOURCE'
    );
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: `${resource}/.default`,
    grant_type: 'client_credentials',
  });

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token fetch failed (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as TokenResponse;

    // Cache token with expiration
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    console.log('✅ Dataverse token acquired, expires in', data.expires_in, 'seconds');
    return data.access_token;

  } catch (error: any) {
    console.error('❌ Dataverse token fetch failed:', error.message);
    throw new Error(`Failed to get Dataverse token: ${error.message}`);
  }
}

/**
 * Clears the cached token (useful for testing or forced refresh)
 */
export function clearTokenCache(): void {
  cachedToken = null;
}
