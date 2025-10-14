/**
 * Microsoft Dataverse API Service
 * Handles authentication and data retrieval from Dataverse CRM
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  DataverseToken, 
  DataverseConfig, 
  DataverseRecord, 
  DataverseQueryOptions, 
  DataverseQueryResponse 
} from './types';
import { TokenService } from '@lib/services/auth/tokenService';
import { ErrorLogger } from '@lib/utils/errorLogger';

export class DataverseApiService {
  private axiosInstance: AxiosInstance;
  private config: DataverseConfig;
  private token: DataverseToken | null = null;
  private baseUrl: string;
  private userId: number;

  constructor(config: DataverseConfig) {
    this.config = config;
    // Use provided userId or default to system user (ID: 1)
    this.userId = config.userId ?? 1;
    this.baseUrl = `${config.resourceUrl}/api/data/v${config.apiVersion}`;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0'
      }
    });

    // Add request interceptor to handle token refresh
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Ensure we have a valid token
        const token = await this.getValidToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token.access_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 Unauthorized and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Force token refresh
            const token = await this.getValidToken(true);
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token.access_token}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            ErrorLogger.logWindsurfError(
              'DataverseApiService', 
              'Token refresh failed', 
              { error: refreshError }
            );
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get a valid token, refreshing if necessary
   */
  private async getValidToken(forceRefresh = false): Promise<DataverseToken | null> {
    try {
      // TokenService.getValidToken handles both retrieval and automatic refresh
      const tokenData = await TokenService.getValidToken(this.userId, 'dataverse');
      
      // Map TokenService response to DataverseToken format
      this.token = {
        access_token: tokenData.accessToken,
        refresh_token: '', // Not needed as TokenService manages this internally
        expires_in: Math.floor((tokenData.expiresAt.getTime() - Date.now()) / 1000),
        expires_at: tokenData.expiresAt.getTime(),
        token_type: 'Bearer',
        scope: tokenData.environmentUrl || this.config.resourceUrl,
      };
      
      return this.token;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        'Failed to get valid token', 
        { error }
      );
      return null;
    }
  }

  /**
   * Query Dataverse entities
   */
  async query<T = DataverseRecord>(
    entitySetName: string, 
    options: DataverseQueryOptions = {}
  ): Promise<DataverseQueryResponse<T>> {
    try {
      // Build query parameters
      const params: Record<string, string> = {};
      
      if (options.select && options.select.length > 0) {
        params['$select'] = options.select.join(',');
      }
      
      if (options.filter) {
        params['$filter'] = options.filter;
      }
      
      if (options.orderBy) {
        params['$orderby'] = options.orderBy;
      }
      
      if (options.top) {
        params['$top'] = options.top.toString();
      }
      
      if (options.skip) {
        params['$skip'] = options.skip.toString();
      }
      
      if (options.expand && options.expand.length > 0) {
        params['$expand'] = options.expand.join(',');
      }
      
      // Make API request
      const response = await this.axiosInstance.get<DataverseQueryResponse<T>>(
        `/${entitySetName}`,
        { params }
      );
      
      return response.data;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        `Failed to query ${entitySetName}`, 
        { error, options }
      );
      throw error;
    }
  }

  /**
   * Get a single record by ID
   */
  async getById<T = DataverseRecord>(
    entitySetName: string, 
    id: string, 
    select?: string[]
  ): Promise<T> {
    try {
      const params: Record<string, string> = {};
      
      if (select && select.length > 0) {
        params['$select'] = select.join(',');
      }
      
      const response = await this.axiosInstance.get<T>(
        `/${entitySetName}(${id})`,
        { params }
      );
      
      return response.data;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        `Failed to get ${entitySetName} by ID ${id}`, 
        { error }
      );
      throw error;
    }
  }

  /**
   * Create a new record
   */
  async create<T = DataverseRecord>(
    entitySetName: string, 
    data: Partial<T>
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(
        `/${entitySetName}`,
        data
      );
      
      return response.data;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        `Failed to create ${entitySetName}`, 
        { error, data }
      );
      throw error;
    }
  }

  /**
   * Update an existing record
   */
  async update<T = DataverseRecord>(
    entitySetName: string, 
    id: string, 
    data: Partial<T>
  ): Promise<void> {
    try {
      await this.axiosInstance.patch(
        `/${entitySetName}(${id})`,
        data
      );
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        `Failed to update ${entitySetName} with ID ${id}`, 
        { error, data }
      );
      throw error;
    }
  }

  /**
   * Delete a record
   */
  async delete(
    entitySetName: string, 
    id: string
  ): Promise<void> {
    try {
      await this.axiosInstance.delete(
        `/${entitySetName}(${id})`
      );
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        `Failed to delete ${entitySetName} with ID ${id}`, 
        { error }
      );
      throw error;
    }
  }

  /**
   * Execute a custom action
   */
  async executeAction<TRequest, TResponse>(
    actionName: string,
    data: TRequest
  ): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.post<TResponse>(
        `/${actionName}`,
        data
      );
      
      return response.data;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'DataverseApiService', 
        `Failed to execute action ${actionName}`, 
        { error, data }
      );
      throw error;
    }
  }
}
