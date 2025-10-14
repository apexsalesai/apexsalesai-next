import axios from 'axios';
import { TokenService } from '../auth/tokenService';
import { decrypt } from '../crypto/encryption';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Dataverse API service for handling authenticated requests using stored tokens
 */
export class DataverseApi {
  /**
   * Get a valid access token for the given user
   */
  static async getAccessToken(userId: number) {
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
   * Execute a GET request to the Microsoft Dataverse API
   */
  static async get(userId: number, environmentUrl: string, endpoint: string) {
    try {
      const accessToken = await this.getAccessToken(userId);

      const response = await axios.get(`${environmentUrl}/api/data/v9.2/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Dataverse GET request failed:', error);
      throw error;
    }
  }

  /**
   * Execute a POST request to the Microsoft Dataverse API
   */
  static async post(userId: number, environmentUrl: string, endpoint: string, data: any) {
    try {
      const accessToken = await this.getAccessToken(userId);

      const response = await axios.post(`${environmentUrl}/api/data/v9.2/${endpoint}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'OData-MaxVersion': '4.0',
          'OData-Version': '4.0',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Dataverse POST request failed:', error);
      throw error;
    }
  }

  /**
   * Example utility for querying CRM Accounts
   */
  static async getAccounts(userId: number, environmentUrl: string) {
    return this.get(userId, environmentUrl, 'accounts?$select=name,accountid');
  }
}
