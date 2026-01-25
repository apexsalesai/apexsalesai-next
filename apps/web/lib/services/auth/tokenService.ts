import { PrismaClient, AuthToken } from '@prisma/client';
import axios from 'axios';
import { encrypt, decrypt } from '@lib/services/crypto/encryption';
import * as msal from '@azure/msal-node';
import { AuthTokenWithMetadata, TokenStorageParams, OAuthTokenResponse, DataverseTokenMetadata } from 'types/auth';

const prisma = new PrismaClient();

/**
 * Service for managing OAuth tokens with secure storage and automatic refresh
 * Enhanced for Microsoft Dataverse integration
 */
export class TokenService {
  private static msalConfig = {
    auth: {
      clientId: process.env.DATAVERSE_CLIENT_ID || '',
      authority: `https://login.microsoftonline.com/${process.env.DATAVERSE_TENANT_ID || 'common'}`,
      clientSecret: process.env.DATAVERSE_CLIENT_SECRET || '',
    }
  };

  private static _msalClient: msal.ConfidentialClientApplication | null = null;
  
  /**
   * Lazy initialize MSAL client to prevent build-time errors
   */
  private static get msalClient(): msal.ConfidentialClientApplication {
    if (!this._msalClient) {
      this._msalClient = new msal.ConfidentialClientApplication(this.msalConfig);
    }
    return this._msalClient;
  }

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
    environmentUrl = null,
  }: TokenStorageParams) {
    // Encrypt sensitive token data before storing
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

    // Store additional metadata for Dataverse
    const metadata = provider === 'dataverse' && environmentUrl 
      ? JSON.stringify({ environmentUrl })
      : null;

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
          // @ts-ignore - Metadata field exists in DB but not in Prisma client yet
          metadata: metadata || (existingToken as unknown as AuthTokenWithMetadata).metadata,
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
          // @ts-ignore - Metadata field exists in DB but not in Prisma client yet
          metadata,
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

    // Return decrypted access token and metadata if available
    const result: any = {
      accessToken: decrypt(token.access_token),
      expiresAt: token.expires_at,
    };

    // Add metadata for Dataverse if available
    const tokenWithMeta = token as unknown as AuthTokenWithMetadata;
    if (tokenWithMeta.metadata && provider === 'dataverse') {
      try {
        const metadata = JSON.parse(tokenWithMeta.metadata) as DataverseTokenMetadata;
        result.environmentUrl = metadata.environmentUrl;
      } catch (error) {
        console.warn('Failed to parse Dataverse metadata', error);
      }
    }

    return result;
  }

  /**
   * Refresh an expired token using the refresh token
   */
  static async refreshToken(token: AuthToken) {
    // Cast to our extended type that includes metadata
    const tokenWithMeta = token as unknown as AuthTokenWithMetadata;
    const decryptedRefreshToken = token.refresh_token ? decrypt(token.refresh_token) : null;
    
    if (!decryptedRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      let response;
      let metadata = tokenWithMeta.metadata;
      
      // Handle different OAuth providers
      switch (token.provider) {
        case 'dataverse':
          response = await this.refreshDataverseToken(decryptedRefreshToken, token);
          break;
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
          // @ts-ignore - Metadata field exists in DB but not in Prisma client yet
          metadata,
        },
      });

      const result: any = {
        accessToken: response.access_token,
        expiresAt,
      };

      // Add metadata for Dataverse if available
      if (tokenWithMeta.metadata && token.provider === 'dataverse') {
        try {
          const parsedMetadata = JSON.parse(tokenWithMeta.metadata) as DataverseTokenMetadata;
          result.environmentUrl = parsedMetadata.environmentUrl;
        } catch (error) {
          console.warn('Failed to parse Dataverse metadata', error);
        }
      }

      return result;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error(`Failed to refresh ${token.provider} token`);
    }
  }

  /**
   * Refresh a Dataverse token using MSAL
   */
  private static async refreshDataverseToken(refreshToken: string, token: AuthToken): Promise<OAuthTokenResponse> {
    try {
      // Extract environment URL from metadata if available
      let environmentUrl = null;
      const tokenWithMeta = token as unknown as AuthTokenWithMetadata;
      if (tokenWithMeta.metadata) {
        try {
          const metadata = JSON.parse(tokenWithMeta.metadata) as DataverseTokenMetadata;
          environmentUrl = metadata.environmentUrl;
        } catch (error) {
          console.warn('Failed to parse Dataverse metadata', error);
        }
      }

      // Define the scopes needed for Dataverse
      const scopes = environmentUrl 
        ? [`${environmentUrl}/.default`] 
        : ['https://orgXXXXXX.crm.dynamics.com/.default'];

      // Use MSAL to refresh the token
      const result = await this.msalClient.acquireTokenByRefreshToken({
        refreshToken,
        scopes,
      });

      if (!result) {
        throw new Error('Failed to refresh Dataverse token');
      }

      return {
        access_token: result.accessToken,
        // MSAL Node types don't include refreshToken, but it's in the response
        refresh_token: (result as any).refreshToken || refreshToken,
        expires_in: result.expiresOn ? 
          Math.floor((result.expiresOn.getTime() - new Date().getTime()) / 1000) : 
          3600,
        token_type: 'Bearer',
      };
    } catch (error) {
      console.error('Dataverse token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Initiate Dataverse OAuth flow
   * @returns Authorization URL for redirect
   */
  static getDataverseAuthUrl(redirectUri: string, state: string, environmentUrl: string): Promise<string> {
    const authCodeUrlParameters = {
      scopes: [`${environmentUrl}/.default`],
      redirectUri,
      state,
    };

    return this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  /**
   * Complete Dataverse OAuth flow by exchanging authorization code for tokens
   */
  static async completeDataverseAuth(code: string, redirectUri: string, userId: number, tenantId: number, environmentUrl: string) {
    try {
      const result = await this.msalClient.acquireTokenByCode({
        code,
        scopes: [`${environmentUrl}/.default`],
        redirectUri,
      });

      if (!result) {
        throw new Error('Failed to acquire token');
      }

      // Calculate expiry time
      const expiresAt = new Date();
      if (result.expiresOn) {
        expiresAt.setTime(result.expiresOn.getTime());
      } else {
        expiresAt.setSeconds(expiresAt.getSeconds() + 3600); // Default 1 hour
      }

      // Store the token
      await this.storeToken({
        provider: 'dataverse',
        accessToken: result.accessToken,
        refreshToken: (result as any).refreshToken || null,
        expiresAt,
        userId,
        tenantId,
        environmentUrl,
      });

      return {
        success: true,
        environmentUrl,
      };
    } catch (error) {
      console.error('Error completing Dataverse auth:', error);
      throw error;
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
