import axios from 'axios';
import { TokenService } from '../auth/tokenService';
import { decrypt } from '../crypto/encryption';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dataverse API service for handling authenticated requests using stored tokens
 */
export class DataverseApiService {
  private static readonly DATAVERSE_URL = process.env.DATAVERSE_URL!;
  private static readonly CLIENT_ID = process.env.DATAVERSE_CLIENT_ID!;
  private static readonly CLIENT_SECRET = process.env.DATAVERSE_CLIENT_SECRET!;
  private static readonly TENANT_ID = process.env.DATAVERSE_TENANT_ID!;
  private static readonly SCOPE = process.env.DATAVERSE_SCOPE || 'https://*.crm.dynamics.com/.default';

  /**
   * Get a valid access token for the given user
   */
  static async getAccessToken(userId: number): Promise<string> {
    try {
      const tokenData = await TokenService.getValidToken(userId, 'dataverse');

      if (!tokenData || !tokenData.accessToken) {
        throw new Error('No valid Dataverse access token found');
      }

      return tokenData.accessToken;
    } catch (error) {
      console.error('Failed to retrieve Dataverse token:', error);
      throw error;
    }
  }

  /**
   * Generic Dataverse GET query
   */
  static async query(entity: string, options?: { top?: number; select?: string[]; filter?: string }) {
    try {
      // Default to system user if needed
      const userId = 1;
      const accessToken = await this.getAccessToken(userId);

      let url = `${this.DATAVERSE_URL}/api/data/v9.2/${entity}`;
      const params: string[] = [];

      if (options?.top) params.push(`$top=${options.top}`);
      if (options?.select) params.push(`$select=${options.select.join(',')}`);
      if (options?.filter) params.push(`$filter=${options.filter}`);

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.value || [];
    } catch (error) {
      console.error('Error querying Dataverse:', error);
      throw error;
    }
  }

  /**
   * Create a new record in Dataverse
   */
  static async createRecord(entity: string, data: Record<string, any>) {
    try {
      const userId = 1;
      const accessToken = await this.getAccessToken(userId);

      const response = await axios.post(
        `${this.DATAVERSE_URL}/api/data/v9.2/${entity}`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating record in Dataverse:', error);
      throw error;
    }
  }

  /**
   * Update an existing record in Dataverse
   */
  static async updateRecord(entity: string, id: string, data: Record<string, any>) {
    try {
      const userId = 1;
      const accessToken = await this.getAccessToken(userId);

      await axios.patch(
        `${this.DATAVERSE_URL}/api/data/v9.2/${entity}(${id})`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      return { success: true };
    } catch (error) {
      console.error('Error updating record in Dataverse:', error);
      throw error;
    }
  }

  /**
   * Delete a record in Dataverse
   */
  static async deleteRecord(entity: string, id: string) {
    try {
      const userId = 1;
      const accessToken = await this.getAccessToken(userId);

      await axios.delete(`${this.DATAVERSE_URL}/api/data/v9.2/${entity}(${id})`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting record in Dataverse:', error);
      throw error;
    }
  }
}
