// API endpoint to test the new SequenceEngineV2 with vertical-specific sequences
import type { NextApiRequest, NextApiResponse } from 'next';
import { SequenceEngineV2 } from '@lib/sequence-engine-v2';
import { Lead } from 'types/agent';
import { determineVerticalForLead } from '@lib/agent/vertical-integration';

type TestResponse = {
  success: boolean;
  sequenceState?: any;
  error?: string;
  steps?: any[];
  vertical?: string;
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
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
    // Get the vertical from the request or default to 'real-estate'
    const { vertical = 'real-estate', steps = 5 } = req.body;
    
    // Create a test lead based on the requested vertical
    let testLead: Lead;
    
    if (vertical === 'mortgage') {
      testLead = {
        id: 12346,
        name: 'Jane Mortgage',
        email: 'jane@example.com',
        phone: '555-987-6543',
        industry: 'Mortgage',
        company: 'Quick Loans Inc.',
        confidence_score: 0.92,
        potential_value: 15000,
        status: 'New',
        created_at: new Date().toISOString(),
        last_contact: null
      };
    } else {
      // Default to real estate lead
      testLead = {
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
    }

    // Determine the vertical domain for this lead
    const verticalDomain = determineVerticalForLead(testLead);
    console.log(`Testing sequence for ${verticalDomain} lead: ${testLead.name}`);
    
    // Initialize the sequence engine
    const sequenceEngine = new SequenceEngineV2();
    
    // Initialize a new sequence for the test lead (let the engine determine the best sequence)
    const initialState = await sequenceEngine.initializeSequence(testLead);
    console.log(`Initialized sequence: ${initialState.sequence_type}`);
    
    // Process steps based on the number requested (default: 5)
    let currentState = initialState;
    const stepsToProcess = Math.min(Number(steps), 10); // Cap at 10 steps for safety
    
    for (let i = 0; i < stepsToProcess; i++) {
      console.log(`Processing step ${i + 1}...`);
      currentState = await sequenceEngine.processCurrentStep(currentState);
      
      // If the sequence has completed or failed, stop processing
      if (currentState.status !== 'active') {
        console.log(`Sequence ${currentState.status} after step ${i + 1}`);
        break;
      }
    }
    
    // Extract all steps executed so far
    const executedSteps = currentState.history.map(execution => ({
      step_id: execution.step_id,
      action: execution.action,
      timestamp: execution.timestamp,
      next_step_id: execution.next_step_id,
      result: execution.result,
      metrics: execution.metrics
    }));
    
    // Calculate ROI metrics
    const roiMetrics = sequenceEngine.calculateROI(currentState);
    
    // Return the final state and steps
    return res.status(200).json({
      success: true,
      sequenceState: {
        current_step_id: currentState.current_step_id,
        status: currentState.status,
        sequence_type: currentState.sequence_type,
        context: currentState.context
      },
      vertical: verticalDomain,
      roiMetrics,
      steps: executedSteps
    });
  } catch (error: unknown) {
    console.error('Error testing sequence:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}
