/**
 * Mortgage Loan Officer Logic Presets
 * 
 * This file contains domain-specific logic for mortgage loan officer workflows.
 * These presets are used to dynamically switch LangGraph node paths based on loan application status.
 */

import { SequenceDefinition, SequenceStep, SequenceCondition } from 'types/sequence';

/**
 * Mortgage Document Chase Sequence
 * 
 * A sequence that automatically tracks and requests missing documents from borrowers.
 */
export const mortgageDocumentChaseSequence: SequenceDefinition = {
  id: 'mortgage-document-chase',
  name: 'Mortgage Document Chase',
  domain: 'Mortgage',
  description: 'Tracks missing documents and sends automated, escalating reminders',
  steps: [
    {
      id: 'initial_doc_request',
      node: 'initial_doc_request',
      name: 'Initial Document Request',
      action: 'send_document_checklist',
      description: 'Send initial document checklist to borrower',
      next_steps: ['check_document_status'],
      conditions: null,
    },
    {
      id: 'check_document_status',
      node: 'check_document_status',
      name: 'Check Document Status',
      action: 'check_missing_documents',
      description: 'Check which documents are still missing',
      next_steps: ['all_docs_received', 'send_reminder'],
      conditions: [
        {
          attribute: 'missing_documents',
          operator: 'equals',
          value: '0'
        }
      ],
    },
    {
      id: 'send_reminder',
      node: 'send_reminder',
      name: 'Send Reminder',
      action: 'send_document_reminder',
      description: 'Send reminder for missing documents',
      next_steps: ['check_reminder_response'],
      conditions: null,
    },
    {
      id: 'check_reminder_response',
      node: 'check_reminder_response',
      name: 'Check Reminder Response',
      action: 'check_document_response',
      description: 'Check if borrower has responded to reminder',
      next_steps: ['check_document_status', 'escalate_reminder'],
      conditions: [
        {
          attribute: 'has_responded',
          operator: 'equals',
          value: 'yes'
        }
      ],
    },
    {
      id: 'escalate_reminder',
      node: 'escalate_reminder',
      name: 'Escalate Reminder',
      action: 'send_escalated_reminder',
      description: 'Send escalated reminder (SMS + email)',
      next_steps: ['check_escalated_response'],
      conditions: null,
    },
    {
      id: 'check_escalated_response',
      node: 'check_escalated_response',
      name: 'Check Escalated Response',
      action: 'check_document_response',
      description: 'Check if borrower has responded to escalated reminder',
      next_steps: ['check_document_status', 'alert_loan_officer'],
      conditions: [
        {
          attribute: 'has_responded',
          operator: 'equals',
          value: 'yes'
        }
      ],
    },
    {
      id: 'alert_loan_officer',
      node: 'alert_loan_officer',
      name: 'Alert Loan Officer',
      action: 'send_lo_alert',
      description: 'Alert loan officer about non-responsive borrower',
      next_steps: ['check_document_status'],
      conditions: null,
    },
    {
      id: 'all_docs_received',
      node: 'all_docs_received',
      name: 'All Documents Received',
      action: 'update_loan_status',
      description: 'Update loan status to "Documents Complete"',
      next_steps: [],
      conditions: null,
    }
  ]
};

/**
 * Mortgage Loan Status Update Sequence
 * 
 * A sequence that automatically updates borrowers and realtors on loan status milestones.
 */
export const mortgageLoanStatusSequence: SequenceDefinition = {
  id: 'mortgage-loan-status',
  name: 'Loan Status Update',
  domain: 'Mortgage',
  description: 'Pushes milestone updates to borrowers and realtors automatically',
  steps: [
    {
      id: 'monitor_loan_status',
      node: 'monitor_loan_status',
      name: 'Monitor Loan Status',
      action: 'check_loan_milestone',
      description: 'Check if loan has reached a new milestone',
      next_steps: ['send_milestone_update', 'continue_monitoring'],
      conditions: [
        {
          attribute: 'new_milestone',
          operator: 'equals',
          value: 'yes'
        }
      ],
    },
    {
      id: 'continue_monitoring',
      node: 'continue_monitoring',
      name: 'Continue Monitoring',
      action: 'schedule_next_check',
      description: 'Schedule next loan status check',
      next_steps: ['monitor_loan_status'],
      conditions: null,
    },
    {
      id: 'send_milestone_update',
      node: 'send_milestone_update',
      name: 'Send Milestone Update',
      action: 'send_status_update',
      description: 'Send status update to borrower and realtor',
      next_steps: ['check_milestone_type'],
      conditions: null,
    },
    {
      id: 'check_milestone_type',
      node: 'check_milestone_type',
      name: 'Check Milestone Type',
      action: 'identify_milestone_type',
      description: 'Identify the type of milestone reached',
      next_steps: ['request_additional_docs', 'schedule_next_steps', 'prepare_closing'],
      conditions: [
        {
          attribute: 'milestone_type',
          operator: 'equals',
          value: 'conditional_approval'
        }
      ],
    },
    {
      id: 'request_additional_docs',
      node: 'request_additional_docs',
      name: 'Request Additional Documents',
      action: 'send_conditional_doc_request',
      description: 'Request documents needed for conditional approval',
      next_steps: ['monitor_loan_status'],
      conditions: null,
    },
    {
      id: 'schedule_next_steps',
      node: 'schedule_next_steps',
      name: 'Schedule Next Steps',
      action: 'send_next_steps_guide',
      description: 'Send guide on next steps in the loan process',
      next_steps: ['monitor_loan_status'],
      conditions: null,
    },
    {
      id: 'prepare_closing',
      node: 'prepare_closing',
      name: 'Prepare for Closing',
      action: 'send_closing_checklist',
      description: 'Send closing preparation checklist',
      next_steps: ['monitor_loan_status'],
      conditions: null,
    }
  ]
};

/**
 * Mortgage Rate Change Alert Sequence
 * 
 * A sequence that monitors interest rates and alerts past clients about refinance opportunities.
 */
export const mortgageRateChangeSequence: SequenceDefinition = {
  id: 'mortgage-rate-change',
  name: 'Rate Change Alert',
  domain: 'Mortgage',
  description: 'Triggers refi script to past clients when rates drop significantly',
  steps: [
    {
      id: 'monitor_rates',
      node: 'monitor_rates',
      name: 'Monitor Rates',
      action: 'check_rate_changes',
      description: 'Check for significant interest rate changes',
      next_steps: ['identify_refi_candidates', 'continue_monitoring'],
      conditions: [
        {
          attribute: 'rate_drop',
          operator: 'greater_than',
          value: '0.25'
        }
      ],
    },
    {
      id: 'continue_monitoring',
      node: 'continue_monitoring',
      name: 'Continue Monitoring',
      action: 'schedule_next_rate_check',
      description: 'Schedule next rate check',
      next_steps: ['monitor_rates'],
      conditions: null,
    },
    {
      id: 'identify_refi_candidates',
      node: 'identify_refi_candidates',
      name: 'Identify Refinance Candidates',
      action: 'find_eligible_clients',
      description: 'Find past clients who would benefit from refinancing',
      next_steps: ['send_refi_alerts'],
      conditions: null,
    },
    {
      id: 'send_refi_alerts',
      node: 'send_refi_alerts',
      name: 'Send Refinance Alerts',
      action: 'send_rate_alert',
      description: 'Send personalized refinance opportunity alerts',
      next_steps: ['track_responses'],
      conditions: null,
    },
    {
      id: 'track_responses',
      node: 'track_responses',
      name: 'Track Responses',
      action: 'monitor_alert_responses',
      description: 'Track responses to refinance alerts',
      next_steps: ['schedule_refi_consultation', 'send_followup'],
      conditions: [
        {
          attribute: 'has_responded',
          operator: 'equals',
          value: 'yes'
        }
      ],
    },
    {
      id: 'send_followup',
      node: 'send_followup',
      name: 'Send Follow-up',
      action: 'send_refi_followup',
      description: 'Send follow-up to non-responsive clients',
      next_steps: ['track_responses'],
      conditions: null,
    },
    {
      id: 'schedule_refi_consultation',
      node: 'schedule_refi_consultation',
      name: 'Schedule Refinance Consultation',
      action: 'send_scheduling_link',
      description: 'Send scheduling link for refinance consultation',
      next_steps: [],
      conditions: null,
    }
  ]
};

/**
 * Mortgage action handlers
 * 
 * These functions implement the actual business logic for each action in the sequences.
 */
export const mortgageActionHandlers = {
  // Document chase actions
  send_document_checklist: async (state: any) => {
    console.log(`Sending document checklist to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 15,
        revenue_impact: 0
      }
    };
  },
  
  check_missing_documents: async (state: any) => {
    console.log(`Checking missing documents for ${state.lead.name}`);
    // Simulate checking document status
    const missingDocCount = Math.floor(Math.random() * 5);
    
    return { 
      success: true,
      context_updates: {
        missing_documents: missingDocCount.toString()
      },
      metrics: {
        time_saved_minutes: 20,
        revenue_impact: 0
      }
    };
  },
  
  send_document_reminder: async (state: any) => {
    console.log(`Sending document reminder to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 10,
        revenue_impact: 0
      }
    };
  },
  
  // Loan status actions
  check_loan_milestone: async (state: any) => {
    console.log(`Checking loan milestones for ${state.lead.name}`);
    // Simulate checking for new milestone
    const newMilestone = Math.random() > 0.7;
    
    return { 
      success: true,
      context_updates: {
        new_milestone: newMilestone ? 'yes' : 'no',
        milestone_type: newMilestone ? ['conditional_approval', 'clear_to_close', 'docs_ready'][Math.floor(Math.random() * 3)] : ''
      },
      metrics: {
        time_saved_minutes: 5,
        revenue_impact: 0
      }
    };
  },
  
  send_status_update: async (state: any) => {
    console.log(`Sending status update for ${state.lead.name}'s loan`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 15,
        revenue_impact: 0
      }
    };
  },
  
  // Rate change actions
  check_rate_changes: async (state: any) => {
    console.log('Checking for significant rate changes');
    // Simulate checking rate changes
    const rateDrop = (Math.random() * 0.5).toFixed(2);
    
    return { 
      success: true,
      context_updates: {
        rate_drop: rateDrop
      },
      metrics: {
        time_saved_minutes: 30,
        revenue_impact: 0
      }
    };
  },
  
  find_eligible_clients: async (state: any) => {
    console.log('Finding clients eligible for refinance');
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 60,
        revenue_impact: 5000
      }
    };
  },
  
  send_rate_alert: async (state: any) => {
    console.log('Sending rate drop alerts to eligible clients');
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 30,
        revenue_impact: 10000
      }
    };
  }
};
