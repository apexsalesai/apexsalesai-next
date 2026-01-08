import { prisma } from './prisma';

// HubSpot OAuth configuration
const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID || '';
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET || '';
const HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI || 'http://localhost:3000/install';
const HUBSPOT_SCOPES = 'crm.objects.contacts.read crm.objects.contacts.write crm.objects.companies.read crm.objects.companies.write crm.objects.deals.read crm.objects.deals.write';

/**
 * Generate the HubSpot authorization URL
 */
export function getHubSpotAuthUrl(): string {
  return `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(HUBSPOT_REDIRECT_URI)}&scope=${encodeURIComponent(HUBSPOT_SCOPES)}`;
}

/**
 * Exchange an authorization code for an access token
 */
export async function exchangeCodeForToken(code: string, tenantId: number, userId: number) {
  try {
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URI,
        code,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HubSpot API error: ${errorData.message || response.statusText}`);
    }

    const tokenData = await response.json();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    // Store token in database
    const authToken = await prisma.authToken.create({
      data: {
        provider: 'hubspot',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
        userId,
        tenantId,
      },
    });

    return {
      ...authToken,
      token_type: tokenData.token_type,
    };
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Refresh an expired access token
 */
export async function refreshToken(refreshToken: string, tokenId: number) {
  try {
    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HubSpot API error: ${errorData.message || response.statusText}`);
    }

    const tokenData = await response.json();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    // Update token in database
    const updatedToken = await prisma.authToken.update({
      where: { id: tokenId },
      data: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
        updated_at: new Date(),
      },
    });

    return updatedToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

/**
 * Get the current HubSpot token for a tenant
 */
export async function getHubSpotToken(tenantId: number) {
  try {
    const token = await prisma.authToken.findFirst({
      where: {
        tenantId,
        provider: 'hubspot',
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!token) {
      return null;
    }

    // Check if token is expired and needs refreshing
    if (token.expires_at < new Date() && token.refresh_token) {
      return refreshToken(token.refresh_token, token.id);
    }

    return token;
  } catch (error) {
    console.error('Error getting HubSpot token:', error);
    throw error;
  }
}

/**
 * Delete HubSpot token
 */
export async function deleteHubSpotToken(tenantId: number) {
  try {
    await prisma.authToken.deleteMany({
      where: {
        tenantId,
        provider: 'hubspot',
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting HubSpot token:', error);
    throw error;
  }
}
