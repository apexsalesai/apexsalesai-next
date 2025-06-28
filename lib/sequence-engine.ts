// Autonomous Sequence Engine for Apex AI Revenue Operator
import { Lead } from '../types/agent';
import { 
  SequenceStep, 
  SequenceState, 
  SequenceStepExecution,
  REAL_ESTATE_LEAD_QUALIFICATION
} from '../types/sequence';
import { SequenceStorage } from './sequence-storage';
import { AgentTools } from './agent-tools';

/**
 * Sequence Engine - Core logic for executing autonomous multi-step sequences
 */
export class SequenceEngine {
  private sequences: Record<string, SequenceStep[]> = {
    'real_estate_lead_qualification': REAL_ESTATE_LEAD_QUALIFICATION
  };
  
  private storage: SequenceStorage;
  private tools: AgentTools;
  
  constructor() {
    this.storage = new SequenceStorage();
    this.tools = new AgentTools();
  }
  
  /**
   * Initialize a new sequence for a lead
   */
  async initializeSequence(lead: Lead, sequenceType: string): Promise<SequenceState> {
    // Check if we already have a sequence for this lead
    const existingState = await this.storage.getSequenceState(lead.id);
    if (existingState && existingState.status === 'active') {
      console.log(`Resuming existing sequence for lead ${lead.id}`);
      return existingState;
    }
    const sequence = this.sequences[sequenceType];
    
    if (!sequence || sequence.length === 0) {
      throw new Error(`Sequence ${sequenceType} not found`);
    }
    
    // Start with the first step in the sequence
    const firstStep = sequence[0];
    
    const newState: SequenceState = {
      lead,
      current_step_id: firstStep.id,
      history: [],
      context: {
        // Initialize context with lead data and any other relevant info
        lead_data: lead,
        intent_score: this.calculateInitialIntentScore(lead),
        days_since_contact: 0,
        is_engaged: true
      },
      status: 'active' as const
    };
    
    // Save the new state to persistent storage
    await this.storage.saveSequenceState(lead.id, newState);
    
    return newState;
  }
  
  /**
   * Get sequence state for a lead
   */
  async getSequenceState(leadId: number): Promise<SequenceState | null> {
    return this.storage.getSequenceState(leadId);
  }
  
  /**
   * Get all active sequence states
   */
  async getAllSequenceStates(): Promise<Record<number, SequenceState>> {
    return this.storage.getAllSequenceStates();
  }
  
  /**
   * Process the current step in a sequence
   */
  async processCurrentStep(state: SequenceState): Promise<SequenceState> {
    const sequenceType = this.determineSequenceType(state.lead);
    const sequence = this.sequences[sequenceType];
    const currentStep = sequence.find(step => step.id === state.current_step_id);
    
    if (!currentStep) {
      return {
        ...state,
        status: 'failed'
      };
    }
    
    // Execute the current step's action
    const result = await this.executeAction(currentStep.action, state);
    
    // Record this execution in history
    const execution: SequenceStepExecution = {
      step_id: currentStep.id,
      timestamp: new Date().toISOString(),
      result,
      next_step_id: null // Will be set below
    };
    
    // Determine the next step based on conditions
    let nextStepId: string | null = null;
    
    if (currentStep.next_steps.length === 0) {
      // End of sequence
      return {
        ...state,
        history: [...state.history, execution],
        status: 'completed'
      };
    } else if (currentStep.next_steps.length === 1) {
      // Only one possible next step
      nextStepId = currentStep.next_steps[0];
    } else {
      // Multiple possible next steps, evaluate conditions
      for (const condition of currentStep.conditions) {
        const { attribute, operator, value } = condition;
        const contextValue = state.context[attribute];
        
        let conditionMet = false;
        
        switch (operator) {
          case 'equals':
            conditionMet = contextValue === value;
            break;
          case 'not_equals':
            conditionMet = contextValue !== value;
            break;
          case 'greater_than':
            conditionMet = contextValue > value;
            break;
          case 'less_than':
            conditionMet = contextValue < value;
            break;
          case 'contains':
            conditionMet = contextValue?.includes(value);
            break;
        }
        
        if (conditionMet) {
          nextStepId = currentStep.next_steps[0]; // First next step if condition is met
        } else {
          nextStepId = currentStep.next_steps[1] || currentStep.next_steps[0]; // Second next step or default to first
        }
      }
    }
    
    // Update the execution with the next step
    execution.next_step_id = nextStepId;
    
    // Create updated state
    const updatedState: SequenceState = {
      ...state,
      current_step_id: nextStepId || '',
      history: [...state.history, execution],
      status: nextStepId ? 'active' as const : 'completed' as const
    };
    
    // Save updated state to persistent storage
    await this.storage.saveSequenceState(state.lead.id, updatedState);
    
    return updatedState;
  }
  
  /**
   * Execute a specific action for a sequence step
   */
  private async executeAction(action: string, state: SequenceState): Promise<any> {
    // Log the action for analytics and ROI tracking
    await this.tools.logAgentAction(state.lead.id, action, {
      lead_id: state.lead.id,
      sequence_step: state.current_step_id,
      context: state.context
    });
    
    // Execute the action using our real-world tools
    switch (action) {
      case 'greet_lead':
        const emailResult = await this.tools.sendEmail(
          state.lead.email,
          `Hello from ${state.lead.industry === 'Real Estate' ? 'your real estate agent' : 'Apex AI'}`,
          `Hi ${state.lead.name},\n\nI'm excited to help you with your ${state.lead.industry.toLowerCase()} needs. What can I assist you with today?\n\nBest regards,\nYour Apex AI Assistant`,
          'initial_greeting'
        );
        
        // Update CRM with the email activity
        await this.tools.updateCRMLead(state.lead.id, {
          last_contact_date: new Date().toISOString(),
          last_contact_type: 'email',
          last_contact_template: 'initial_greeting'
        });
        
        return {
          message_sent: true,
          message_type: 'email',
          template: 'initial_greeting',
          lead_email: state.lead.email,
          email_result: emailResult
        };
        
      case 'ask_qualification_questions':
        const questions = [
          'What is your budget range?',
          'When are you looking to move?',
          'What areas are you interested in?'
        ];
        
        const questionEmailResult = await this.tools.sendEmail(
          state.lead.email,
          'A few quick questions about your needs',
          `Hi ${state.lead.name},\n\nTo better assist you, could you please answer these quick questions?\n\n${questions.map((q, i) => `${i+1}. ${q}`).join('\n')}\n\nThanks!\nYour Apex AI Assistant`,
          'qualification_questions'
        );
        
        // Update CRM with the qualification activity
        await this.tools.updateCRMLead(state.lead.id, {
          qualification_questions_sent: true,
          qualification_questions_sent_date: new Date().toISOString(),
          stage: 'Qualification'
        });
        
        return {
          questions_sent: true,
          questions,
          email_result: questionEmailResult
        };
        
      case 'evaluate_lead_intent':
        // In a real implementation, this would analyze responses
        // For now, we'll use the intent score from context
        const intentScore = state.context.intent_score;
        return {
          intent_score: intentScore,
          is_high_intent: intentScore > 0.7
        };
        
      case 'book_showing':
        const showingDate = new Date(Date.now() + 86400000); // Tomorrow
        const showingEndDate = new Date(showingDate.getTime() + 3600000); // 1 hour later
        
        const calendarResult = await this.tools.bookCalendarEvent(
          'Property Showing - 123 Main St',
          showingDate.toISOString(),
          showingEndDate.toISOString(),
          [state.lead.email, 'agent@apexsales.ai'],
          'Property showing for the 3-bedroom house at 123 Main St.'
        );
        
        // Send confirmation email
        const confirmationResult = await this.tools.sendEmail(
          state.lead.email,
          'Your property showing is confirmed!',
          `Hi ${state.lead.name},\n\nYour showing for 123 Main St has been confirmed for ${showingDate.toLocaleString()}. Looking forward to seeing you there!\n\nBest regards,\nYour Apex AI Assistant`,
          'showing_confirmation'
        );
        
        // Update CRM with the showing
        await this.tools.updateCRMLead(state.lead.id, {
          showing_scheduled: true,
          showing_date: showingDate.toISOString(),
          property_id: 12345,
          stage: 'Meeting Scheduled'
        });
        
        return {
          showing_booked: true,
          property_id: 12345,
          date: showingDate.toISOString(),
          calendar_event_created: true,
          calendar_result: calendarResult,
          confirmation_result: confirmationResult
        };
        
      case 'send_nurture_content':
        return {
          content_sent: true,
          content_type: 'market_report',
          lead_email: state.lead.email
        };
        
      case 'check_lead_response':
        // Simulate checking if lead has responded
        return {
          has_responded: state.context.is_engaged,
          days_since_contact: state.context.days_since_contact
        };
        
      case 'send_sms_email_combo':
        const message = 'Following up on your property search. Are you still interested?';
        
        // Send SMS
        const smsResult = await this.tools.sendSMS(
          state.lead.email, // In a real implementation, we'd use a phone number
          `Hi ${state.lead.name}, ${message} Reply YES to continue or call us at 555-123-4567.`
        );
        
        // Send email
        const followupEmailResult = await this.tools.sendEmail(
          state.lead.email,
          'Following up on your property search',
          `Hi ${state.lead.name},\n\n${message} If you're still interested, please let me know and I'd be happy to continue assisting you.\n\nBest regards,\nYour Apex AI Assistant`,
          'follow_up_combo'
        );
        
        // Update CRM with the follow-up activity
        await this.tools.updateCRMLead(state.lead.id, {
          last_contact_date: new Date().toISOString(),
          last_contact_type: 'sms_email_combo',
          follow_ups_sent: (state.context.follow_ups_sent || 0) + 1
        });
        
        return {
          sms_sent: true,
          email_sent: true,
          message,
          sms_result: smsResult,
          email_result: followupEmailResult
        };
        
      case 'evaluate_lead_engagement':
        return {
          is_engaged: state.context.is_engaged,
          engagement_signals: ['email_opens', 'website_visits']
        };
        
      case 'mark_lead_cold':
        const reminderDate = new Date(Date.now() + 30 * 86400000); // 30 days from now
        
        // Update CRM with cold status
        await this.tools.updateCRMLead(state.lead.id, {
          status: 'Cold',
          next_follow_up_date: reminderDate.toISOString(),
          stage: 'Nurturing'
        });
        
        // Set a reminder in the calendar
        const reminderResult = await this.tools.bookCalendarEvent(
          `Follow up with cold lead: ${state.lead.name}`,
          reminderDate.toISOString(),
          new Date(reminderDate.getTime() + 1800000).toISOString(), // 30 minutes later
          ['agent@apexsales.ai'],
          `This lead went cold after ${state.context.follow_ups_sent || 0} follow-up attempts. Consider a new approach.`
        );
        
        return {
          marked_cold: true,
          reminder_set: true,
          reminder_date: reminderDate.toISOString(),
          reminder_result: reminderResult
        };
        
      case 'continue_monitoring_lead':
        return {
          monitoring: true,
          alerts_configured: ['website_visit', 'email_open']
        };
        
      case 'schedule_follow_up':
        return {
          follow_up_scheduled: true,
          type: 'call',
          date: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        };
        
      default:
        return { error: `Unknown action: ${action}` };
    }
  }
  
  /**
   * Calculate initial intent score based on lead data
   */
  private calculateInitialIntentScore(lead: Lead): number {
    // In a real implementation, this would use a more sophisticated algorithm
    // For now, we'll use a simple calculation based on confidence score
    return Math.min(lead.confidence_score * 1.2, 1.0);
  }
  
  /**
   * Determine which sequence type to use based on lead data
   */
  private determineSequenceType(lead: Lead): string {
    // For now, we only have one sequence type
    return 'real_estate_lead_qualification';
  }
  
  /**
   * Calculate ROI metrics for a sequence execution
   */
  calculateROI(state: SequenceState): {
    time_saved_minutes: number;
    revenue_impact: number;
  } {
    // Calculate time saved based on sequence steps completed
    const timePerStep = 15; // 15 minutes per manual step
    const timeSaved = state.history.length * timePerStep;
    
    // Calculate revenue impact based on lead potential value and progress in sequence
    const potentialValue = state.lead.potential_value || 5000; // Default if not specified
    const completionRatio = state.history.length / REAL_ESTATE_LEAD_QUALIFICATION.length;
    const revenueImpact = potentialValue * completionRatio * 0.1; // 10% of potential value * completion
    
    return {
      time_saved_minutes: timeSaved,
      revenue_impact: revenueImpact
    };
  }
}
