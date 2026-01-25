import type { NextApiRequest, NextApiResponse } from 'next';
import type { TriggerAgentResponse } from '../../types/api';
import { SequenceEngineV2 } from '@lib/sequence-engine-v2';
import { AgentDecision, AgentAction, TriggerAgentRequest } from '../../types/agent';
import { AgentROIMetrics } from '../../types/sequence';

// Initialize the sequence engine
const sequenceEngine = new SequenceEngineV2();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TriggerAgentResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      decision: { lead_id: 0, action: 'escalate', priority: 'low', confidence: 0, reason: 'Method not allowed' },
      agent_action: { type: 'alert', timestamp: new Date().toISOString(), summary: 'Invalid request method' }
    });
  }

  try {
    const { lead, action } = req.body as TriggerAgentRequest;
    
    // Validate input
    if (!lead || !action) {
      return res.status(400).json({
        decision: { lead_id: 0, action: 'escalate', priority: 'low', confidence: 0, reason: 'Missing required fields' },
        agent_action: { type: 'alert', timestamp: new Date().toISOString(), summary: 'Missing lead information' }
      });
    }
    
    // Process the lead through the appropriate sequence
    let state;
    let result;
    
    switch (action) {
      case 'qualify':
        // Initialize and process the lead qualification sequence
        state = await sequenceEngine.initializeSequence(lead, 'real-estate-lead-qualification');
        result = await sequenceEngine.processCurrentStep(state);
        break;
        
      case 'follow_up':
        // Get existing state or initialize new one
        state = await sequenceEngine.getSequenceState(lead.id);
        if (!state) {
          state = await sequenceEngine.initializeSequence(lead, 'real_estate_lead_qualification');
        }
        
        // Force the next step to be a follow-up
        state.context.days_since_contact = 3; // Simulate 3 days since last contact
        state.context.needs_follow_up = true;
        
        // Process the follow-up step
        result = await sequenceEngine.processCurrentStep(state);
        break;
        
      case 'schedule_call':
        // Get existing state or initialize new one
        state = await sequenceEngine.getSequenceState(lead.id);
        if (!state) {
          state = await sequenceEngine.initializeSequence(lead, 'real_estate_lead_qualification');
        }
        
        // Force the next step to be scheduling a showing
        state.context.intent_score = 90; // High intent score
        state.context.qualification_complete = true;
        state.context.ready_for_showing = true;
        
        // Process the scheduling step
        result = await sequenceEngine.processCurrentStep(state);
        break;
        
      default:
        return res.status(400).json({
          decision: { lead_id: 0, action: 'escalate', priority: 'low', confidence: 0, reason: 'Invalid action' },
          agent_action: { type: 'alert', timestamp: new Date().toISOString(), summary: 'Invalid action' }
        });
    }
    
    // State is now automatically stored by the SequenceEngineV2
    
    // Get the most recent step execution
    const latestExecution = state.history[state.history.length - 1];
    
    // Calculate ROI metrics
    const roiMetrics = sequenceEngine.calculateROI(state);
    
    // Store ROI metrics (would go to database in production)
    const agentROI: AgentROIMetrics = {
      action_id: latestExecution.step_id,
      timestamp: latestExecution.timestamp,
      action_type: latestExecution.step_id,
      time_saved_minutes: roiMetrics.time_saved_minutes,
      revenue_impact: roiMetrics.revenue_impact,
      confidence: 0.85, // Would be dynamically calculated in production
      lead_id: lead.id
    };
    
    // Map the sequence step to an agent decision
    const decision: AgentDecision = mapToAgentDecision(lead.id, latestExecution, state);
    
    // Map the execution result to an agent action
    const agentAction: AgentAction = mapToAgentAction(latestExecution);
    
    // Return the response
    return res.status(200).json({
      decision,
      agent_action: agentAction
    });
  } catch (error: any) {
    console.error('Error processing agent request:', error);
    
    return res.status(500).json({
      decision: { 
        lead_id: req.body?.lead?.id || 0, 
        action: 'escalate', 
        priority: 'high', 
        confidence: 0, 
        reason: 'Error processing request' 
      },
      agent_action: { 
        type: 'alert', 
        timestamp: new Date().toISOString(), 
        summary: `Error: ${error.message || 'Unknown error'}` 
      }
    });
  }
}

/**
 * Map a sequence step execution to an agent decision
 */
function mapToAgentDecision(
  leadId: number, 
  execution: any, 
  state: any
): AgentDecision {
  // Default values
  let action: 'book_meeting' | 'send_email' | 'escalate' | 'nurture' = 'nurture';
  let priority: 'high' | 'low' = 'low';
  let confidence = 0.7;
  let reason = 'Processing lead through qualification sequence';
  
  // Map based on the step ID
  switch (execution.step_id) {
    case 'intake':
    case 'qualification':
    case 'evaluate_intent':
      action = 'send_email';
      priority = 'high';
      confidence = 0.85;
      reason = 'Qualifying new lead';
      break;
      
    case 'schedule_showing':
      action = 'book_meeting';
      priority = 'high';
      confidence = 0.9;
      reason = 'High-intent lead ready for showing';
      break;
      
    case 'nurture':
      action = 'nurture';
      priority = 'low';
      confidence = 0.8;
      reason = 'Lead needs nurturing before sales-ready';
      break;
      
    case 'send_reminder':
      action = 'send_email';
      priority = 'high';
      confidence = 0.85;
      reason = 'Lead has not responded, sending follow-up';
      break;
      
    case 'mark_cold':
      action = 'escalate';
      priority = 'low';
      confidence = 0.75;
      reason = 'Lead appears unresponsive, marking as cold';
      break;
      
    default:
      // Use defaults
  }
  
  return {
    lead_id: leadId,
    action,
    priority,
    confidence,
    reason
  };
}

/**
 * Map a sequence step execution to an agent action
 */
function mapToAgentAction(execution: any): AgentAction {
  // Default values
  let type: 'email_sent' | 'meeting_booked' | 'deal_closed' | 'alert' | 'task' = 'task';
  let summary = 'Processing lead';
  
  // Map based on the step ID and result
  switch (execution.step_id) {
    case 'intake':
      type = 'email_sent';
      summary = 'Sent initial greeting to lead';
      break;
      
    case 'qualification':
      type = 'email_sent';
      summary = 'Asked qualification questions about budget, timeline, and location';
      break;
      
    case 'evaluate_intent':
      type = 'task';
      summary = execution.result.is_high_intent 
        ? 'Lead identified as high-intent, proceeding to schedule showing' 
        : 'Lead identified as low-intent, proceeding to nurture';
      break;
      
    case 'schedule_showing':
      type = 'meeting_booked';
      summary = `Booked property showing for ${new Date(execution.result.date).toLocaleDateString()}`;
      break;
      
    case 'nurture':
      type = 'email_sent';
      summary = 'Sent educational content to nurture lead';
      break;
      
    case 'send_reminder':
      type = 'email_sent';
      summary = 'Sent SMS + email combo reminder to unresponsive lead';
      break;
      
    case 'mark_cold':
      type = 'task';
      summary = 'Marked lead as cold and set 30-day follow-up reminder';
      break;
      
    default:
      summary = `Processed step: ${execution.step_id}`;
  }
  
  return {
    type,
    timestamp: execution.timestamp,
    summary
  };
}
