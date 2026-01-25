/**
 * Demo Agent Actions Generator
 * Creates realistic agent behavior events for demo purposes
 */

import { AgentActions, agentBehaviorTracker, AgentVertical } from './agentBehaviorTracker';

export class DemoAgentActionsGenerator {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  private readonly demoScenarios = [
    {
      vertical: 'realEstate' as AgentVertical,
      agent: 'Max-RealEstate',
      scenarios: [
        () => AgentActions.leadCreated('Max-RealEstate', 'realEstate', 'lead_001', 'Website Form'),
        () => AgentActions.emailSent('Max-RealEstate', 'realEstate', 'lead_001', 'Welcome Sequence'),
        () => AgentActions.meetingBooked('Max-RealEstate', 'realEstate', 'lead_001', 'Tomorrow 2:00 PM'),
        () => AgentActions.workflowStarted('Max-RealEstate', 'realEstate', 'Property Search', 'lead_001'),
        () => AgentActions.decisionMade('Max-RealEstate', 'realEstate', 'Qualify lead for luxury segment', 0.85, 'lead_001')
      ]
    },
    {
      vertical: 'mortgage' as AgentVertical,
      agent: 'Max-Mortgage',
      scenarios: [
        () => AgentActions.leadCreated('Max-Mortgage', 'mortgage', 'lead_002', 'Referral Partner'),
        () => AgentActions.workflowStarted('Max-Mortgage', 'mortgage', 'Pre-qualification', 'lead_002'),
        () => AgentActions.emailSent('Max-Mortgage', 'mortgage', 'lead_002', 'Rate Quote'),
        () => AgentActions.decisionMade('Max-Mortgage', 'mortgage', 'Approve pre-qualification', 0.92, 'lead_002')
      ]
    },
    {
      vertical: 'msp' as AgentVertical,
      agent: 'Max-MSP',
      scenarios: [
        () => AgentActions.leadCreated('Max-MSP', 'msp', 'lead_003', 'LinkedIn Outreach'),
        () => AgentActions.workflowStarted('Max-MSP', 'msp', 'IT Assessment', 'lead_003'),
        () => AgentActions.meetingBooked('Max-MSP', 'msp', 'lead_003', 'Friday 10:00 AM'),
        () => AgentActions.decisionMade('Max-MSP', 'msp', 'Schedule security audit', 0.78, 'lead_003')
      ]
    },
    {
      vertical: 'consulting' as AgentVertical,
      agent: 'Max-Consulting',
      scenarios: [
        () => AgentActions.leadCreated('Max-Consulting', 'consulting', 'lead_004', 'Cold Email'),
        () => AgentActions.emailSent('Max-Consulting', 'consulting', 'lead_004', 'Case Study'),
        () => AgentActions.workflowStarted('Max-Consulting', 'consulting', 'Discovery Call', 'lead_004')
      ]
    },
    {
      vertical: 'solar' as AgentVertical,
      agent: 'Max-Solar',
      scenarios: [
        () => AgentActions.leadCreated('Max-Solar', 'solar', 'lead_005', 'Facebook Ad'),
        () => AgentActions.workflowStarted('Max-Solar', 'solar', 'Energy Audit', 'lead_005'),
        () => AgentActions.meetingBooked('Max-Solar', 'solar', 'lead_005', 'Next Tuesday 3:00 PM'),
        () => AgentActions.decisionMade('Max-Solar', 'solar', 'Recommend 8kW system', 0.89, 'lead_005')
      ]
    }
  ];

  /**
   * Start generating demo agent actions
   */
  startDemo(intervalMs = 3000): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🎬 Starting Agent Behavior Demo...');
    
    // Generate some initial actions immediately
    this.generateRandomAction();
    this.generateRandomAction();
    this.generateRandomAction();
    
    // Continue generating actions at intervals
    this.intervalId = setInterval(() => {
      this.generateRandomAction();
      
      // Occasionally generate multiple rapid actions (burst activity)
      if (Math.random() < 0.3) {
        setTimeout(() => this.generateRandomAction(), 500);
      }
    }, intervalMs);
  }

  /**
   * Stop generating demo actions
   */
  stopDemo(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🛑 Stopped Agent Behavior Demo');
  }

  /**
   * Generate a single random action
   */
  generateRandomAction(): void {
    const scenario = this.demoScenarios[Math.floor(Math.random() * this.demoScenarios.length)];
    const action = scenario.scenarios[Math.floor(Math.random() * scenario.scenarios.length)];
    
    // Add some realistic delay simulation
    setTimeout(() => {
      action();
    }, Math.random() * 1000);
  }

  /**
   * Generate a specific demo workflow
   */
  async generateWorkflowDemo(vertical: AgentVertical): Promise<void> {
    const scenario = this.demoScenarios.find(s => s.vertical === vertical);
    if (!scenario) return;

    console.log(`🎯 Running ${vertical} workflow demo...`);
    
    // Execute all actions in sequence with delays
    for (let i = 0; i < scenario.scenarios.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      scenario.scenarios[i]();
    }
  }

  /**
   * Generate handoff scenario (for demo wow factor)
   */
  generateHandoffScenario(): void {
    const scenarios = [
      () => AgentActions.handoffTriggered('Max-RealEstate', 'realEstate', 'Complex financing requirements', 'lead_006'),
      () => AgentActions.handoffTriggered('Max-MSP', 'msp', 'Custom integration needed', 'lead_007'),
      () => AgentActions.handoffTriggered('Max-Consulting', 'consulting', 'Executive-level decision required', 'lead_008')
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    scenario();
  }

  /**
   * Create a burst of activity (for impressive demos)
   */
  generateActivityBurst(): void {
    console.log('💥 Generating activity burst...');
    
    const actions = [
      () => AgentActions.leadCreated('Max-RealEstate', 'realEstate', 'burst_001', 'Zillow Integration'),
      () => AgentActions.leadCreated('Max-Mortgage', 'mortgage', 'burst_002', 'Rate Alert'),
      () => AgentActions.emailSent('Max-Solar', 'solar', 'burst_003', 'Savings Calculator'),
      () => AgentActions.meetingBooked('Max-MSP', 'msp', 'burst_004', 'Today 4:00 PM'),
      () => AgentActions.workflowStarted('Max-Consulting', 'consulting', 'Proposal Generation', 'burst_005'),
      () => AgentActions.decisionMade('Max-RealEstate', 'realEstate', 'Send MLS listings', 0.94, 'burst_001')
    ];
    
    // Execute actions with staggered timing
    actions.forEach((action, index) => {
      setTimeout(action, index * 300);
    });
  }

  /**
   * Simulate error handling and recovery
   */
  generateErrorRecoveryDemo(): void {
    console.log('⚠️ Simulating error recovery...');
    
    // Log an error
    agentBehaviorTracker.logAction({
      agentName: 'Max-RealEstate',
      actionType: 'error_handled',
      vertical: 'realEstate',
      description: '⚠️ API timeout encountered, switching to backup service',
      details: { 
        outcome: 'success',
        metadata: {
          error: 'Zillow API timeout',
          recovery: 'Using MLS backup'
        }
      }
    });
    
    // Then show successful recovery
    setTimeout(() => {
      AgentActions.decisionMade('Max-RealEstate', 'realEstate', 'Successfully retrieved listings via backup', 0.87);
    }, 1500);
  }

  /**
   * Check if demo is currently running
   */
  get isActive(): boolean {
    return this.isRunning;
  }
}

// Export singleton instance
export const demoAgentActions = new DemoAgentActionsGenerator();
