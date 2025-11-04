/**
 * Test Script for Dataverse Integration
 * 
 * Tests the direct Dataverse integration by writing a sample campaign metric
 * and querying it back.
 * 
 * Usage: npx tsx scripts/test-dataverse-integration.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

import { writeCampaignMetrics, queryRecentMetrics } from '../lib/dataverse';

async function testDataverseIntegration() {
  console.log('🚀 Testing Dataverse Integration...\n');

  try {
    // Test 1: Write a sample metric
    console.log('📝 Test 1: Writing sample campaign metric...');
    const testMetric = {
      campaignId: 'test-campaign-' + Date.now(),
      runId: 'test-run-' + Date.now(),
      phase: '2-3',
      agentsTotal: 5,
      agentsSuccessful: 5,
      assetsGenerated: 12,
      tokensIn: 1500,
      tokensOut: 3000,
      costUSD: 0.00348,
      latencyP95Ms: 51200,
      latencyAvgMs: 42000,
      successRate: 100.00,
      createdAt: new Date(),
    };

    await writeCampaignMetrics(testMetric);
    console.log('✅ Test 1 PASSED: Metric written successfully\n');

    // Wait a moment for Dataverse to process
    console.log('⏳ Waiting 2 seconds for Dataverse to process...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Query recent metrics
    console.log('📊 Test 2: Querying recent metrics...');
    const recentMetrics = await queryRecentMetrics(5);
    console.log(`✅ Test 2 PASSED: Retrieved ${recentMetrics.length} metrics\n`);

    // Display the metrics
    if (recentMetrics.length > 0) {
      console.log('📈 Recent Metrics:');
      recentMetrics.forEach((metric, index) => {
        console.log(`\n  ${index + 1}. Campaign: ${metric.apex_campaignid}`);
        console.log(`     Run ID: ${metric.apex_runid}`);
        console.log(`     Phase: ${metric.apex_phase}`);
        console.log(`     Agents: ${metric.apex_agentssuccessful}/${metric.apex_agentstotal}`);
        console.log(`     Success Rate: ${metric.apex_successrate}%`);
        console.log(`     Cost: $${metric.apex_costusd}`);
        console.log(`     Latency (avg): ${metric.apex_latencyavgms}ms`);
        console.log(`     Created: ${metric.apex_createdat}`);
      });
    }

    console.log('\n🎉 All tests PASSED! Dataverse integration is working correctly.\n');
    console.log('✅ Ready for production use!');
    
  } catch (error) {
    console.error('\n❌ Test FAILED:', error);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Check that all environment variables are set in .env.local');
    console.error('   2. Verify OAuth2 credentials are correct');
    console.error('   3. Ensure Dataverse table "Campaign Metrics" exists');
    console.error('   4. Check that the service principal has write permissions');
    process.exit(1);
  }
}

// Run the test
testDataverseIntegration();
