/**
 * Microsoft Dataverse API Client
 * 
 * Provides OAuth2 authentication and API access to Dataverse
 * for real-time campaign metrics telemetry.
 */

import { logger } from '../logger';

interface DataverseConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  resource: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  ext_expires_in: number;
}

interface DataverseEntity {
  [key: string]: any;
}

export class DataverseClient {
  private config: DataverseConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: DataverseConfig) {
    this.config = config;
  }

  /**
   * Get OAuth2 access token using client credentials flow
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Use OAuth 2.0 v1 endpoint with resource parameter for Dataverse S2S authentication
    // Dataverse requires the legacy v1 endpoint with 'resource' parameter (not 'scope')
    const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/token`;
    
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      resource: this.config.resource,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token acquisition failed: ${response.status} ${errorText}`);
      }

      const data: TokenResponse = await response.json();
      
      // Cache the token (expires in 59 minutes, cache for 55 minutes)
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in - 240) * 1000;

      logger.info('Dataverse access token acquired', {
        context: 'dataverse',
        metadata: {
          expiresIn: data.expires_in,
          tokenType: data.token_type,
        },
      });

      return this.accessToken;
    } catch (error) {
      logger.error('Failed to acquire Dataverse access token', error as Error, {
        context: 'dataverse',
      });
      throw error;
    }
  }

  /**
   * Create a new record in Dataverse
   */
  async createRecord(entitySetName: string, data: DataverseEntity): Promise<string> {
    const token = await this.getAccessToken();
    const url = `${this.config.resource}/api/data/v9.2/${entitySetName}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
          'Accept': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dataverse API error: ${response.status} ${errorText}`);
      }

      // Get the ID from the response header
      const locationHeader = response.headers.get('OData-EntityId');
      const recordId = locationHeader?.match(/\(([^)]+)\)/)?.[1] || '';

      logger.info('Dataverse record created', {
        context: 'dataverse',
        metadata: {
          entitySetName,
          recordId,
          status: response.status,
        },
      });

      return recordId;
    } catch (error) {
      logger.error('Failed to create Dataverse record', error as Error, {
        context: 'dataverse',
        metadata: {
          entitySetName,
          data,
        },
      });
      throw error;
    }
  }

  /**
   * Query records from Dataverse
   */
  async queryRecords(
    entitySetName: string,
    options?: {
      select?: string[];
      filter?: string;
      orderBy?: string;
      top?: number;
    }
  ): Promise<DataverseEntity[]> {
    const token = await this.getAccessToken();
    
    const queryParams = new URLSearchParams();
    if (options?.select) {
      queryParams.append('$select', options.select.join(','));
    }
    if (options?.filter) {
      queryParams.append('$filter', options.filter);
    }
    if (options?.orderBy) {
      queryParams.append('$orderby', options.orderBy);
    }
    if (options?.top) {
      queryParams.append('$top', options.top.toString());
    }

    const url = `${this.config.resource}/api/data/v9.2/${entitySetName}?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dataverse query error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      logger.info('Dataverse records queried', {
        context: 'dataverse',
        metadata: {
          entitySetName,
          count: data.value?.length || 0,
        },
      });

      return data.value || [];
    } catch (error) {
      logger.error('Failed to query Dataverse records', error as Error, {
        context: 'dataverse',
        metadata: {
          entitySetName,
        },
      });
      throw error;
    }
  }

  /**
   * Update an existing record in Dataverse
   */
  async updateRecord(
    entitySetName: string,
    recordId: string,
    data: DataverseEntity
  ): Promise<void> {
    const token = await this.getAccessToken();
    const url = `${this.config.resource}/api/data/v9.2/${entitySetName}(${recordId})`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dataverse update error: ${response.status} ${errorText}`);
      }

      logger.info('Dataverse record updated', {
        context: 'dataverse',
        metadata: {
          entitySetName,
          recordId,
        },
      });
    } catch (error) {
      logger.error('Failed to update Dataverse record', error as Error, {
        context: 'dataverse',
        metadata: {
          entitySetName,
          recordId,
        },
      });
      throw error;
    }
  }
}

/**
 * Create a singleton Dataverse client instance
 */
export function createDataverseClient(): DataverseClient {
  const config: DataverseConfig = {
    tenantId: process.env.DATAVERSE_TENANT_ID!,
    clientId: process.env.DATAVERSE_CLIENT_ID!,
    clientSecret: process.env.DATAVERSE_CLIENT_SECRET!,
    resource: process.env.NEXT_PUBLIC_DATAVERSE_URL!,
  };

  // Validate required environment variables
  const missing = [];
  if (!config.tenantId) missing.push('DATAVERSE_TENANT_ID');
  if (!config.clientId) missing.push('DATAVERSE_CLIENT_ID');
  if (!config.clientSecret) missing.push('DATAVERSE_CLIENT_SECRET');
  if (!config.resource) missing.push('NEXT_PUBLIC_DATAVERSE_URL');

  if (missing.length > 0) {
    throw new Error(
      `Missing required Dataverse environment variables: ${missing.join(', ')}`
    );
  }

  return new DataverseClient(config);
}
