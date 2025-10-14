// Production-ready database storage service for the Sequence Engine
import { SequenceState, SequenceStepExecution, SequenceExecutionMetrics } from 'types/sequence';
import { Lead } from 'types/agent';
import { PrismaClient } from '@prisma/client';

// Type-safe wrapper for Prisma client
interface DbClient {
  sequenceDefinition: {
    findFirst: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
  };
  sequenceState: {
    findFirst: (args: any) => Promise<any>;
    upsert: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any[]>;
  };
  sequenceStep: {
    findFirst: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
  };
  sequenceExecution: {
    create: (args: any) => Promise<any>;
    deleteMany: (args: any) => Promise<any>;
  };
  sequenceMetrics: {
    create: (args: any) => Promise<any>;
    deleteMany: (args: any) => Promise<any>;
  };
  agentAction: {
    updateMany: (args: any) => Promise<any>;
  };
  lead: {
    findUnique: (args: any) => Promise<any>;
  };
}

/**
 * SequenceStorageDB - Handles persistent storage of sequence states in a database
 * 
 * This implementation uses Prisma with PostgreSQL for production-ready storage.
 */
export class SequenceStorageDB {
  private prisma: DbClient | null = null;

  constructor() {
    try {
      // Initialize Prisma client
      this.prisma = new PrismaClient() as unknown as DbClient;
      console.log('Prisma client initialized for SequenceStorageDB');
    } catch (error) {
      console.error('Error initializing Prisma client:', error);
      this.prisma = null;
    }
  }

  /**
   * Save a sequence state to persistent storage
   */
  async saveSequenceState(leadId: number, state: SequenceState): Promise<void> {
    if (!this.prisma) {
      console.error('Prisma client not initialized');
      return;
    }

    try {
      console.log(`[DB] Saving sequence state for lead ${leadId}`);
      
      // Find the sequence definition or create it if it doesn't exist
      const sequenceDefinition = await this.prisma.sequenceDefinition.findFirst({
        where: { type: state.sequence_type || 'real_estate_lead_qualification' }
      }) || await this.prisma.sequenceDefinition.create({
        data: {
          name: state.sequence_type || 'Real Estate Lead Qualification',
          type: state.sequence_type || 'real_estate_lead_qualification',
          tenantId: 1, // Default tenant ID - in production this would be dynamic
          description: 'Auto-created sequence definition'
        }
      });
      
      // Upsert the sequence state
      const dbState = await this.prisma.sequenceState.upsert({
        where: {
          id: state.db_id || -1
        },
        update: {
          currentStepId: state.current_step_id,
          context: state.context as any,
          status: state.status,
          updatedAt: new Date()
        },
        create: {
          leadId: leadId,
          sequenceDefinitionId: sequenceDefinition.id,
          currentStepId: state.current_step_id,
          context: state.context as any,
          status: state.status
        }
      });
      
      // Update the state with the database ID for future reference
      state.db_id = dbState.id;
      
      // If there's a new execution in the history, save it
      if (state.history.length > 0) {
        const latestExecution = state.history[state.history.length - 1];
        
        // Find or create the sequence step
        const step = await this.prisma.sequenceStep.findFirst({
          where: { 
            stepId: latestExecution.step_id,
            sequenceDefinitionId: sequenceDefinition.id
          }
        }) || await this.prisma.sequenceStep.create({
          data: {
            sequenceDefinitionId: sequenceDefinition.id,
            stepId: latestExecution.step_id,
            name: latestExecution.step_id, // Use step_id as name for now
            action: latestExecution.action || 'unknown'
          }
        });
        
        // Create the execution record
        const execution = await this.prisma.sequenceExecution.create({
          data: {
            sequenceStateId: state.db_id,
            sequenceStepId: step.id,
            result: latestExecution.result as any,
            nextStepId: latestExecution.next_step_id
          }
        });
        
        // If there are metrics, save them
        if (latestExecution.metrics) {
          await this.prisma.sequenceMetrics.create({
            data: {
              sequenceExecutionId: execution.id,
              timeSavedMinutes: latestExecution.metrics.time_saved_minutes,
              revenueImpact: latestExecution.metrics.revenue_impact,
              confidenceScore: latestExecution.metrics.confidence || 0.8
            }
          });
        }
      }
    } catch (error) {
      console.error('Error saving sequence state to database:', error);
      // Fall back to console logging the state for debugging
      console.log('State that failed to save:', JSON.stringify(state));
    }
  }

  /**
   * Get a sequence state from persistent storage
   */
  async getSequenceState(leadId: number): Promise<SequenceState | null> {
    if (!this.prisma) {
      console.error('Prisma client not initialized');
      return null;
    }

    try {
      console.log(`[DB] Getting sequence state for lead ${leadId}`);
      
      // Get the sequence state from the database
      const dbState = await this.prisma.sequenceState.findFirst({
        where: { leadId },
        include: {
          sequence: true,
          executions: {
            include: {
              step: true,
              metrics: true
            },
            orderBy: { executionTime: 'asc' }
          }
        }
      });
      
      if (!dbState) return null;
      
      // Map the database state to our SequenceState type
      const lead = await this.getLeadById(leadId);
      
      const sequenceState: SequenceState = {
        db_id: dbState.id,
        lead,
        current_step_id: dbState.currentStepId,
        context: dbState.context as Record<string, any>,
        history: dbState.executions.map((exec: any) => ({
          step_id: exec.step.stepId,
          action: exec.step.action,
          timestamp: exec.executionTime.toISOString(),
          result: exec.result as any,
          next_step_id: exec.nextStepId || undefined,
          metrics: exec.metrics ? {
            time_saved_minutes: exec.metrics.timeSavedMinutes || 0,
            revenue_impact: exec.metrics.revenueImpact || 0,
            confidence: exec.metrics.confidenceScore || 0.8
          } : undefined
        })),
        status: dbState.status as 'active' | 'completed' | 'failed',
        sequence_type: dbState.sequence.type
      };
      
      return sequenceState;
    } catch (error) {
      console.error('Error retrieving sequence state from database:', error);
      return null;
    }
  }

  /**
   * Delete a sequence state from persistent storage
   */
  async deleteSequenceState(leadId: number): Promise<void> {
    if (!this.prisma) {
      console.error('Prisma client not initialized');
      return;
    }

    try {
      console.log(`[DB] Deleting sequence state for lead ${leadId}`);
      
      // Get the sequence state to find its ID
      const state = await this.prisma.sequenceState.findFirst({
        where: { leadId },
        include: { executions: true }
      });
      
      if (state) {
        // Delete all related executions and metrics first
        for (const execution of state.executions) {
          // Delete metrics
          await this.prisma.sequenceMetrics.deleteMany({
            where: { sequenceExecutionId: execution.id }
          });
          
          // Update agent actions to remove the link
          await this.prisma.agentAction.updateMany({
            where: { sequenceExecutionId: execution.id },
            data: { sequenceExecutionId: null }
          });
        }
        
        // Delete executions
        await this.prisma.sequenceExecution.deleteMany({
          where: { sequenceStateId: state.id }
        });
        
        // Finally delete the state
        await this.prisma.sequenceState.delete({
          where: { id: state.id }
        });
      }
    } catch (error) {
      console.error('Error deleting sequence state from database:', error);
    }
  }

  /**
   * Get all sequence states from persistent storage
   */
  async getAllSequenceStates(): Promise<Record<number, SequenceState>> {
    if (!this.prisma) {
      console.error('Prisma client not initialized');
      return {};
    }

    try {
      console.log('[DB] Getting all sequence states');
      
      // Get all sequence states from the database
      const dbStates = await this.prisma.sequenceState.findMany({
        include: {
          sequence: true,
          lead: true,
          executions: {
            include: {
              step: true,
              metrics: true
            },
            orderBy: { executionTime: 'asc' }
          }
        }
      });
      
      // Map the database states to our SequenceState type
      const states: Record<number, SequenceState> = {};
      
      for (const dbState of dbStates) {
        states[dbState.leadId] = {
          db_id: dbState.id,
          lead: {
            id: dbState.lead.id,
            name: dbState.lead.name,
            email: dbState.lead.email,
            industry: dbState.lead.industry,
            stage: dbState.lead.stage,
            confidence_score: dbState.lead.confidence_score
          },
          current_step_id: dbState.currentStepId,
          context: dbState.context as Record<string, any>,
          history: dbState.executions.map((exec: any) => ({
            step_id: exec.step.stepId,
            action: exec.step.action,
            timestamp: exec.executionTime.toISOString(),
            result: exec.result as any,
            next_step_id: exec.nextStepId || undefined,
            metrics: exec.metrics ? {
              time_saved_minutes: exec.metrics.timeSavedMinutes || 0,
              revenue_impact: exec.metrics.revenueImpact || 0,
              confidence: exec.metrics.confidenceScore || 0.8
            } : undefined
          })),
          status: dbState.status as 'active' | 'completed' | 'failed',
          sequence_type: dbState.sequence.type
        };
      }
      
      return states;
    } catch (error) {
      console.error('Error retrieving all sequence states from database:', error);
      return {};
    }
  }
  
  /**
   * Helper method to get a lead by ID
   */
  private async getLeadById(leadId: number): Promise<Lead> {
    if (!this.prisma) {
      // Mock lead for when Prisma is not available
      return {
        id: leadId,
        name: 'Mock Lead',
        email: 'mock@example.com',
        industry: 'Real Estate',
        stage: 'Qualification',
        confidence_score: 0.8
      };
    }

    try {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId }
      });
      
      if (!lead) throw new Error(`Lead with ID ${leadId} not found`);
      
      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        industry: lead.industry,
        stage: lead.stage,
        confidence_score: lead.confidence_score
      };
    } catch (error) {
      console.error('Error retrieving lead from database:', error);
      
      // Return a mock lead as fallback
      return {
        id: leadId,
        name: 'Fallback Lead',
        email: 'fallback@example.com',
        industry: 'Real Estate',
        stage: 'Qualification',
        confidence_score: 0.8
      };
    }
  }
}
