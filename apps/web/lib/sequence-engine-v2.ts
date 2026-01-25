// Autonomous Sequence Engine V2 for Apex AI Revenue Operator
import { Lead } from 'types/agent';
import { 
  SequenceStep, 
  SequenceState, 
  SequenceStepExecution,
  SequenceExecutionMetrics,
  SequenceDefinition
} from 'types/sequence';
import { SequenceStorage } from './sequence-storage';
import { AgentTools } from './agent-tools';
import { 
  getSequenceDefinition, 
  getSequenceAction 
} from './sequences/sequence-integration';

// Import vertical-specific logic
import {
  determineVerticalForLead,
  determineSequenceForLead,
  getActionHandler
} from './agent/vertical-integration';

// Import error handling utilities
import {
  withRetry,
  createSimplifiedAction,
  createHumanEscalation,
  DEFAULT_FALLBACK_CONFIG,
  FallbackConfig
} from './error-handling';
import { logger } from './logger';

/**
 * SequenceEngine V2 - Enhanced core logic for executing autonomous multi-step sequences
 * This version integrates with the new sequence registry system and supports dynamic sequence loading
 */
export class SequenceEngineV2 {
  private storage: SequenceStorage;
  private tools: AgentTools;
  private fallbackConfig: FallbackConfig;
  
  constructor(fallbackConfig: FallbackConfig = DEFAULT_FALLBACK_CONFIG) {
    this.storage = new SequenceStorage();
    this.tools = new AgentTools();
    this.fallbackConfig = fallbackConfig;
    
    logger.info('SequenceEngineV2 initialized', {
      context: 'sequence_engine',
      metadata: { fallbackConfig }
    });
  }
  
  /**
   * Calculate initial intent score based on lead data
   */
  private calculateInitialIntentScore(lead: Lead): number {
    // In a real implementation, this would use a more sophisticated algorithm
    // For now, we'll use a simple calculation based on confidence score if available
    if (typeof lead.confidence_score === 'number') {
      return Math.min(lead.confidence_score * 1.2, 1.0);
    }
    return 0.5; // Default medium intent
  }
  
  /**
   * Initialize a new sequence for a lead
   */
  async initializeSequence(lead: Lead, sequenceId?: string): Promise<SequenceState> {
    // Check if we already have a sequence for this lead
    const existingState = await this.storage.getSequenceState(lead.id);
    if (existingState && existingState.status === 'active') {
      console.log(`Resuming existing sequence for lead ${lead.id}`);
      return existingState;
    }
    
    // Determine the vertical domain for this lead
    const verticalDomain = determineVerticalForLead(lead);
    console.log(`Determined vertical domain: ${verticalDomain} for lead ${lead.id}`);
    
    // If no sequence ID is provided, determine the appropriate sequence based on lead data and vertical
    let sequenceDefinition: SequenceDefinition | undefined;
    
    if (sequenceId) {
      // If a specific sequence ID was requested, try to get it from the registry
      sequenceDefinition = getSequenceDefinition(sequenceId);
    } else {
      // Otherwise determine the best sequence for this lead based on its vertical and properties
      sequenceDefinition = determineSequenceForLead(lead);
    }
    
    if (!sequenceDefinition) {
      throw new Error(`Could not determine appropriate sequence for lead ${lead.id}`);
    }
    
    // Validate the sequence definition
    if (!sequenceDefinition.steps || sequenceDefinition.steps.length === 0) {
      throw new Error(`Sequence ${sequenceDefinition.id} has no steps`);
    }
    
    // Start with the first step in the sequence
    const firstStep = sequenceDefinition.steps[0];
    
    const newState: SequenceState = {
      lead,
      current_step_id: firstStep.id,
      history: [],
      context: {
        // Initialize context with lead data and any other relevant info
        lead_data: lead,
        intent_score: this.calculateInitialIntentScore(lead),
        days_since_contact: 0,
        is_engaged: true,
        vertical_domain: verticalDomain
      },
      status: 'active' as const,
      sequence_type: sequenceDefinition.id,
      domain: verticalDomain
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
   * Process the current step in a sequence with robust error handling and fallback strategies
   * @param state The current sequence state
   * @returns Updated sequence state after processing the step
   */
  async processCurrentStep(state: SequenceState): Promise<SequenceState> {
    logger.info(`Processing step ${state.current_step_id} for lead ${state.lead.id}`, {
      context: 'sequence_engine',
      metadata: { leadId: state.lead.id, stepId: state.current_step_id, sequenceType: state.sequence_type }
    });
    
    // Get the sequence definition
    const sequenceDef = getSequenceDefinition(state.sequence_type || '');
    if (!sequenceDef) {
      const error = new Error(`Unknown sequence type: ${state.sequence_type}`);
      logger.error('Failed to get sequence definition', error, {
        context: 'sequence_engine',
        metadata: { sequenceType: state.sequence_type, leadId: state.lead.id }
      });
      throw error;
    }
    
    // Find the current step in the sequence
    const currentStep = sequenceDef.steps.find(step => step.id === state.current_step_id);
    if (!currentStep) {
      const error = new Error(`Unknown step ${state.current_step_id} in sequence ${state.sequence_type}`);
      logger.error('Failed to find current step', error, {
        context: 'sequence_engine',
        metadata: { stepId: state.current_step_id, sequenceType: state.sequence_type, leadId: state.lead.id }
      });
      throw error;
    }
    
    // Create a new execution record for this step
    const execution: SequenceStepExecution = {
      step_id: currentStep.id,
      action: currentStep.action,
      timestamp: new Date().toISOString(),
      result: null,
      metrics: {
        time_saved_minutes: 0,
        revenue_impact: 0
      }
    };
    
    // Add this execution to the history
    state.history.push(execution);
    
    // Track retry attempts and result
    let retryCount = 0;
    let actionResult: any = null;
    
    try {
      logger.info(`Executing action ${currentStep.action} for step ${currentStep.id}`, {
        context: 'sequence_engine',
        metadata: { leadId: state.lead.id, stepId: currentStep.id, action: currentStep.action }
      });
      
      // Use withRetry to automatically handle retries with exponential backoff
      if (this.fallbackConfig.enableRetry) {
        try {
          actionResult = await withRetry(
            async () => {
              try {
                retryCount++;
                if (retryCount > 1) {
                  logger.info(`Retry attempt ${retryCount-1} for action ${currentStep.action}`, {
                    context: 'sequence_engine',
                    metadata: { leadId: state.lead.id, stepId: currentStep.id, attempt: retryCount }
                  });
                }
                
                // Ensure both parameters are strings and not undefined
                const sequenceType = state.sequence_type || '';
                const actionId = currentStep.action || '';
                return await this.executeAction(
                  sequenceType,
                  actionId,
                  state
                );
              } catch (actionError) {
                const actionErrorObj = actionError instanceof Error ? actionError : new Error(String(actionError));
                logger.warn(`Action execution failed (attempt ${retryCount}): ${actionErrorObj.message}`);
                logger.warn('Action execution details', {
                  context: 'sequence_engine',
                  metadata: { 
                    leadId: state.lead.id, 
                    stepId: currentStep.id, 
                    action: currentStep.action,
                    retryCount
                  }
                });
                
                // Rethrow to let withRetry handle it
                throw actionError;
              }
            },
            this.fallbackConfig.retryConfig,
            `execute action ${currentStep.action} for step ${currentStep.id}`
          );
        } catch (retryError) {
          // All retries failed, proceed to fallback strategies
          throw retryError;
        }
      } else {
        // Retry disabled, execute once
        const sequenceType = state.sequence_type || '';
        const actionId = currentStep.action || '';
        actionResult = await this.executeAction(
          sequenceType,
          actionId,
          state
        );
      }
      
      // Record the successful execution
      execution.result = actionResult;
      
      // Default metrics if not provided by the action
      if (actionResult && typeof actionResult === 'object' && 'metrics' in actionResult) {
        execution.metrics = actionResult.metrics as SequenceExecutionMetrics;
      } else {
        execution.metrics = {
          time_saved_minutes: 10, // Default time saved per action
          revenue_impact: 0
        };
      }
      
      logger.info(`Successfully executed step ${currentStep.id}`, {
        context: 'sequence_engine',
        metadata: { 
          leadId: state.lead.id, 
          stepId: currentStep.id, 
          action: currentStep.action,
          retryCount
        }
      });
    } catch (executeError) {
      const error = executeError instanceof Error ? executeError : new Error(String(executeError));
      
      // All retries failed, try fallback strategies
      logger.error(`Action failed for step ${currentStep.id}`, error, {
        context: 'sequence_engine',
        metadata: { 
          leadId: state.lead.id, 
          stepId: currentStep.id, 
          action: currentStep.action,
          retryCount
        }
      });
      
      // Try fallback strategies in order of preference
      let fallbackUsed = false;
      let fallbackType = '';
      
      try {
        if (this.fallbackConfig.enableSimplifiedAction) {
          // Try simplified version of the action
          logger.info(`Attempting simplified action for ${currentStep.action}`, {
            context: 'sequence_engine',
            metadata: { leadId: state.lead.id, stepId: currentStep.id, action: currentStep.action }
          });
          
          actionResult = createSimplifiedAction(currentStep.action || '', error);
          fallbackUsed = true;
          fallbackType = 'simplified';
          
          logger.info(`Successfully executed simplified action for ${currentStep.action}`, {
            context: 'sequence_engine',
            metadata: { leadId: state.lead.id, stepId: currentStep.id }
          });
        } else if (this.fallbackConfig.enableHumanEscalation) {
          // Create a human escalation task
          logger.info(`Creating human escalation for failed step ${currentStep.id}`, {
            context: 'sequence_engine',
            metadata: { leadId: state.lead.id, stepId: currentStep.id, action: currentStep.action }
          });
          
          actionResult = await createHumanEscalation(
            currentStep.action || '', 
            state.lead.id, 
            error, 
            { 
              stepId: currentStep.id, 
              sequenceId: state.sequence_type || 'unknown',
              context: state.context
            }
          );
          fallbackUsed = true;
          fallbackType = 'human_escalation';
          
          logger.info(`Successfully created human escalation for step ${currentStep.id}`, {
            context: 'sequence_engine',
            metadata: { leadId: state.lead.id, stepId: currentStep.id }
          });
        } else {
          // No fallback strategies available or enabled
          throw error;
        }
        
        // Record the fallback execution
        execution.result = {
          ...actionResult,
          fallback_used: true,
          original_error: error.message
        };
        
        // Default metrics for fallback actions (typically lower value)
        execution.metrics = {
          time_saved_minutes: 5, // Reduced value for fallback actions
          revenue_impact: 0
        };
      } catch (fallbackError) {
        // Both primary action and fallbacks failed
        const finalError = fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
        
        logger.error(`All fallback strategies failed for step ${currentStep.id}`, finalError, {
          context: 'sequence_engine',
          metadata: { 
            leadId: state.lead.id, 
            stepId: currentStep.id, 
            originalError: error.message 
          }
        });
        
        // Record the failed execution
        execution.result = { error: error.message };
        
        // Update the sequence state with the failure
        const updatedState: SequenceState = {
          ...state,
          status: 'failed' as const,
          context: {
            ...state.context,
            last_error: error.message,
            last_updated: new Date().toISOString()
          }
        };
        
        // Save the updated state
        await this.storage.saveSequenceState(state.lead.id, updatedState);
        
        throw error;
      }
    }
    
    // Extract metrics from the result if available
    if (actionResult && typeof actionResult === 'object' && 'metrics' in actionResult) {
      execution.metrics = actionResult.metrics as SequenceExecutionMetrics;
    }
    
    // Update context with any new information from the result
    if (actionResult && typeof actionResult === 'object') {
      if ('context_updates' in actionResult && actionResult.context_updates) {
        state.context = {
          ...state.context,
          ...actionResult.context_updates
        };
        
        logger.debug('Updated sequence context', {
          context: 'sequence_engine',
          metadata: { 
            leadId: state.lead.id, 
            updates: actionResult.context_updates 
          }
        });
      }
    }
    
    // Determine the next step
    let nextStepId: string | null = null;
    
    // Evaluate conditions to determine next step
    if (currentStep.conditions && currentStep.conditions.length > 0 && currentStep.next_steps.length > 1) {
      // We have conditions and multiple next steps - evaluate them
      let conditionMet = false;
      
      for (const condition of currentStep.conditions) {
        const attributeValue = state.context[condition.attribute];
        
        switch (condition.operator) {
          case 'equals':
            conditionMet = attributeValue === condition.value;
            break;
          case 'not_equals':
            conditionMet = attributeValue !== condition.value;
            break;
          case 'greater_than':
            conditionMet = attributeValue > condition.value;
            break;
          case 'less_than':
            conditionMet = attributeValue < condition.value;
            break;
          case 'contains':
            conditionMet = String(attributeValue).includes(String(condition.value));
            break;
          default:
            conditionMet = false;
        }
        
        if (conditionMet) {
          nextStepId = currentStep.next_steps[0]; // First option if condition is met
          break;
        }
      }
      
      // If no conditions were met, use the fallback path
      if (!conditionMet) {
        nextStepId = currentStep.next_steps[1]; // Second option as fallback
      }
    } else if (currentStep.next_steps.length > 0) {
      // No conditions, just take the first next step
      nextStepId = currentStep.next_steps[0];
    } else {
      // No next steps, this is the end of the sequence
      nextStepId = null;
    }
    
    // Create updated state with new history entry
    const updatedState: SequenceState = {
      ...state,
      history: state.history, // We already pushed the execution to history earlier
      current_step_id: nextStepId || state.current_step_id,
      status: nextStepId ? 'active' : 'completed',
      context: {
        ...state.context,
        last_result: actionResult,
        last_step_id: currentStep.id,
        last_action: currentStep.action,
        last_execution_time: execution.timestamp,
        last_updated: new Date().toISOString()
      }
    };
    
    // Save the updated state
    await this.storage.saveSequenceState(state.lead.id, updatedState);
    
    return updatedState;
  }
  
  /**
   * Execute a specific action for a sequence step
   * @param sequenceId The ID of the sequence
   * @param actionId The ID of the action to execute
   * @param state The current sequence state
   * @returns The result of the action execution
   */
  async executeAction(sequenceId: string, actionId: string, state: SequenceState): Promise<any> {
    console.log(`Executing action ${actionId} for sequence ${sequenceId}`);
    
    // First check if this action is handled by the vertical-specific handler
    if (state.domain) {
      try {
        const verticalActionHandler = getActionHandler(actionId, state.domain);
        if (verticalActionHandler) {
          console.log(`Using vertical-specific action handler for ${actionId} in domain ${state.domain}`);
          return await verticalActionHandler(state);
        }
      } catch (error) {
        console.error(`Error executing vertical action ${actionId}:`, error);
        // Continue to next handler on error
      }
    }
    
    // Then check if this action is registered in the sequence integration
    try {
      const registeredAction = getSequenceAction(sequenceId, actionId);
      if (registeredAction) {
        console.log(`Using registered action handler for ${actionId} in sequence ${sequenceId}`);
        return await registeredAction(state);
      }
    } catch (error) {
      console.error(`Error executing registered action ${actionId}:`, error);
      // Continue to fallback on error
    }
    
    // Map common action names to legacy implementations
    // This is crucial for backward compatibility and fixing the sequence engine failure after step 1
    const actionMap: Record<string, string> = {
      'send_greeting_email': 'greet_lead',
      'send_qualification_questions': 'ask_qualification_questions',
      'check_mortgage_preapproval': 'evaluate_lead_intent',
      'send_showing_calendar': 'book_showing'
    };
    
    // Use mapped action ID if available
    const mappedActionId = actionMap[actionId] || actionId;
    console.log(`Using fallback implementation for action ${actionId} (mapped to ${mappedActionId})`);
    
    // Fallback to built-in action implementations
    switch (mappedActionId) {
      case 'greet_lead':
        // Send a greeting email to the lead
        const emailResult = await this.tools.sendEmail(
          state.lead.email,
          `Hi ${state.lead.name}, nice to connect!`,
          `Hello ${state.lead.name},\n\nThank you for your interest. I'm your AI assistant and I'll be helping you through the process. What questions can I answer for you today?\n\nBest regards,\nYour Apex AI Assistant`,
          'greeting'
        );
        
        // Update CRM with the greeting activity
        await this.tools.updateCRMLead(state.lead.id, {
          greeted: true,
          last_contact: new Date().toISOString()
        });
        
        return {
          email_sent: true,
          email_result: emailResult
        };
        
      case 'ask_qualification_questions':
        // Generate qualification questions based on the vertical
        const questions = state.domain === 'real_estate' 
          ? [
              "Are you looking to buy or sell a property?",
              "What's your timeline for moving?",
              "Have you been pre-approved for a mortgage?",
              "What's your budget range?",
              "What areas are you interested in?"
            ]
          : [
              "What type of mortgage are you looking for?",
              "What's your credit score range?",
              "How much are you looking to borrow?",
              "Do you have a down payment saved?",
              "When are you looking to close?"
            ];
        
        // Send the questions via email
        const emailBody = `Hello ${state.lead.name},

To better assist you, I'd like to ask a few questions:

${questions.map((q, i) => `${i+1}. ${q}`).join('\n')}

Please reply to this email with your answers.

Best regards,
Your Apex AI Assistant`;
        
        const questionEmailResult = await this.tools.sendEmail(
          state.lead.email,
          "A few questions to better assist you",
          emailBody,
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
          email_result: questionEmailResult,
          metrics: {
            time_saved_minutes: 20,
            revenue_impact: 0
          }
        };
        
      case 'evaluate_lead_intent':
        // In a real implementation, this would analyze responses
        // For now, we'll use the intent score from context
        const intentScore = state.context.intent_score || 0.5;
        return {
          intent_score: intentScore,
          is_high_intent: intentScore > 0.7,
          confidence: intentScore > 0.8 ? 'high' : intentScore > 0.5 ? 'medium' : 'low',
          metrics: {
            time_saved_minutes: 30,
            revenue_impact: intentScore > 0.7 ? 250 : 0
          }
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
        
      default:
        return { error: `Unknown action: ${actionId}` };
    }
  }
  
  /**
   * Calculate ROI metrics for a sequence execution
   */
  calculateROI(state: SequenceState): {
    time_saved_minutes: number;
    revenue_impact: number;
    tasks_automated: number;
    deals_rescued: number;
  } {
    // Sum up metrics from all step executions
    let totalTimeSaved = 0;
    let totalRevenueImpact = 0;
    let tasksAutomated = 0;
    let dealsRescued = 0;
    
    state.history.forEach(execution => {
      if (execution.metrics) {
        totalTimeSaved += execution.metrics.time_saved_minutes || 0;
        totalRevenueImpact += execution.metrics.revenue_impact || 0;
        
        // Count each successful execution as an automated task
        if (execution.result && execution.result.success) {
          tasksAutomated++;
        }
        
        // Count deal rescues (when a cold lead is re-engaged)
        if (execution.result && 
            execution.result.context_updates && 
            execution.result.context_updates.status_change === 'cold_to_active') {
          dealsRescued++;
        }
      }
    });
    
    return {
      time_saved_minutes: totalTimeSaved,
      revenue_impact: totalRevenueImpact,
      tasks_automated: tasksAutomated,
      deals_rescued: dealsRescued
    };
  }
}
