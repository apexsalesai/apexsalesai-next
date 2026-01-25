/**
 * Error handling utilities for the Apex AI Revenue Operator
 * Provides standardized error handling, retry logic, and fallback mechanisms
 */
import { logger } from './logger';

export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
  maxDelayMs: number;
}

export interface FallbackConfig {
  enableRetry: boolean;
  enableSimplifiedAction: boolean;
  enableHumanEscalation: boolean;
  retryConfig: RetryConfig;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffFactor: 2,
  maxDelayMs: 10000
};

export const DEFAULT_FALLBACK_CONFIG: FallbackConfig = {
  enableRetry: true,
  enableSimplifiedAction: true,
  enableHumanEscalation: true,
  retryConfig: DEFAULT_RETRY_CONFIG
};

/**
 * Error categories for agent actions
 */
export enum ErrorCategory {
  NETWORK = 'network',
  API = 'api',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

/**
 * Categorize an error based on its properties or message
 */
export function categorizeError(error: Error): ErrorCategory {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('connection') || message.includes('econnrefused')) {
    return ErrorCategory.NETWORK;
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return ErrorCategory.TIMEOUT;
  }
  
  if (message.includes('auth') || message.includes('token') || message.includes('unauthorized') || message.includes('401')) {
    return ErrorCategory.AUTHENTICATION;
  }
  
  if (message.includes('permission') || message.includes('forbidden') || message.includes('403')) {
    return ErrorCategory.PERMISSION;
  }
  
  if (message.includes('validation') || message.includes('invalid') || message.includes('400')) {
    return ErrorCategory.VALIDATION;
  }
  
  if (message.includes('api') || message.includes('endpoint') || message.includes('service')) {
    return ErrorCategory.API;
  }
  
  return ErrorCategory.UNKNOWN;
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  context: string = 'operation'
): Promise<T> {
  let lastError: Error | null = null;
  let delay = config.initialDelayMs;
  
  for (let attempt = 1; attempt <= config.maxRetries + 1; attempt++) {
    try {
      if (attempt > 1) {
        logger.info(`Retry attempt ${attempt - 1} for ${context}`, {
          context: 'retry',
          metadata: { attempt, maxRetries: config.maxRetries }
        });
      }
      
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      const category = categorizeError(lastError);
      
      // Don't retry certain error categories
      if (category === ErrorCategory.PERMISSION || category === ErrorCategory.VALIDATION) {
        logger.error(`Not retrying ${context} due to ${category} error`, lastError, {
          context: 'retry',
          metadata: { attempt, category }
        });
        throw lastError;
      }
      
      if (attempt > config.maxRetries) {
        logger.error(`All retry attempts failed for ${context}`, lastError, {
          context: 'retry',
          metadata: { attempts: attempt, maxRetries: config.maxRetries }
        });
        throw lastError;
      }
      
      logger.warn(`Error in ${context}, will retry`, {
        context: 'retry',
        metadata: {
          attempt,
          error: lastError.message,
          category,
          nextDelayMs: delay
        }
      });
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff with max delay cap
      delay = Math.min(delay * config.backoffFactor, config.maxDelayMs);
    }
  }
  
  // This should never happen due to the throw in the loop
  throw lastError || new Error(`Failed to execute ${context} after ${config.maxRetries} retries`);
}

/**
 * Create a simplified version of an action result
 * Used when the primary action fails but we can still provide some value
 */
export function createSimplifiedAction(
  actionId: string,
  originalError: Error
): Record<string, any> {
  // Default simplified result
  const simplified: Record<string, any> = {
    success: false,
    simplified_fallback: true,
    original_error: originalError.message,
    error_category: categorizeError(originalError)
  };
  
  // Action-specific simplified results
  switch (actionId) {
    case 'send_qualification_email':
      return {
        ...simplified,
        questions_sent: false,
        fallback_action: 'notification_created',
        notification_message: 'Lead qualification email could not be sent. Please follow up manually.'
      };
      
    case 'book_showing':
      return {
        ...simplified,
        showing_booked: false,
        fallback_action: 'calendar_placeholder_created',
        calendar_message: 'Property showing could not be automatically scheduled. Please contact lead to arrange manually.'
      };
      
    case 'evaluate_lead_intent':
      return {
        ...simplified,
        intent_score: 0.5, // Default to medium intent when evaluation fails
        is_high_intent: false,
        confidence: 'low',
        fallback_action: 'default_scoring_applied'
      };
      
    default:
      return {
        ...simplified,
        fallback_action: 'human_notification_created',
        requires_human_attention: true
      };
  }
}

/**
 * Create a human escalation task for a failed action
 */
export async function createHumanEscalation(
  actionId: string,
  leadId: number,
  error: Error,
  context: Record<string, any> = {}
): Promise<Record<string, any>> {
  const escalationId = `escalation-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  const escalation = {
    id: escalationId,
    lead_id: leadId,
    failed_action: actionId,
    error_message: error.message,
    error_category: categorizeError(error),
    context,
    status: 'pending',
    created_at: new Date().toISOString(),
    priority: getPriorityForAction(actionId)
  };
  
  logger.info(`Created human escalation for failed action ${actionId}`, {
    context: 'human_escalation',
    metadata: escalation
  });
  
  // In a real implementation, this would save to database and notify humans
  // For now, we'll just log it
  
  return {
    escalation_created: true,
    escalation_id: escalationId,
    requires_human_attention: true,
    priority: escalation.priority
  };
}

/**
 * Get priority level for an action (used for human escalation)
 */
function getPriorityForAction(actionId: string): 'high' | 'medium' | 'low' {
  // Critical actions that need immediate human attention
  const highPriorityActions = [
    'book_showing',
    'close_deal',
    'handle_objection',
    'respond_to_urgent_inquiry'
  ];
  
  // Important but not time-critical actions
  const mediumPriorityActions = [
    'send_qualification_email',
    'evaluate_lead_intent',
    'schedule_follow_up'
  ];
  
  if (highPriorityActions.includes(actionId)) {
    return 'high';
  }
  
  if (mediumPriorityActions.includes(actionId)) {
    return 'medium';
  }
  
  return 'low';
}
