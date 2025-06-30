/**
 * Types for LangGraph agent implementation
 */

/**
 * Industry verticals supported by the agent
 */
export enum IndustryVertical {
  REAL_ESTATE = 'real_estate',
  MORTGAGE = 'mortgage',
  MSP = 'msp',
  CONSULTING = 'consulting',
  SOLAR = 'solar',
  HVAC = 'hvac',
}

/**
 * Agent state interface
 */
export interface AgentState {
  // Core state
  messages: AgentMessage[];
  vertical: IndustryVertical;
  currentStep: string;
  
  // Context and memory
  context: Record<string, any>;
  memory: Record<string, any>;
  
  // Task tracking
  tasks: AgentTask[];
  completedTasks: AgentTask[];
  
  // CRM integration
  crmProvider: 'dataverse' | 'hubspot' | null;
  crmData: Record<string, any> | null;
  
  // Error handling
  errors: AgentError[];
  fallbackTriggered: boolean;
}

/**
 * Agent message interface
 */
export interface AgentMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Agent task interface
 */
export interface AgentTask {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created: Date;
  updated: Date;
  result?: any;
  error?: string;
}

/**
 * Agent error interface
 */
export interface AgentError {
  message: string;
  timestamp: Date;
  source: string;
  context?: Record<string, any>;
}

/**
 * Agent behavior tracking event
 */
export interface AgentBehaviorEvent {
  eventType: 'action' | 'fallback' | 'handoff' | 'decision';
  timestamp: Date;
  vertical: IndustryVertical;
  details: Record<string, any>;
  conversationId: string;
}

/**
 * Agent node types for LangGraph
 */
export enum AgentNodeType {
  ROUTER = 'router',
  PLANNER = 'planner',
  EXECUTOR = 'executor',
  VERTICAL_SPECIALIST = 'vertical_specialist',
  FALLBACK = 'fallback',
}

/**
 * Agent action types
 */
export enum AgentActionType {
  COLLECT_INFO = 'collect_info',
  UPDATE_CRM = 'update_crm',
  SCHEDULE_MEETING = 'schedule_meeting',
  SEND_EMAIL = 'send_email',
  GENERATE_DOCUMENT = 'generate_document',
  HANDOFF = 'handoff',
  FOLLOW_UP = 'follow_up',
}
