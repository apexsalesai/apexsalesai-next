/**
 * Agent Behavior Tracker Service
 * Logs and manages real-time agent actions for demo visualization
 */

import { EventEmitter } from 'events';

export type AgentActionType = 
  | 'lead_created'
  | 'lead_updated' 
  | 'email_sent'
  | 'call_scheduled'
  | 'follow_up_created'
  | 'meeting_booked'
  | 'deal_progressed'
  | 'handoff_triggered'
  | 'decision_made'
  | 'workflow_started'
  | 'workflow_completed'
  | 'error_handled'
  | 'fallback_activated';

export type AgentVertical = 
  | 'realEstate'
  | 'mortgage'
  | 'msp'
  | 'consulting'
  | 'solar'
  | 'hvac';

export interface AgentBehaviorEvent {
  id: string;
  timestamp: Date;
  agentName: string;
  actionType: AgentActionType;
  vertical: AgentVertical;
  description: string;
  details: {
    leadId?: string;
    dealId?: string;
    outcome?: 'success' | 'failure' | 'pending';
    metadata?: Record<string, any>;
  };
  duration?: number; // milliseconds
  confidence?: number; // 0-1 scale
  nextAction?: string;
}

export interface AgentStats {
  totalActions: number;
  successRate: number;
  averageResponseTime: number;
  activeWorkflows: number;
  handoffRate: number;
  verticalBreakdown: Record<AgentVertical, number>;
}

class AgentBehaviorTracker extends EventEmitter {
  private events: AgentBehaviorEvent[] = [];
  private readonly maxEvents = 1000; // Keep last 1000 events
  private isRecording = true;

  constructor() {
    super();
    this.setMaxListeners(50); // Support multiple listeners
  }

  /**
   * Log a new agent behavior event
   */
  logAction(event: Omit<AgentBehaviorEvent, 'id' | 'timestamp'>): void {
    if (!this.isRecording) return;

    const behaviorEvent: AgentBehaviorEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    };

    // Add to events array (keep only last maxEvents)
    this.events.unshift(behaviorEvent);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Emit event for real-time listeners
    this.emit('behaviorEvent', behaviorEvent);
    this.emit(`action:${event.actionType}`, behaviorEvent);
    this.emit(`vertical:${event.vertical}`, behaviorEvent);

    console.log(`🤖 Agent Behavior: ${event.agentName} - ${event.description}`);
  }

  /**
   * Start a timed action (returns a function to complete it)
   */
  startTimedAction(
    agentName: string,
    actionType: AgentActionType,
    vertical: AgentVertical,
    description: string,
    details: AgentBehaviorEvent['details'] = {}
  ): () => void {
    const startTime = Date.now();
    
    // Log start event
    this.logAction({
      agentName,
      actionType,
      vertical,
      description: `${description} (started)`,
      details: { ...details, status: 'started' }
    });

    // Return completion function
    return (outcome: 'success' | 'failure' = 'success', finalDetails: Record<string, any> = {}) => {
      const duration = Date.now() - startTime;
      
      this.logAction({
        agentName,
        actionType,
        vertical,
        description: `${description} (${outcome})`,
        details: { 
          ...details, 
          ...finalDetails,
          outcome,
          status: 'completed'
        },
        duration
      });
    };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 50): AgentBehaviorEvent[] {
    return this.events.slice(0, limit);
  }

  /**
   * Get events by filter
   */
  getEventsByFilter(filter: {
    agentName?: string;
    actionType?: AgentActionType;
    vertical?: AgentVertical;
    outcome?: 'success' | 'failure' | 'pending';
    since?: Date;
  }): AgentBehaviorEvent[] {
    return this.events.filter(event => {
      if (filter.agentName && event.agentName !== filter.agentName) return false;
      if (filter.actionType && event.actionType !== filter.actionType) return false;
      if (filter.vertical && event.vertical !== filter.vertical) return false;
      if (filter.outcome && event.details.outcome !== filter.outcome) return false;
      if (filter.since && event.timestamp < filter.since) return false;
      return true;
    });
  }

  /**
   * Get agent statistics
   */
  getAgentStats(agentName?: string): AgentStats {
    const relevantEvents = agentName 
      ? this.events.filter(e => e.agentName === agentName)
      : this.events;

    const totalActions = relevantEvents.length;
    const successfulActions = relevantEvents.filter(e => e.details.outcome === 'success').length;
    const handoffs = relevantEvents.filter(e => e.actionType === 'handoff_triggered').length;
    
    const durations = relevantEvents
      .filter(e => e.duration)
      .map(e => e.duration!);
    
    const averageResponseTime = durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0;

    const activeWorkflows = relevantEvents
      .filter(e => e.actionType === 'workflow_started')
      .length - relevantEvents.filter(e => e.actionType === 'workflow_completed').length;

    const verticalBreakdown: Record<AgentVertical, number> = {
      realEstate: 0,
      mortgage: 0,
      msp: 0,
      consulting: 0,
      solar: 0,
      hvac: 0
    };

    relevantEvents.forEach(event => {
      verticalBreakdown[event.vertical]++;
    });

    return {
      totalActions,
      successRate: totalActions > 0 ? successfulActions / totalActions : 0,
      averageResponseTime,
      activeWorkflows: Math.max(0, activeWorkflows),
      handoffRate: totalActions > 0 ? handoffs / totalActions : 0,
      verticalBreakdown
    };
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.events = [];
    this.emit('eventsCleared');
  }

  /**
   * Start/stop recording
   */
  setRecording(isRecording: boolean): void {
    this.isRecording = isRecording;
    this.emit('recordingChanged', isRecording);
  }

  /**
   * Export events for analysis
   */
  exportEvents(): string {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      totalEvents: this.events.length,
      events: this.events
    }, null, 2);
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Global singleton instance
export const agentBehaviorTracker = new AgentBehaviorTracker();

// Helper functions for common actions
export const AgentActions = {
  leadCreated: (agentName: string, vertical: AgentVertical, leadId: string, source: string) => {
    agentBehaviorTracker.logAction({
      agentName,
      actionType: 'lead_created',
      vertical,
      description: `📝 Created new ${vertical} lead from ${source}`,
      details: { leadId, source }
    });
  },

  emailSent: (agentName: string, vertical: AgentVertical, leadId: string, emailType: string) => {
    agentBehaviorTracker.logAction({
      agentName,
      actionType: 'email_sent',
      vertical,
      description: `📨 Sent ${emailType} email to lead`,
      details: { leadId, emailType, outcome: 'success' }
    });
  },

  meetingBooked: (agentName: string, vertical: AgentVertical, leadId: string, meetingTime: string) => {
    agentBehaviorTracker.logAction({
      agentName,
      actionType: 'meeting_booked',
      vertical,
      description: `📅 Booked ${vertical} meeting for ${meetingTime}`,
      details: { leadId, meetingTime, outcome: 'success' }
    });
  },

  workflowStarted: (agentName: string, vertical: AgentVertical, workflowName: string, leadId?: string) => {
    agentBehaviorTracker.logAction({
      agentName,
      actionType: 'workflow_started',
      vertical,
      description: `🔄 Started ${workflowName} workflow`,
      details: { leadId, workflowName }
    });
  },

  handoffTriggered: (agentName: string, vertical: AgentVertical, reason: string, leadId?: string) => {
    agentBehaviorTracker.logAction({
      agentName,
      actionType: 'handoff_triggered',
      vertical,
      description: `👤 Triggered human handoff: ${reason}`,
      details: { leadId, reason, outcome: 'pending' }
    });
  },

  decisionMade: (agentName: string, vertical: AgentVertical, decision: string, confidence: number, leadId?: string) => {
    agentBehaviorTracker.logAction({
      agentName,
      actionType: 'decision_made',
      vertical,
      description: `🧠 Made decision: ${decision}`,
      details: { leadId, decision, outcome: 'success' },
      confidence
    });
  }
};
