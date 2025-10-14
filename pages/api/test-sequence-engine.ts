// API endpoint to test the SequenceEngineV2 with error handling and retry logic
import type { NextApiRequest, NextApiResponse } from 'next';
import { SequenceEngineV2 } from '@lib/sequence-engine-v2';
import { Lead } from 'types/agent';
import { logger } from '@lib/logger';
import { SequenceStorage } from '@lib/sequence-storage';

type TestResponse = {
  success: boolean;
  sequenceState?: any;
  error?: string;
  steps?: any[];
  roiMetrics?: {
    time_saved_minutes: number;
    revenue_impact: number;
    tasks_automated: number;
    deals_rescued: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  try {
    logger.info('Starting SequenceEngineV2 test...');
    
    // Reset any existing sequence state for our test lead ID
    const storage = new SequenceStorage();
    await storage.deleteSequenceState(12345); // Clear any existing state for our test lead
    
    // Create a test lead
    const testLead: Lead = {
      id: 12345,
      name: 'John RealEstate',
      email: 'john@example.com',
      phone: '555-123-4567',
      industry: 'Real Estate',
      company: 'Home Buyers Inc.',
      confidence_score: 0.85,
      potential_value: 10000,
      status: 'New',
      created_at: new Date().toISOString(),
      last_contact: null
    };
    
    // Initialize the sequence engine
    const sequenceEngine = new SequenceEngineV2();
    logger.info('SequenceEngine initialized successfully');
    
    // Initialize a new sequence for the test lead
    logger.info('Initializing sequence for test lead...');
    const initialState = await sequenceEngine.initializeSequence(testLead);
    logger.info(`Initialized sequence: ${initialState.sequence_type}`);
    
    // Ensure we're starting with the correct step ID
    initialState.current_step_id = 'intake';
    
    // Process the first 3 steps
    let currentState = initialState;
    const executedSteps = [];
    
    for (let i = 0; i < 3; i++) {
      logger.info(`Processing step ${i + 1}...`);
      currentState = await sequenceEngine.processCurrentStep(currentState);
      
      logger.info(`Step ${i + 1} completed with status: ${currentState.status}`);
      
      // Extract step execution details
      if (currentState.history.length > 0) {
        const lastExecution = currentState.history[currentState.history.length - 1];
        executedSteps.push({
          step_id: lastExecution.step_id,
          action: lastExecution.action,
          timestamp: lastExecution.timestamp,
          result: lastExecution.result,
          metrics: lastExecution.metrics
        });
      }
      
      // If the sequence has completed or failed, stop processing
      if (currentState.status !== 'active') {
        logger.info(`Sequence ${currentState.status} after step ${i + 1}`);
        break;
      }
    }
    
    // Calculate ROI metrics
    const roiMetrics = sequenceEngine.calculateROI(currentState);
    logger.info('ROI Metrics calculated', { 
      context: 'sequence_engine_test',
      metadata: roiMetrics 
    });
    
    logger.info('Test completed successfully!');
    
    // Return the results
    return res.status(200).json({
      success: true,
      sequenceState: {
        current_step_id: currentState.current_step_id,
        status: currentState.status,
        sequence_type: currentState.sequence_type,
        context: currentState.context
      },
      steps: executedSteps,
      roiMetrics
    });
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error('Error testing sequence engine:', errorObj);
    const errorMessage = errorObj.message || 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}
