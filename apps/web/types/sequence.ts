// Autonomous Sequence Engine Types for Apex AI Revenue Operator
import { Lead } from './agent';

// Domain-specific decision nodes for Real Estate
export type RealEstateDecisionNode = 
  | 'lead_intake'
  | 'lead_qualification'
  | 'lead_stalled'
  | 'listing_stale'
  | 'buyer_qualified'
  | 'showing_scheduled'
  | 'follow_up_needed'
  // Real Estate Lead Qualification nodes
  | 'initial_contact'
  | 'qualify_intent'
  | 'check_preapproval'
  | 'refer_to_lender'
  | 'follow_up_financing'
  | 'schedule_showing'
  | 'post_showing_followup'
  | 'schedule_more_showings'
  | 'gauge_offer_interest'
  | 'prepare_offer'
  | 'schedule_listing_appointment'
  | 'prepare_cma'
  | 'listing_presentation'
  // Real Estate Follow-up nodes
  | 'check_response'
  | 'send_followup'
  | 'check_response_again'
  | 'mark_as_cold'
  | 'schedule_long_term_nurture'
  | 'mark_as_responsive'
  // Real Estate Listing Management nodes
  | 'monitor_listing_activity'
  | 'continue_monitoring'
  | 'suggest_price_reduction'
  | 'check_price_reduction_approval'
  | 'implement_price_reduction'
  | 'notify_interested_buyers';

// Domain-specific decision nodes for Mortgage
export type MortgageDecisionNode = 
  | 'docs_missing'
  | 'preapproval_ready'
  | 'rate_change'
  | 'application_stalled'
  | 'closing_approaching'
  // Mortgage Document Chase nodes
  | 'initial_doc_request'
  | 'check_document_status'
  | 'send_reminder'
  | 'check_reminder_response'
  | 'escalate_reminder'
  | 'check_escalated_response'
  | 'alert_loan_officer'
  | 'all_docs_received'
  // Mortgage Loan Progress nodes
  | 'monitor_loan_status'
  | 'continue_monitoring'
  | 'send_milestone_update'
  | 'check_milestone_type'
  | 'request_additional_docs'
  | 'schedule_next_steps'
  | 'prepare_closing'
  // Mortgage Rate Watch nodes
  | 'monitor_rates'
  | 'identify_refi_candidates'
  | 'send_refi_alerts'
  | 'track_responses'
  | 'send_followup'
  | 'schedule_refi_consultation';

// Combined decision node types
export type DecisionNodeType = RealEstateDecisionNode | MortgageDecisionNode;

// Sequence definition interface
export interface SequenceDefinition {
  id: string;
  name: string;
  description: string;
  domain: string;
  steps: SequenceStep[];
}

// Sequence step interface
export interface SequenceStep {
  id: string;
  name?: string;        // Optional name for the step
  node: DecisionNodeType;
  action: string;
  description: string;
  conditions: SequenceCondition[] | null; // Allow null for steps with no conditions
  next_steps: string[]; // IDs of next steps
}

// Condition for sequence branching
export interface SequenceCondition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

// Sequence execution state
export interface SequenceState {
  db_id?: number;           // Database ID for the sequence state
  lead: Lead;
  current_step_id: string;
  history: SequenceStepExecution[];
  context: Record<string, any>;
  status: 'active' | 'completed' | 'failed';
  sequence_type?: string;   // Type of sequence (e.g., 'real_estate_lead_qualification')
  domain?: string;         // Vertical domain (e.g., 'Real Estate', 'Mortgage')
}

// Record of a step execution
export interface SequenceStepExecution {
  step_id: string;
  action?: string;          // Action performed during this step
  timestamp: string;
  result: any;
  next_step_id?: string;    // Next step ID (if any)
  metrics?: SequenceExecutionMetrics; // Performance metrics for this execution
}

// Real Estate Lead Qualification Sequence
export const REAL_ESTATE_LEAD_QUALIFICATION: SequenceStep[] = [
  {
    id: 'intake',
    node: 'lead_intake',
    action: 'greet_lead',
    description: 'Send initial greeting to new lead',
    conditions: [],
    next_steps: ['qualification']
  },
  {
    id: 'qualification',
    node: 'lead_qualification',
    action: 'ask_qualification_questions',
    description: 'Ask about budget, timeline, location preferences',
    conditions: [],
    next_steps: ['evaluate_intent']
  },
  {
    id: 'evaluate_intent',
    node: 'lead_qualification',
    action: 'evaluate_lead_intent',
    description: 'Determine if lead is high-intent based on responses',
    conditions: [
      { attribute: 'intent_score', operator: 'greater_than', value: 0.7 }
    ],
    next_steps: ['schedule_showing', 'nurture']
  },
  {
    id: 'schedule_showing',
    node: 'showing_scheduled',
    action: 'book_showing',
    description: 'Auto-book showing for high-intent lead',
    conditions: [],
    next_steps: ['follow_up']
  },
  {
    id: 'nurture',
    node: 'lead_qualification',
    action: 'send_nurture_content',
    description: 'Send educational content to low-intent lead',
    conditions: [],
    next_steps: ['check_response']
  },
  {
    id: 'check_response',
    node: 'follow_up_needed',
    action: 'check_lead_response',
    description: 'Check if lead has responded within 2 days',
    conditions: [
      { attribute: 'days_since_contact', operator: 'greater_than', value: 2 }
    ],
    next_steps: ['send_reminder', 'continue_monitoring']
  },
  {
    id: 'send_reminder',
    node: 'lead_stalled',
    action: 'send_sms_email_combo',
    description: 'Send SMS + email combo reminder',
    conditions: [],
    next_steps: ['evaluate_engagement']
  },
  {
    id: 'evaluate_engagement',
    node: 'lead_stalled',
    action: 'evaluate_lead_engagement',
    description: 'Determine if lead is still engaged',
    conditions: [
      { attribute: 'is_engaged', operator: 'equals', value: false }
    ],
    next_steps: ['mark_cold', 'continue_monitoring']
  },
  {
    id: 'mark_cold',
    node: 'lead_stalled',
    action: 'mark_lead_cold',
    description: 'Log to CRM as cold lead and set 30-day reminder',
    conditions: [],
    next_steps: []
  },
  {
    id: 'continue_monitoring',
    node: 'follow_up_needed',
    action: 'continue_monitoring_lead',
    description: 'Continue monitoring lead activity',
    conditions: [],
    next_steps: []
  },
  {
    id: 'follow_up',
    node: 'follow_up_needed',
    action: 'schedule_follow_up',
    description: 'Schedule follow-up after showing',
    conditions: [],
    next_steps: []
  }
];

// ROI Tracking for sequence executions
export interface SequenceExecutionMetrics {
  time_saved_minutes: number;
  revenue_impact: number;
  confidence?: number;
  cost_savings?: number;
}

// ROI Tracking for agent actions
export interface AgentROIMetrics {
  action_id: string;
  timestamp: string;
  action_type: string;
  time_saved_minutes: number;
  revenue_impact: number;
  confidence: number;
  lead_id: number;
  execution_id?: number;    // Link to sequence execution if applicable
}
