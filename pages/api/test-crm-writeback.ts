// API endpoint to test the CRM write-back functionality
import type { NextApiRequest, NextApiResponse } from 'next';
import { AgentTools } from '../../lib/agent-tools';
import { logger } from '../../lib/logger';

type TestResponse = {
  success: boolean;
  result?: any;
  error?: string;
  mode?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  try {
    logger.info('Starting CRM write-back test...', {
      context: 'test_crm_writeback',
      metadata: { timestamp: new Date().toISOString() }
    });
    
    // Initialize AgentTools
    const agentTools = new AgentTools();
    
    // Create test lead data to update
    const testLeadId = req.query.leadId ? parseInt(req.query.leadId as string, 10) : 12345;
    const testLeadData = {
      firstname: 'John',
      lastname: 'RealEstate',
      email: 'john@example.com',
      phone: '555-123-4567',
      hs_lead_status: 'Qualified',
      lastactivitydate: new Date().toISOString(),
      hs_lead_score: '85',
      notes: 'Updated by CRM write-back test ' + new Date().toISOString()
    };
    
    // Log environment for debugging
    const envMode = process.env.NODE_ENV || 'development';
    logger.info(`Running in ${envMode} mode`, {
      context: 'test_crm_writeback',
      metadata: { env: envMode }
    });
    
    // Test CRM write-back
    logger.info(`Updating lead ${testLeadId} in CRM...`, {
      context: 'test_crm_writeback',
      metadata: { leadId: testLeadId, data: testLeadData }
    });
    
    const result = await agentTools.updateCRMLead(testLeadId, testLeadData);
    
    logger.info('CRM write-back test completed!', {
      context: 'test_crm_writeback',
      metadata: { result }
    });
    
    return res.status(200).json({
      success: result.success !== false,
      result,
      mode: envMode
    });
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error('Error testing CRM write-back:', errorObj, {
      context: 'test_crm_writeback',
      metadata: { error: errorObj.message }
    });
    const errorMessage = errorObj.message || 'An unknown error occurred';
    return res.status(500).json({
      success: false,
      error: errorMessage,
      mode: process.env.NODE_ENV || 'development'
    });
  }
}
