/**
 * Token Refresh Service for ApexSalesAI
 * 
 * Handles automatic refresh of OAuth tokens for various integrations
 * (HubSpot, Microsoft 365, etc.) before they expire
 */

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import { withRetry, DEFAULT_RETRY_CONFIG } from './error-handling';

// Initialize Prisma client
const prisma = new PrismaClient();

interface TokenData {
  id: number;
  provider: string;
  access_token: string;
  refresh_token?: string | null;
  expires_at: Date;
}

interface RefreshResult {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
  error?: string;
}

export class TokenRefreshService {
  /**
   * Check if a token needs refreshing (expires within the buffer period)
   */
  private needsRefresh(token: TokenData, bufferMinutes: number = 10): boolean {
    const now = new Date();
    const bufferMs = bufferMinutes * 60 * 1000;
    const expiryWithBuffer = new Date(token.expires_at.getTime() - bufferMs);
    
    return now >= expiryWithBuffer;
  }
  
  /**
   * Refresh a HubSpot token
   */
  private async refreshHubSpotToken(token: TokenData): Promise<RefreshResult> {
    if (!token.refresh_token) {
      return {
        success: false,
        error: 'No refresh token available for HubSpot'
      };
    }
    
    try {
      const hubspotClientId = process.env.HUBSPOT_CLIENT_ID;
      const hubspotClientSecret = process.env.HUBSPOT_CLIENT_SECRET;
      
      if (!hubspotClientId || !hubspotClientSecret) {
        throw new Error('Missing HubSpot client credentials in environment');
      }
      
      // Call HubSpot OAuth refresh endpoint
      const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: hubspotClientId,
          client_secret: hubspotClientSecret,
          refresh_token: token.refresh_token
        })
      });
      
      if (!response.ok) {
        throw new Error(`HubSpot refresh failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Calculate new expiry time (typically 6 hours for HubSpot)
      const expiresInSeconds = data.expires_in || 21600; // Default to 6 hours
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
      
      return {
        success: true,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: expiresAt
      };
    } catch (error) {
      logger.error('Failed to refresh HubSpot token', error instanceof Error ? error : new Error(String(error)), {
        context: 'token_refresh',
        metadata: { provider: 'hubspot' }
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Refresh a Microsoft 365 token
   */
  private async refreshMicrosoft365Token(token: TokenData): Promise<RefreshResult> {
    if (!token.refresh_token) {
      return {
        success: false,
        error: 'No refresh token available for Microsoft 365'
      };
    }
    
    try {
      const msClientId = process.env.MICROSOFT_CLIENT_ID;
      const msClientSecret = process.env.MICROSOFT_CLIENT_SECRET;
      const msTenantId = process.env.MICROSOFT_TENANT_ID;
      
      if (!msClientId || !msClientSecret || !msTenantId) {
        throw new Error('Missing Microsoft 365 client credentials in environment');
      }
      
      // Call Microsoft OAuth refresh endpoint
      const response = await fetch(`https://login.microsoftonline.com/${msTenantId}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: msClientId,
          client_secret: msClientSecret,
          refresh_token: token.refresh_token,
          scope: 'https://graph.microsoft.com/.default'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Microsoft 365 refresh failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Calculate new expiry time
      const expiresInSeconds = data.expires_in || 3600; // Default to 1 hour
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
      
      return {
        success: true,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: expiresAt
      };
    } catch (error) {
      logger.error('Failed to refresh Microsoft 365 token', error instanceof Error ? error : new Error(String(error)), {
        context: 'token_refresh',
        metadata: { provider: 'microsoft365' }
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Update token in database with new values
   */
  private async updateTokenInDatabase(tokenId: number, refreshResult: RefreshResult): Promise<boolean> {
    try {
      await prisma.authToken.update({
        where: { id: tokenId },
        data: {
          access_token: refreshResult.access_token!,
          refresh_token: refreshResult.refresh_token,
          expires_at: refreshResult.expires_at!,
          updated_at: new Date()
        }
      });
      
      return true;
    } catch (error) {
      logger.error('Failed to update token in database', error instanceof Error ? error : new Error(String(error)), {
        context: 'token_refresh',
        metadata: { tokenId }
      });
      
      return false;
    }
  }
  
  /**
   * Get a valid token for the specified provider and user
   * Will automatically refresh if needed
   */
  async getValidToken(provider: string, userId: number, tenantId: number): Promise<string | null> {
    try {
      // Find token in database
      const token = await prisma.authToken.findFirst({
        where: {
          provider,
          userId,
          tenantId
        }
      });
      
      if (!token) {
        logger.warn(`No ${provider} token found for user ${userId}`, {
          context: 'token_refresh',
          metadata: { provider, userId, tenantId }
        });
        return null;
      }
      
      // Check if token needs refreshing
      if (this.needsRefresh(token)) {
        logger.info(`Refreshing ${provider} token for user ${userId}`, {
          context: 'token_refresh',
          metadata: { provider, userId, tokenId: token.id }
        });
        
        // Refresh token with retry logic
        const refreshResult = await withRetry(
          async () => {
            switch (provider.toLowerCase()) {
              case 'hubspot':
                return this.refreshHubSpotToken(token);
              case 'microsoft365':
              case 'ms365':
              case 'office365':
                return this.refreshMicrosoft365Token(token);
              default:
                throw new Error(`Unsupported provider: ${provider}`);
            }
          },
          DEFAULT_RETRY_CONFIG,
          `refresh ${provider} token`
        );
        
        if (!refreshResult.success) {
          logger.error(`Failed to refresh ${provider} token`, new Error(refreshResult.error || 'Unknown error'), {
            context: 'token_refresh',
            metadata: { provider, userId, tokenId: token.id }
          });
          return null;
        }
        
        // Update token in database
        const updateSuccess = await this.updateTokenInDatabase(token.id, refreshResult);
        if (!updateSuccess) {
          logger.error(`Failed to update ${provider} token in database`, refreshResult.error ? new Error(refreshResult.error) : undefined, {
            context: 'token_refresh',
            metadata: { provider, userId, tokenId: token.id }
          });
          return null;
        }
        
        logger.info(`Successfully refreshed ${provider} token`, {
          context: 'token_refresh',
          metadata: { provider, userId, tokenId: token.id }
        });
        
        return refreshResult.access_token!;
      }
      
      // Token is still valid
      return token.access_token;
    } catch (error) {
      logger.error(`Error getting valid ${provider} token`, error instanceof Error ? error : new Error(String(error)), {
        context: 'token_refresh',
        metadata: { provider, userId, tenantId }
      });
      
      return null;
    }
  }
  
  /**
   * Check and refresh all tokens that are about to expire
   * This can be run as a scheduled job
   */
  async refreshAllExpiringTokens(bufferMinutes: number = 30): Promise<{ success: number; failed: number }> {
    const results = { success: 0, failed: 0 };
    
    try {
      // Calculate the expiry threshold
      const expiryThreshold = new Date(Date.now() + bufferMinutes * 60 * 1000);
      
      // Find all tokens that will expire soon
      const expiringTokens = await prisma.authToken.findMany({
        where: {
          expires_at: {
            lt: expiryThreshold
          }
        }
      });
      
      logger.info(`Found ${expiringTokens.length} tokens expiring within ${bufferMinutes} minutes`, {
        context: 'token_refresh_job',
        metadata: { bufferMinutes, tokenCount: expiringTokens.length }
      });
      
      // Process each token
      for (const token of expiringTokens) {
        try {
          // Refresh token based on provider
          let refreshResult: RefreshResult;
          
          switch (token.provider.toLowerCase()) {
            case 'hubspot':
              refreshResult = await this.refreshHubSpotToken(token);
              break;
            case 'microsoft365':
            case 'ms365':
            case 'office365':
              refreshResult = await this.refreshMicrosoft365Token(token);
              break;
            default:
              logger.warn(`Skipping unsupported provider: ${token.provider}`, {
                context: 'token_refresh_job',
                metadata: { tokenId: token.id, provider: token.provider }
              });
              continue;
          }
          
          if (refreshResult.success) {
            // Update token in database
            const updateSuccess = await this.updateTokenInDatabase(token.id, refreshResult);
            
            if (updateSuccess) {
              results.success++;
              logger.info(`Successfully refreshed ${token.provider} token`, {
                context: 'token_refresh_job',
                metadata: { tokenId: token.id, provider: token.provider }
              });
            } else {
              results.failed++;
              logger.error(`Failed to update ${token.provider} token in database`, new Error('Database update failed'), {
                context: 'token_refresh_job',
                metadata: { tokenId: token.id, provider: token.provider }
              });
            }
          } else {
            results.failed++;
            logger.error(`Failed to refresh ${token.provider} token`, new Error(refreshResult.error || 'Unknown error'), {
              context: 'token_refresh_job',
              metadata: { tokenId: token.id, provider: token.provider }
            });
          }
        } catch (error) {
          results.failed++;
          logger.error(`Error processing token ${token.id}`, error instanceof Error ? error : new Error(String(error)), {
            context: 'token_refresh_job',
            metadata: { tokenId: token.id, provider: token.provider }
          });
        }
      }
      
      logger.info(`Token refresh job completed: ${results.success} succeeded, ${results.failed} failed`, {
        context: 'token_refresh_job',
        metadata: results
      });
      
      return results;
    } catch (error) {
      logger.error('Error in token refresh job', error instanceof Error ? error : new Error(String(error)), {
        context: 'token_refresh_job'
      });
      
      return results;
    }
  }
}
