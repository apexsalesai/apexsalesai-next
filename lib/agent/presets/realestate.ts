/**
 * Real Estate Agent Logic Presets
 * 
 * This file contains domain-specific logic for real estate agent workflows.
 * These presets are used to dynamically switch LangGraph node paths based on lead type and status.
 */

import { SequenceDefinition, SequenceStep, SequenceCondition } from '../../../types/sequence';

/**
 * Real Estate Lead Qualification Sequence
 * 
 * A sequence that qualifies real estate leads based on their intent, budget, and timeline.
 * Includes conditional paths for different lead scenarios.
 */
export const realEstateLeadQualificationSequence: SequenceDefinition = {
  id: 'real-estate-lead-qualification',
  name: 'Real Estate Lead Qualification',
  domain: 'Real Estate',
  description: 'Qualifies real estate leads and routes them to appropriate next steps',
  steps: [
    {
      id: 'initial_contact',
      node: 'initial_contact',
      name: 'Initial Contact',
      action: 'send_greeting_email',
      description: 'Send initial greeting email to the lead',
      next_steps: ['qualify_intent'],
      conditions: null,
    },
    {
      id: 'qualify_intent',
      node: 'qualify_intent',
      name: 'Qualify Intent',
      action: 'send_qualification_questions',
      description: 'Send qualification questions to determine buyer/seller intent',
      next_steps: ['check_preapproval', 'schedule_listing_appointment'],
      conditions: [
        {
          attribute: 'lead_type',
          operator: 'equals',
          value: 'buyer'
        }
      ],
    },
    {
      id: 'check_preapproval',
      node: 'check_preapproval',
      name: 'Check Preapproval',
      action: 'check_mortgage_preapproval',
      description: 'Check if buyer has mortgage preapproval',
      next_steps: ['schedule_showing', 'refer_to_lender'],
      conditions: [
        {
          attribute: 'preapproved',
          operator: 'equals',
          value: 'yes'
        }
      ],
    },
    {
      id: 'refer_to_lender',
      node: 'refer_to_lender',
      name: 'Refer to Lender',
      action: 'send_lender_referral',
      description: 'Refer lead to preferred mortgage lender',
      next_steps: ['follow_up_financing'],
      conditions: null,
    },
    {
      id: 'follow_up_financing',
      node: 'follow_up_financing',
      name: 'Follow Up on Financing',
      action: 'schedule_financing_followup',
      description: 'Schedule follow-up about financing status',
      next_steps: ['check_preapproval'],
      conditions: null,
    },
    {
      id: 'schedule_showing',
      node: 'schedule_showing',
      name: 'Schedule Showing',
      action: 'send_showing_calendar',
      description: 'Send calendar link to schedule property showings',
      next_steps: ['post_showing_followup'],
      conditions: null,
    },
    {
      id: 'post_showing_followup',
      node: 'post_showing_followup',
      name: 'Post-Showing Follow-up',
      action: 'send_showing_feedback_request',
      description: 'Request feedback after property showing',
      next_steps: ['gauge_offer_interest', 'schedule_more_showings'],
      conditions: [
        {
          attribute: 'showing_feedback',
          operator: 'contains',
          value: 'interested'
        }
      ],
    },
    {
      id: 'schedule_more_showings',
      node: 'schedule_more_showings',
      name: 'Schedule More Showings',
      action: 'send_more_listings',
      description: 'Send more property listings based on feedback',
      next_steps: ['schedule_showing'],
      conditions: null,
    },
    {
      id: 'gauge_offer_interest',
      node: 'gauge_offer_interest',
      name: 'Gauge Offer Interest',
      action: 'send_offer_guidance',
      description: 'Provide guidance on making an offer',
      next_steps: ['prepare_offer'],
      conditions: null,
    },
    {
      id: 'prepare_offer',
      node: 'prepare_offer',
      name: 'Prepare Offer',
      action: 'schedule_offer_preparation',
      description: 'Schedule meeting to prepare offer',
      next_steps: [],
      conditions: null,
    },
    {
      id: 'schedule_listing_appointment',
      node: 'schedule_listing_appointment',
      name: 'Schedule Listing Appointment',
      action: 'send_listing_calendar',
      description: 'Send calendar link to schedule listing appointment',
      next_steps: ['prepare_cma'],
      conditions: null,
    },
    {
      id: 'prepare_cma',
      node: 'prepare_cma',
      name: 'Prepare CMA',
      action: 'generate_comparative_market_analysis',
      description: 'Generate comparative market analysis for the property',
      next_steps: ['listing_presentation'],
      conditions: null,
    },
    {
      id: 'listing_presentation',
      node: 'listing_presentation',
      name: 'Listing Presentation',
      action: 'schedule_listing_presentation',
      description: 'Schedule listing presentation meeting',
      next_steps: [],
      conditions: null,
    }
  ]
};

/**
 * Real Estate Automated Follow-Up Sequence
 * 
 * A sequence that automatically follows up with leads who haven't responded.
 */
export const realEstateFollowUpSequence: SequenceDefinition = {
  id: 'real-estate-follow-up',
  name: 'Real Estate Automated Follow-Up',
  domain: 'Real Estate',
  description: 'Automatically follows up with non-responsive leads',
  steps: [
    {
      id: 'check_response',
      node: 'check_response',
      name: 'Check Response',
      action: 'check_lead_response',
      description: 'Check if lead has responded to previous outreach',
      next_steps: ['send_followup', 'mark_as_responsive'],
      conditions: [
        {
          attribute: 'days_since_contact',
          operator: 'greater_than',
          value: '2'
        }
      ],
    },
    {
      id: 'send_followup',
      node: 'send_followup',
      name: 'Send Follow-up',
      action: 'send_sms_email_combo',
      description: 'Send SMS and email follow-up combo',
      next_steps: ['check_response_again'],
      conditions: null,
    },
    {
      id: 'check_response_again',
      node: 'check_response_again',
      name: 'Check Response Again',
      action: 'check_lead_response',
      description: 'Check if lead has responded to follow-up',
      next_steps: ['mark_as_cold', 'mark_as_responsive'],
      conditions: [
        {
          attribute: 'days_since_contact',
          operator: 'greater_than',
          value: '5'
        }
      ],
    },
    {
      id: 'mark_as_cold',
      node: 'mark_as_cold',
      name: 'Mark as Cold',
      action: 'update_crm_status',
      description: 'Update CRM status to Cold',
      next_steps: ['schedule_long_term_nurture'],
      conditions: null,
    },
    {
      id: 'schedule_long_term_nurture',
      node: 'schedule_long_term_nurture',
      name: 'Schedule Long-term Nurture',
      action: 'add_to_nurture_campaign',
      description: 'Add lead to long-term nurture campaign',
      next_steps: [],
      conditions: null,
    },
    {
      id: 'mark_as_responsive',
      node: 'mark_as_responsive',
      name: 'Mark as Responsive',
      action: 'update_crm_status',
      description: 'Update CRM status to Active',
      next_steps: [],
      conditions: null,
    }
  ]
};

/**
 * Real Estate Listing Price Reduction Sequence
 * 
 * A sequence that monitors listing performance and suggests price reductions when necessary.
 */
export const realEstatePriceReductionSequence: SequenceDefinition = {
  id: 'real-estate-price-reduction',
  name: 'Listing Price Reduction',
  domain: 'Real Estate',
  description: 'Monitors listing performance and suggests price reductions',
  steps: [
    {
      id: 'monitor_listing_activity',
      node: 'monitor_listing_activity',
      name: 'Monitor Listing Activity',
      action: 'check_listing_metrics',
      description: 'Check showing requests, views, and feedback',
      next_steps: ['suggest_price_reduction', 'continue_monitoring'],
      conditions: [
        {
          attribute: 'days_on_market',
          operator: 'greater_than',
          value: '30'
        }
      ],
    },
    {
      id: 'continue_monitoring',
      node: 'continue_monitoring',
      name: 'Continue Monitoring',
      action: 'schedule_next_review',
      description: 'Schedule next listing performance review',
      next_steps: ['monitor_listing_activity'],
      conditions: null,
    },
    {
      id: 'suggest_price_reduction',
      node: 'suggest_price_reduction',
      name: 'Suggest Price Reduction',
      action: 'send_price_reduction_recommendation',
      description: 'Send price reduction recommendation to agent',
      next_steps: ['check_price_reduction_approval'],
      conditions: null,
    },
    {
      id: 'check_price_reduction_approval',
      node: 'check_price_reduction_approval',
      name: 'Check Price Reduction Approval',
      action: 'check_agent_approval',
      description: 'Check if agent approved price reduction',
      next_steps: ['implement_price_reduction', 'continue_monitoring'],
      conditions: [
        {
          attribute: 'price_reduction_approved',
          operator: 'equals',
          value: 'yes'
        }
      ],
    },
    {
      id: 'implement_price_reduction',
      node: 'implement_price_reduction',
      name: 'Implement Price Reduction',
      action: 'update_listing_price',
      description: 'Update listing price in MLS and marketing materials',
      next_steps: ['notify_interested_buyers'],
      conditions: null,
    },
    {
      id: 'notify_interested_buyers',
      node: 'notify_interested_buyers',
      name: 'Notify Interested Buyers',
      action: 'send_price_change_notification',
      description: 'Notify previously interested buyers about price change',
      next_steps: ['monitor_listing_activity'],
      conditions: null,
    }
  ]
};

/**
 * Real Estate action handlers
 * 
 * These functions implement the actual business logic for each action in the sequences.
 */
export const realEstateActionHandlers = {
  // Lead qualification actions
  send_greeting_email: async (state: any) => {
    console.log(`Sending greeting email to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 5,
        revenue_impact: 0
      }
    };
  },
  
  send_qualification_questions: async (state: any) => {
    console.log(`Sending qualification questions to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 15,
        revenue_impact: 0
      }
    };
  },
  
  check_mortgage_preapproval: async (state: any) => {
    console.log(`Checking mortgage preapproval for ${state.lead.name}`);
    // Simulate checking preapproval status
    const isPreapproved = Math.random() > 0.5;
    
    // Update context with preapproval status
    return { 
      success: true,
      context_updates: {
        preapproved: isPreapproved ? 'yes' : 'no'
      },
      metrics: {
        time_saved_minutes: 10,
        revenue_impact: 0
      }
    };
  },
  
  // Showing actions
  send_showing_calendar: async (state: any) => {
    console.log(`Sending showing calendar to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 10,
        revenue_impact: 0
      }
    };
  },
  
  // Listing actions
  send_listing_calendar: async (state: any) => {
    console.log(`Sending listing appointment calendar to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 10,
        revenue_impact: 0
      }
    };
  },
  
  generate_comparative_market_analysis: async (state: any) => {
    console.log(`Generating CMA for ${state.lead.name}'s property`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 60,
        revenue_impact: 0
      }
    };
  },
  
  // Follow-up actions
  send_sms_email_combo: async (state: any) => {
    console.log(`Sending SMS+Email combo to ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 8,
        revenue_impact: 0
      }
    };
  },
  
  update_crm_status: async (state: any) => {
    console.log(`Updating CRM status for ${state.lead.name}`);
    return { 
      success: true,
      metrics: {
        time_saved_minutes: 3,
        revenue_impact: 0
      }
    };
  }
};
