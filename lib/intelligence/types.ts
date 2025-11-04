/**
 * Intelligence & Insights Layer — Type Definitions (Apex Standard)
 * 
 * Phase 5.3 TypeScript contracts for dashboard with Zod validation.
 * All types are production-ready and aligned with API specifications.
 * 
 * @module lib/intelligence/types
 * @see docs/PHASE5_IMPLEMENTATION_PLAN.md
 */

import { z } from "zod";

// ============================================================================
// TIME RANGE & FILTERS
// ============================================================================

export type TimeRangeKey = '7d' | '14d' | '30d' | 'qtd' | 'ytd' | 'custom';

export type DashboardView = 'executive' | 'sales' | 'marketing' | 'ops';

export interface TimeRange {
  key: TimeRangeKey;
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface DashboardFilters {
  view: DashboardView;
  range: TimeRangeKey;
  customStart?: string;
  customEnd?: string;
}

// ============================================================================
// METRICS & KPIs
// ============================================================================

export interface MetricPoint {
  t: string; // ISO 8601 timestamp or relative label ("-6", "-5", "0")
  v: number;
}

export interface Delta {
  value: number; // Percentage change
  direction: 'up' | 'down' | 'flat';
}

export interface KpiTileDTO {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  delta?: Delta;
  series?: MetricPoint[]; // For sparkline (30 points recommended)
  target?: number;
  tooltip?: string;
}

export interface KpiGroupDTO {
  tiles: KpiTileDTO[];
}

// ============================================================================
// REVENUE & PIPELINE
// ============================================================================

export interface RevenueTrajectoryDTO {
  series: MetricPoint[]; // Historical data
  forecast: MetricPoint[]; // Predicted future values
}

export type PipelineStage = 'MQL' | 'SQL' | 'Demo' | 'Proposal' | 'Commit' | 'ClosedWon' | 'ClosedLost';

export interface PipelineStageData {
  stage: PipelineStage;
  count: number;
  value: number; // Dollar value
  conversionToNext?: number; // Conversion rate to next stage (0-1)
}

export interface PipelineHealthDTO {
  stages: PipelineStageData[];
  totalValue: number;
  totalCount: number;
  averageDealSize: number;
  velocity: number; // Days to close
}

// ============================================================================
// CHANNELS & CONTENT
// ============================================================================

export type ChannelType = 'linkedin' | 'x' | 'blog' | 'email' | 'youtube';

export interface ChannelPerf {
  channel: ChannelType;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate (0-1)
  leads: number;
  cost: number; // USD
  roi: number; // Return on investment (multiplier)
}

export interface ChannelPerformanceDTO {
  channels: ChannelPerf[];
  topPerformer: ChannelType;
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
}

// ============================================================================
// AGENTS & UTILIZATION
// ============================================================================

export type AgentType = 'Strategy' | 'Copy' | 'Visual' | 'Video';

export interface AgentUtilization {
  agent: AgentType;
  seconds: number;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
}

export interface AgentUtilizationDTO {
  agents: AgentUtilization[];
  totalSeconds: number;
  totalCost: number;
  averageLatency: number; // Milliseconds
  p95Latency: number;
}

// ============================================================================
// CAMPAIGNS
// ============================================================================

export type CampaignStatus = 'draft' | 'running' | 'paused' | 'completed' | 'error';

export interface CampaignRow {
  id: string;
  name: string;
  owner: string;
  status: CampaignStatus;
  ctr: number; // Click-through rate (0-1)
  cvr: number; // Conversion rate (0-1)
  cost: number; // USD
  roi: number; // Return on investment (multiplier)
  ageDays: number;
}

export interface CampaignListDTO {
  rows: CampaignRow[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// RISKS & ANOMALIES
// ============================================================================

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

export type RiskEntityType = 'campaign' | 'asset' | 'agent' | 'channel';

export interface RiskItem {
  id: string;
  severity: RiskSeverity;
  title: string;
  detail: string;
  entityType: RiskEntityType;
  entityId: string;
  recommendedAction?: string;
  createdAt: string; // ISO 8601
}

export interface RiskListDTO {
  risks: RiskItem[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

// ============================================================================
// LIVE EVENTS
// ============================================================================

export interface LiveEvent {
  t: string; // ISO 8601 timestamp
  msg: string;
  entityType?: RiskEntityType;
  entityId?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
}

export interface LiveEventsDTO {
  events: LiveEvent[];
  lastUpdated: string;
}

// ============================================================================
// DASHBOARD KPI BUNDLE (MAIN API RESPONSE)
// ============================================================================

export interface DashboardKPIsDTO {
  tiles: KpiTileDTO[];
  revenueTrajectory: RevenueTrajectoryDTO;
  pipeline: PipelineStageData[];
  channels: ChannelPerf[];
  agents: AgentUtilization[];
  campaigns: CampaignListDTO;
  risks: RiskItem[];
  events: LiveEvent[];
  metadata: {
    view: DashboardView;
    range: TimeRangeKey;
    generatedAt: string;
    source: 'live' | 'cache';
    stale?: boolean;
    cacheAge?: number; // Seconds
  };
}

// ============================================================================
// TELEMETRY & INTELLIGENCE EVENTS
// ============================================================================

export type EventType =
  | 'AgentTaskCompleted'
  | 'PromptPerformance'
  | 'PublishingStatus'
  | 'CampaignSummary'
  | 'DebugTrace'
  | 'InfoLog'
  | 'ErrorLog';

export type EventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info' | 'debug';

export interface IntelligenceEvent {
  id: string;
  eventType: EventType;
  entityType: string;
  entityId: string;
  payload: Record<string, any>;
  severity: EventSeverity;
  createdAt: string;
  tenantId: string;
}

export interface TelemetryCollectorConfig {
  batchSize: number;
  flushInterval: number; // Milliseconds
  sampling: {
    critical: number; // 1.0 = 100%
    high: number;
    medium: number;
    low: number;
    info: number;
    debug: number;
  };
}

// ============================================================================
// PROMPT PERFORMANCE & LEARNING
// ============================================================================

export interface PromptPerformance {
  id: string;
  campaignId: string;
  promptText: string;
  variantId?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cvr: number;
  avgTimeOnPage?: number;
  bounceRate?: number;
  rewardScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningUpdate {
  promptId: string;
  variantId: string;
  rewardScore: number;
  confidence: number; // 0-1
  sampleSize: number;
  shouldPromote: boolean;
  shouldRollback: boolean;
  reason: string;
}

export interface RewardConfig {
  ctrWeight: number;
  cvrWeight: number;
  engagementWeight: number;
  costPenalty: number;
  minSampleSize: number;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface DashboardKPIsRequest {
  view: DashboardView;
  range: TimeRangeKey;
  customStart?: string;
  customEnd?: string;
}

export interface CampaignListRequest {
  sort?: keyof CampaignRow;
  dir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  status?: CampaignStatus;
}

export interface RiskListRequest {
  severity?: RiskSeverity;
  entityType?: RiskEntityType;
  limit?: number;
}

export interface ExportRequest {
  view: DashboardView;
  range: TimeRangeKey;
  format: 'png' | 'pdf';
}

export interface ExportResponse {
  url: string; // Signed URL
  expiresAt: string;
}

export interface ShareRequest {
  view: DashboardView;
  range: TimeRangeKey;
  expiresIn: number; // Seconds
}

export interface ShareResponse {
  token: string;
  url: string;
  expiresAt: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface APIError {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface ValidationError extends APIError {
  fields: Record<string, string[]>;
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export interface FeatureFlags {
  DASHBOARD_MOCK: boolean;
  TELEMETRY_ENABLED: boolean;
  LEARNING_ENABLED: boolean;
  EXPORT_ENABLED: boolean;
  SHARE_ENABLED: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isKpiTileDTO(value: any): value is KpiTileDTO {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.label === 'string' &&
    (typeof value.value === 'string' || typeof value.value === 'number')
  );
}

export function isCampaignRow(value: any): value is CampaignRow {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.status === 'string'
  );
}

export function isRiskItem(value: any): value is RiskItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.severity === 'string' &&
    typeof value.title === 'string'
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const TIME_RANGES: Record<TimeRangeKey, string> = {
  '7d': 'Last 7 days',
  '14d': 'Last 14 days',
  '30d': 'Last 30 days',
  qtd: 'Quarter to date',
  ytd: 'Year to date',
  custom: 'Custom range',
};

export const DASHBOARD_VIEWS: Record<DashboardView, string> = {
  executive: 'Executive',
  sales: 'Sales',
  marketing: 'Marketing',
  ops: 'Ops/IT',
};

export const PIPELINE_STAGES: Record<PipelineStage, string> = {
  MQL: 'Marketing Qualified Lead',
  SQL: 'Sales Qualified Lead',
  Demo: 'Demo Scheduled',
  Proposal: 'Proposal Sent',
  Commit: 'Committed',
  ClosedWon: 'Closed Won',
  ClosedLost: 'Closed Lost',
};

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  blog: 'Blog',
  email: 'Email',
  youtube: 'YouTube',
};

export const AGENT_LABELS: Record<AgentType, string> = {
  Strategy: 'Strategy Agent',
  Copy: 'Copy Agent',
  Visual: 'Visual Agent',
  Video: 'Video Agent',
};

export const RISK_SEVERITY_COLORS: Record<RiskSeverity, string> = {
  critical: '#FF4757',
  high: '#FFB020',
  medium: '#FFC857',
  low: '#93A4BD',
};

export const CAMPAIGN_STATUS_COLORS: Record<CampaignStatus, string> = {
  draft: '#93A4BD',
  running: '#00E1C6',
  paused: '#FFB020',
  completed: '#14E08E',
  error: '#FF4757',
};

// ============================================================================
// APEX STANDARD ZOD SCHEMAS
// ============================================================================

export const KpiSchema = z.object({
  label: z.string(),
  value: z.number(),
  deltaPct: z.number(),          // +/- %
  trend: z.array(z.number()),    // sparkline values
  target: z.number().nullable(), // optional
  unit: z.enum(["$","%","num","hrs"]).default("num"),
  intent: z.enum(["good","bad","neutral"]).default("neutral")
});

export const ExecKpisSchema = z.object({
  revenue: KpiSchema,
  pipeline: KpiSchema,
  winRate: KpiSchema,
  cycleTime: KpiSchema,
  costs: KpiSchema,
  nrr: KpiSchema
});

export const SalesKpisSchema = z.object({
  quotaAttainment: KpiSchema,
  meetings: KpiSchema,
  aov: KpiSchema,
  coverage: KpiSchema
});

export const MarketingKpisSchema = z.object({
  mql: KpiSchema,
  cpl: KpiSchema,
  webVisitors: KpiSchema,
  convRate: KpiSchema
});

export const OpsKpisSchema = z.object({
  uptime: KpiSchema,
  incidents: KpiSchema,
  mttr: KpiSchema
});

export const SupportKpisSchema = z.object({
  csat: KpiSchema,
  firstResponse: KpiSchema,
  backlog: KpiSchema
});

export const ViewPayloadSchema = z.object({
  exec: ExecKpisSchema,
  sales: SalesKpisSchema,
  marketing: MarketingKpisSchema,
  ops: OpsKpisSchema,
  support: SupportKpisSchema,
  meta: z.object({
    lastUpdatedIso: z.string(),
    sample: z.boolean().default(true)
  })
});

export type Kpi = z.infer<typeof KpiSchema>;
export type ViewPayload = z.infer<typeof ViewPayloadSchema>;
export type ExecKpis = z.infer<typeof ExecKpisSchema>;
export type SalesKpis = z.infer<typeof SalesKpisSchema>;
export type MarketingKpis = z.infer<typeof MarketingKpisSchema>;
export type OpsKpis = z.infer<typeof OpsKpisSchema>;
export type SupportKpis = z.infer<typeof SupportKpisSchema>;

// ============================================================================
// MOCK DATA FLAG
// ============================================================================

export const DASHBOARD_MOCK = process.env.NEXT_PUBLIC_DASHBOARD_MOCK === '1' || process.env.DASHBOARD_MOCK === '1';
