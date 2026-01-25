/**
 * Types for Microsoft Dataverse API integration
 */

/**
 * Dataverse authentication token
 */
export interface DataverseToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number; // Timestamp when the token expires
  token_type: string;
  scope: string;
}

/**
 * Dataverse API configuration
 */
export interface DataverseConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  resourceUrl: string;
  apiVersion: string;
  environment: string;
  userId?: number; // Optional: User ID for token management (defaults to system user)
}

/**
 * Dataverse entity record
 */
export interface DataverseRecord {
  id: string;
  [key: string]: any;
}

/**
 * Dataverse query options
 */
export interface DataverseQueryOptions {
  select?: string[];
  filter?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
  expand?: string[];
}

/**
 * Dataverse query response
 */
export interface DataverseQueryResponse<T> {
  value: T[];
  '@odata.context'?: string;
  '@odata.count'?: number;
  '@odata.nextLink'?: string;
}

/**
 * KPI data structure for dashboard
 */
export interface KPIData {
  title: string;
  value: string;
  trend: string;
  badgeColor: string;
  tooltip?: string;
}

/**
 * Chart data structure for dashboard
 * Compatible with Chart.js API - supports both single colors and color arrays
 */
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    fill?: boolean;
    backgroundColor?: string | string[]; // Support both single color and array for multi-segment charts
    borderColor?: string | string[];
    pointBackgroundColor?: string | string[];
    tension?: number;
    borderDash?: number[];
  }>;
}

/**
 * Dashboard data structure
 */
export interface DashboardData {
  kpis: KPIData[];
  charts: Record<string, ChartData>;
  activity: string[];
  lastUpdated?: string; // ISO timestamp of last data refresh
  vertical?: string; // Industry vertical (realEstate, mortgage, etc.)
}

/**
 * Vertical-specific dashboard data
 */
export interface VerticalDashboardData {
  realEstate?: DashboardData;
  mortgage?: DashboardData;
  msp?: DashboardData;
  consulting?: DashboardData;
  solar?: DashboardData;
  hvac?: DashboardData;
}
