// API response/request types for Apex AI Operator endpoints

import { Lead, AgentAction, DashboardKPIs, FeedEvent, AgentDecision } from './agent';

export interface FeedEventsResponse {
  feed_events: FeedEvent[];
}

export interface KPIsResponse {
  success?: boolean;
  data?: {
    kpis: Array<{
      title: string;
      value: string;
      trend: string;
      badgeColor: string;
      tooltip?: string;
    }>;
    charts: Record<string, any>;
    activity: string[];
    lastUpdated: string;
    vertical: string;
  };
  
  // Support legacy structure - nested dashboard_kpis and direct properties
  dashboard_kpis?: DashboardKPIs;
  
  // Direct properties for simplified access
  meetings_booked?: number;
  emails_sent?: number;
  replies_received?: number;
  deals_closed?: number;
  revenue_generated?: number;
}

export interface TriggerAgentRequest {
  lead: Lead;
}

export interface TriggerAgentResponse {
  decision: AgentDecision;
  agent_action: AgentAction;
}
