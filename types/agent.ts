// Core TypeScript interfaces for the Apex AI Revenue Operator agent

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry: string;
  stage?: string;
  status?: string;
  confidence_score: number;
  potential_value?: number; // Added for high-value lead calculations
  created_at?: string; // ISO string
  last_contact?: string | null; // ISO string
}

export interface AgentAction {
  type: 'email_sent' | 'meeting_booked' | 'deal_closed' | 'alert' | 'task';
  timestamp: string; // ISO string
  summary: string;
}

export interface DashboardKPIs {
  // Original metrics
  closed_deals: number;
  meetings_booked: number;
  leads_rescued: number;
  pipeline_at_risk: number;
  
  // Executive-level KPIs (C-Suite, Board)
  ai_driven_revenue: number;      // Revenue directly attributed to AI actions
  sales_cycle_reduction: number;  // Percentage reduction in sales cycle length
  cost_savings: number;           // Dollar amount saved through AI automation
  roi_percentage: number;         // Return on AI investment percentage
  conversion_lift: number;        // Percentage improvement in conversion rates
  
  // Sales Leadership KPIs
  forecast_accuracy: number;      // Percentage accuracy of AI sales forecasts
  win_rate: number;               // Percentage of deals won with AI assistance
  deal_size_increase: number;     // Percentage increase in average deal size
  
  // Marketing Leadership KPIs
  lead_quality_score: number;     // Average quality score of AI-qualified leads
  campaign_optimization: number;  // Percentage improvement in campaign performance
  
  // Customer Success KPIs
  churn_reduction: number;        // Percentage reduction in customer churn
  expansion_revenue: number;      // Revenue from upsells/cross-sells driven by AI
  csat_improvement: number;       // Percentage improvement in customer satisfaction
  
  // SMB-Focused KPIs
  time_saved_hours: number;       // Hours saved per week through automation
  leads_per_dollar: number;       // Number of qualified leads per marketing dollar

  // Real Estate Agent KPIs
  leads_captured: number;         // Number of leads captured from portals/websites
  response_time_seconds: number;  // Average time to respond to new leads
  showings_booked: number;        // Number of property showings auto-scheduled
  
  // Mortgage Broker KPIs
  applications_completed: number; // Number of mortgage applications completed
  doc_followups: number;          // Number of document follow-ups sent
  closing_rate: number;           // Percentage of applications that close
  avg_loan_value: number;         // Average loan value in dollars
  compliance_flags: number;       // Number of compliance issues flagged/prevented
}

export interface FeedEvent {
  type: 'Action' | 'Alert' | 'Task' | 'Support' | 'Lead' | 'Revenue';
  text: string;
  time: string;
}

export interface AgentDecision {
  lead_id: number;
  action: 'book_meeting' | 'send_email' | 'escalate' | 'nurture';
  priority: 'high' | 'low';
  confidence: number;
  reason?: string;
}

export interface TriggerAgentRequest {
  lead: Lead;
  action: 'qualify' | 'follow_up' | 'schedule_call';
}
