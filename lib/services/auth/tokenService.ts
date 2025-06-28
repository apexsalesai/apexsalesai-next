import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { encrypt, decrypt } from '../crypto/encryption';

const prisma = new PrismaClient();

/**
 * Service for managing OAuth tokens with secure storage and automatic refresh
 */
export class TokenService {
  /**
   * Store a new OAuth token in the database
   */
  static async storeToken({
    provider,
    accessToken,
    refreshToken,
    expiresAt,
    userId,
    tenantId,
  }: {
    provider: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: Date;
    userId: number;
    tenantId: number;
  }) {
    // Encrypt sensitive token data before storing
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

    // Check if a token already exists for this user and provider
    const existingToken = await prisma.authToken.findFirst({
      where: {
        provider,
        userId,
      },
    });

    if (existingToken) {
      // Update existing token
      return prisma.authToken.update({
        where: { id: existingToken.id },
        data: {
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          expires_at: expiresAt,
          updated_at: new Date(),
        },
      });
    } else {
      // Create new token
      return prisma.authToken.create({
        data: {
          provider,
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          expires_at: expiresAt,
          userId,
          tenantId,
        },
      });
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  static async getValidToken(userId: number, provider: string) {
    const token = await prisma.authToken.findFirst({
      where: {
        userId,
        provider,
      },
    });

    if (!token) {
      throw new Error(`No ${provider} token found for user ${userId}`);
    }

    // Check if token is expired or will expire in the next 5 minutes
    const now = new Date();
    const expiryBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
    const isExpired = token.expires_at.getTime() - now.getTime() < expiryBuffer;

    if (isExpired && token.refresh_token) {
      // Token is expired, attempt to refresh
      return this.refreshToken(token);
    }

    // Return decrypted access token
    return {
      accessToken: decrypt(token.access_token),
      expiresAt: token.expires_at,
    };
  }

  /**
   * Refresh an expired token using the refresh token
   */
  static async refreshToken(token: any) {
    const decryptedRefreshToken = token.refresh_token ? decrypt(token.refresh_token) : null;
    
    if (!decryptedRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      let response;
      
      // Handle different OAuth providers
      switch (token.provider) {
        case 'hubspot':
          response = await this.refreshHubSpotToken(decryptedRefreshToken);
          break;
        case 'salesforce':
          response = await this.refreshSalesforceToken(decryptedRefreshToken);
          break;
        default:
          throw new Error(`Unsupported provider: ${token.provider}`);
      }

      // Calculate new expiry time
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + response.expires_in);

      // Update token in database
      await prisma.authToken.update({
        where: { id: token.id },
        data: {
          access_token: encrypt(response.access_token),
          refresh_token: response.refresh_token ? encrypt(response.refresh_token) : token.refresh_token,
          expires_at: expiresAt,
          updated_at: new Date(),
        },
      });

      return {
        accessToken: response.access_token,
        expiresAt,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error(`Failed to refresh ${token.provider} token`);
    }
  }

  /**
   * Refresh a HubSpot token
   */
  private static async refreshHubSpotToken(refreshToken: string) {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('HubSpot client credentials not configured');
    }

    const response = await axios.post('https://api.hubapi.com/oauth/v1/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Refresh a Salesforce token
   */
  private static async refreshSalesforceToken(refreshToken: string) {
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Salesforce client credentials not configured');
    }

    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  }

  /**
   * Delete a token from the database
   */
  static async deleteToken(userId: number, provider: string) {
    return prisma.authToken.deleteMany({
      where: {
        userId,
        provider,
      },
    });
  }

  /**
   * Check if a user has a valid token for a provider
   */
  static async hasValidToken(userId: number, provider: string) {
    try {
      await this.getValidToken(userId, provider);
      return true;
    } catch (error) {
      return false;
    }
  }
}
