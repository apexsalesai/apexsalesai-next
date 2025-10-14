/**
 * LangGraph Agent Implementation for Apex AI Revenue Operator
 * 
 * This implements a multi-agent system with vertical-specific specialists
 * using a LangGraph-inspired architecture.
 */

import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { AgentState, AgentMessage, AgentTask, IndustryVertical, AgentNodeType, AgentBehaviorEvent } from './types';
import { ErrorLogger } from '@lib/utils/errorLogger';
import { getVerticalPrompt } from '@lib/services/agent/verticals';

// Initialize OpenAI with Azure configuration
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY || '',
  baseURL: process.env.AZURE_OPENAI_ENDPOINT 
    ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/gpt-4o`
    : undefined,
});

/**
 * Agent Behavior Tracker
 * Logs agent actions, fallbacks, and handoffs for analysis
 */
export class AgentBehaviorTracker {
  private static logDir = 'logs';
  private static logFile = 'agent-behavior.log';

  /**
   * Log an agent behavior event
   */
  static async logEvent(event: AgentBehaviorEvent): Promise<void> {
    try {
      // Log to file
      const logEntry = JSON.stringify({
        ...event,
        timestamp: event.timestamp.toISOString(),
      });

      // In a production environment, this would write to a database or file
      console.log(`[AgentBehaviorTracker] ${logEntry}`);
      
      // For now, we'll also log to the error logger for visibility
      ErrorLogger.logWindsurfError(
        'AgentBehaviorTracker',
        `Agent ${event.eventType} in ${event.vertical}`,
        event.details
      );
    } catch (error) {
      console.error('Failed to log agent behavior:', error);
    }
  }
}

/**
 * LangGraph Agent
 * Implements a multi-agent system with vertical-specific specialists
 */
export class LangGraphAgent {
  private state: AgentState;
  private conversationId: string;

  constructor(vertical: IndustryVertical = IndustryVertical.REAL_ESTATE) {
    this.conversationId = uuidv4();
    this.state = this.initializeState(vertical);
  }

  /**
   * Initialize agent state
   */
  private initializeState(vertical: IndustryVertical): AgentState {
    return {
      messages: [],
      vertical,
      currentStep: 'start',
      context: {},
      memory: {},
      tasks: [],
      completedTasks: [],
      crmProvider: 'dataverse',
      crmData: null,
      errors: [],
      fallbackTriggered: false,
    };
  }

  /**
   * Process a user message through the agent graph
   */
  async processMessage(message: string): Promise<string> {
    try {
      // Add user message to state
      this.addMessage('user', message);
      
      // Route to appropriate node based on current state
      const response = await this.routeMessage();
      
      // Add agent response to state
      this.addMessage('agent', response);
      
      return response;
    } catch (error) {
      // Handle errors and trigger fallback
      return this.handleError(error as Error);
    }
  }

  /**
   * Add a message to the conversation history
   */
  private addMessage(role: 'user' | 'agent' | 'system', content: string, metadata?: Record<string, any>): void {
    this.state.messages.push({
      role,
      content,
      timestamp: new Date(),
      metadata,
    });
  }

  /**
   * Route the message to the appropriate node in the graph
   */
  private async routeMessage(): Promise<string> {
    // Get the last user message
    const lastUserMessage = this.state.messages
      .filter(m => m.role === 'user')
      .pop();
    
    if (!lastUserMessage) {
      return "I'm sorry, I couldn't find your message. How can I help you today?";
    }

    // Determine which node to route to
    let nodeType: AgentNodeType;
    
    if (this.state.messages.length <= 2) {
      // First user message, use the router
      nodeType = AgentNodeType.ROUTER;
    } else if (this.state.fallbackTriggered) {
      // Error occurred, use fallback
      nodeType = AgentNodeType.FALLBACK;
    } else {
      // Use vertical specialist by default
      nodeType = AgentNodeType.VERTICAL_SPECIALIST;
    }

    // Process through the selected node
    return this.processNode(nodeType, lastUserMessage.content);
  }

  /**
   * Process a message through a specific node
   */
  private async processNode(nodeType: AgentNodeType, message: string): Promise<string> {
    // Log the node transition for behavior tracking
    await AgentBehaviorTracker.logEvent({
      eventType: 'action',
      timestamp: new Date(),
      vertical: this.state.vertical,
      details: {
        nodeType,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      },
      conversationId: this.conversationId,
    });

    switch (nodeType) {
      case AgentNodeType.ROUTER:
        return this.routerNode(message);
      case AgentNodeType.PLANNER:
        return this.plannerNode(message);
      case AgentNodeType.VERTICAL_SPECIALIST:
        return this.verticalSpecialistNode(message);
      case AgentNodeType.FALLBACK:
        return this.fallbackNode(message);
      default:
        return this.fallbackNode(message);
    }
  }

  /**
   * Router node - determines intent and routes to appropriate specialist
   */
  private async routerNode(message: string): Promise<string> {
    try {
      // Get vertical-specific system prompt
      const verticalPrompt = getVerticalPrompt(this.state.vertical);
      
      // Call OpenAI to determine intent
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // Will use Azure deployment
        messages: [
          { role: 'system', content: `You are Max, an AI sales assistant for ${this.state.vertical} professionals. ${verticalPrompt.systemPrompt}` },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message?.content || "I'm sorry, I couldn't process your request.";
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  /**
   * Planner node - creates a plan for complex requests
   */
  private async plannerNode(message: string): Promise<string> {
    try {
      // Get vertical-specific planning prompt
      const verticalPrompt = getVerticalPrompt(this.state.vertical);
      
      // Call OpenAI to create a plan
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: `You are a planning agent for ${this.state.vertical} sales workflows. ${verticalPrompt.planningPrompt}` },
          { role: 'user', content: message },
        ],
        temperature: 0.2,
        max_tokens: 1000,
      });

      // Extract tasks from the response
      const planText = response.choices[0].message?.content || '';
      
      // Create tasks based on the plan
      this.createTasksFromPlan(planText);
      
      return `I'll help you with that. Here's my plan:\n\n${planText}`;
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  /**
   * Vertical specialist node - handles industry-specific requests
   */
  private async verticalSpecialistNode(message: string): Promise<string> {
    try {
      // Get vertical-specific prompt
      const verticalPrompt = getVerticalPrompt(this.state.vertical);
      
      // Prepare conversation history (map agent role to assistant for OpenAI)
      const conversationHistory = this.state.messages.map(m => ({
        role: m.role === 'agent' ? 'assistant' as const : m.role as 'user' | 'system',
        content: m.content,
      }));
      
      // Call OpenAI with vertical-specific prompt
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: verticalPrompt.specialistPrompt },
          ...conversationHistory,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0].message?.content || "I'm sorry, I couldn't process your request.";
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  /**
   * Fallback node - handles errors and provides graceful degradation
   */
  private fallbackNode(message: string): string {
    // Reset fallback trigger
    this.state.fallbackTriggered = false;
    
    // Log fallback for behavior tracking
    AgentBehaviorTracker.logEvent({
      eventType: 'fallback',
      timestamp: new Date(),
      vertical: this.state.vertical,
      details: {
        reason: this.state.errors.length > 0 ? this.state.errors[this.state.errors.length - 1].message : 'Unknown error',
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      },
      conversationId: this.conversationId,
    });
    
    return "I'm sorry, I'm having trouble processing your request right now. Let me connect you with a human agent who can help you further. In the meantime, could you please provide more details about what you're looking for?";
  }

  /**
   * Handle errors and trigger fallback
   */
  private handleError(error: Error): string {
    console.error('Agent error:', error);
    
    // Add error to state
    this.state.errors.push({
      message: error.message,
      timestamp: new Date(),
      source: 'agent',
    });
    
    // Trigger fallback
    this.state.fallbackTriggered = true;
    
    // Log error for behavior tracking
    AgentBehaviorTracker.logEvent({
      eventType: 'error',
      timestamp: new Date(),
      vertical: this.state.vertical,
      details: {
        error: error.message,
        stack: error.stack,
      },
      conversationId: this.conversationId,
    });
    
    return this.fallbackNode('');
  }

  /**
   * Create tasks from a plan
   */
  private createTasksFromPlan(planText: string): void {
    // Simple task extraction - in a real implementation, this would be more sophisticated
    const taskLines = planText.split('\n').filter(line => line.includes('- [ ]'));
    
    taskLines.forEach(line => {
      const taskDescription = line.replace('- [ ]', '').trim();
      
      this.state.tasks.push({
        id: uuidv4(),
        type: 'plan_task',
        description: taskDescription,
        status: 'pending',
        created: new Date(),
        updated: new Date(),
      });
    });
  }

  /**
   * Get the current agent state
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Switch the agent's vertical
   */
  switchVertical(vertical: IndustryVertical): void {
    this.state.vertical = vertical;
    
    // Log vertical switch for behavior tracking
    AgentBehaviorTracker.logEvent({
      eventType: 'decision',
      timestamp: new Date(),
      vertical: vertical,
      details: {
        action: 'vertical_switch',
        previousVertical: this.state.vertical,
        newVertical: vertical,
      },
      conversationId: this.conversationId,
    });
    
    // Add system message about vertical switch
    this.addMessage('system', `Switching to ${vertical} specialist mode.`);
  }
}
