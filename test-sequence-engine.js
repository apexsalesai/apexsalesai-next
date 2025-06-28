// Simple test script for SequenceEngineV2
// This script needs to be run with Next.js environment
// We'll use a different approach with a Next.js API route

async function testSequenceEngine() {
  console.log('Starting SequenceEngineV2 test...');
  
  // Create a test lead
  const testLead = {
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
  
  try {
    // Initialize the sequence engine
    const sequenceEngine = new SequenceEngineV2();
    console.log('SequenceEngine initialized successfully');
    
    // Initialize a new sequence for the test lead
    console.log('Initializing sequence for test lead...');
    const initialState = await sequenceEngine.initializeSequence(testLead);
    console.log(`Initialized sequence: ${initialState.sequence_type}`);
    
    // Process the first 3 steps
    let currentState = initialState;
    
    for (let i = 0; i < 3; i++) {
      console.log(`\nProcessing step ${i + 1}...`);
      currentState = await sequenceEngine.processCurrentStep(currentState);
      
      console.log(`Step ${i + 1} completed with status: ${currentState.status}`);
      
      // Show the last execution result
      if (currentState.history.length > 0) {
        const lastExecution = currentState.history[currentState.history.length - 1];
        console.log(`Action executed: ${lastExecution.action}`);
        console.log(`Result:`, lastExecution.result);
        
        if (lastExecution.metrics) {
          console.log(`Metrics:`, lastExecution.metrics);
        }
      }
      
      // If the sequence has completed or failed, stop processing
      if (currentState.status !== 'active') {
        console.log(`\nSequence ${currentState.status} after step ${i + 1}`);
        break;
      }
    }
    
    // Calculate ROI metrics
    const roiMetrics = sequenceEngine.calculateROI(currentState);
    console.log('\nROI Metrics:', roiMetrics);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing sequence engine:', error);
  }
}

// Run the test
testSequenceEngine().catch(console.error);
