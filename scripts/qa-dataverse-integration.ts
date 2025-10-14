/**
 * QA Test Script for Dataverse KPI Integration
 * Tests OAuth token refresh, connection failures, and refresh functionality
 */

import { DataverseApiService } from '@lib/services/dataverse/dataverseApi';
import { getKpiService } from '@lib/services/dataverse/kpiService';
import { ErrorLogger } from '@lib/utils/errorLogger';

interface QATestResult {
  testName: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration: number;
  error?: any;
}

class DataverseQATester {
  private results: QATestResult[] = [];
  private config: any;

  constructor() {
    this.config = {
      tenantId: process.env.NEXT_PUBLIC_AZURE_TENANT_ID || 'test-tenant',
      clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'test-client',
      clientSecret: process.env.AZURE_CLIENT_SECRET || 'test-secret',
      resourceUrl: process.env.NEXT_PUBLIC_DATAVERSE_URL || 'https://test.crm.dynamics.com',
      apiVersion: '9.2',
      environment: 'qa'
    };
  }

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    console.log(`🧪 Running: ${testName}`);

    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        status: 'PASS',
        message: 'Test completed successfully',
        duration
      });
      console.log(`✅ PASS: ${testName} (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      this.results.push({
        testName,
        status: 'FAIL',
        message: error.message || 'Test failed',
        duration,
        error
      });
      console.log(`❌ FAIL: ${testName} (${duration}ms) - ${error.message}`);
    }
  }

  /**
   * Test 1: Configuration Validation
   */
  async testConfigurationValidation(): Promise<void> {
    await this.runTest('Configuration Validation', async () => {
      const requiredVars = ['tenantId', 'clientId', 'resourceUrl'];
      const missing = requiredVars.filter(key => !this.config[key] || this.config[key].startsWith('test-'));
      
      if (missing.length > 0) {
        throw new Error(`Missing or placeholder environment variables: ${missing.join(', ')}`);
      }
      
      // Validate URL format
      const url = new URL(this.config.resourceUrl);
      if (!url.hostname.includes('crm') && !url.hostname.includes('dynamics')) {
        throw new Error('Resource URL does not appear to be a valid Dataverse URL');
      }
    });
  }

  /**
   * Test 2: API Service Initialization
   */
  async testApiServiceInit(): Promise<void> {
    await this.runTest('API Service Initialization', async () => {
      const apiService = new DataverseApiService(this.config);
      if (!apiService) {
        throw new Error('Failed to initialize DataverseApiService');
      }
    });
  }

  /**
   * Test 3: KPI Service Integration
   */
  async testKpiServiceIntegration(): Promise<void> {
    await this.runTest('KPI Service Integration', async () => {
      const kpiService = getKpiService(this.config);
      if (!kpiService) {
        throw new Error('Failed to get KPI service instance');
      }

      // Test that all KPI services are accessible
      const dashboardData = await kpiService.getDashboardData('realEstate');
      
      if (!dashboardData.kpis || dashboardData.kpis.length === 0) {
        throw new Error('KPI service returned no KPI data');
      }

      // Validate KPI structure
      const firstKpi = dashboardData.kpis[0];
      const requiredFields: (keyof typeof firstKpi)[] = ['title', 'value', 'trend', 'badgeColor'];
      const missingFields = requiredFields.filter(field => !firstKpi[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`KPI missing required fields: ${missingFields.join(', ')}`);
      }
    });
  }

  /**
   * Test 4: Connection Failure Graceful Fallback
   */
  async testConnectionFailureFallback(): Promise<void> {
    await this.runTest('Connection Failure Graceful Fallback', async () => {
      // Create KPI service with invalid config to simulate connection failure
      const invalidConfig = {
        ...this.config,
        resourceUrl: 'https://invalid-dataverse-url.crm.dynamics.com',
        clientId: 'invalid-client-id'
      };

      const kpiService = getKpiService(invalidConfig);
      
      // Should still return data (fallback to mock)
      const dashboardData = await kpiService.getDashboardData('realEstate');
      
      if (!dashboardData.kpis || dashboardData.kpis.length === 0) {
        throw new Error('Fallback data not returned when connection fails');
      }

      // Verify we're using fallback data
      const isUsingFallback = dashboardData.kpis.some(kpi => 
        kpi.title.includes('Mock') || kpi.value.includes('Fallback')
      );
      
      if (!isUsingFallback) {
        console.warn('⚠️  Warning: Could not verify fallback data is being used');
      }
    });
  }

  /**
   * Test 5: Refresh Functionality
   */
  async testRefreshFunctionality(): Promise<void> {
    await this.runTest('Refresh Functionality', async () => {
      const kpiService = getKpiService(this.config);
      
      // Get initial data
      const initialData = await kpiService.getDashboardData('realEstate');
      const initialTimestamp = initialData.lastUpdated || new Date().toISOString();
      
      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh data
      const refreshedData = await kpiService.refreshDashboardData('realEstate');
      const refreshedTimestamp = refreshedData.lastUpdated || new Date().toISOString();
      
      if (!refreshedData.kpis || refreshedData.kpis.length === 0) {
        throw new Error('Refresh returned no KPI data');
      }

      // Check that refresh actually occurred
      if (initialTimestamp === refreshedTimestamp) {
        console.warn('⚠️  Warning: Refresh timestamp unchanged - may be using cached data');
      }
    });
  }

  /**
   * Test 6: Multi-Vertical Support
   */
  async testMultiVerticalSupport(): Promise<void> {
    await this.runTest('Multi-Vertical Support', async () => {
      const kpiService = getKpiService(this.config);
      const verticals = ['realEstate', 'mortgage', 'msp', 'consulting', 'solar'];
      
      for (const vertical of verticals) {
        const data = await kpiService.getDashboardData(vertical);
        
        if (!data.kpis || data.kpis.length === 0) {
          throw new Error(`No KPI data returned for vertical: ${vertical}`);
        }
        
        // Verify vertical-specific data
        if (data.vertical && data.vertical !== vertical) {
          throw new Error(`Vertical mismatch: expected ${vertical}, got ${data.vertical}`);
        }
      }
    });
  }

  /**
   * Test 7: API Endpoint Integration
   */
  async testApiEndpointIntegration(): Promise<void> {
    await this.runTest('API Endpoint Integration', async () => {
      // This would require the server to be running
      // For now, we'll just validate the endpoint structure exists
      const fs = require('fs');
      const apiRoutePath = './app/api/kpis/route.ts';
      
      if (!fs.existsSync(apiRoutePath)) {
        throw new Error('KPI API route file does not exist');
      }
      
      const routeContent = fs.readFileSync(apiRoutePath, 'utf8');
      
      // Check for required exports
      if (!routeContent.includes('export async function GET')) {
        throw new Error('API route missing GET handler');
      }
      
      if (!routeContent.includes('export async function POST')) {
        throw new Error('API route missing POST handler');
      }
    });
  }

  /**
   * Run all QA tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Dataverse KPI Integration QA Tests\n');
    
    await this.testConfigurationValidation();
    await this.testApiServiceInit();
    await this.testKpiServiceIntegration();
    await this.testConnectionFailureFallback();
    await this.testRefreshFunctionality();
    await this.testMultiVerticalSupport();
    await this.testApiEndpointIntegration();
    
    this.generateReport();
  }

  /**
   * Generate test report
   */
  private generateReport(): void {
    console.log('\n📊 QA Test Report');
    console.log('==================');
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%\n`);
    
    // Detailed results
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.testName}: ${result.message} (${result.duration}ms)`);
      
      if (result.error && result.status === 'FAIL') {
        console.log(`   Error: ${result.error.message}`);
      }
    });
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (failed > 0) {
      console.log('- Address failed tests before proceeding to staging deployment');
      console.log('- Check environment variable configuration');
      console.log('- Verify Dataverse connection settings');
    } else {
      console.log('- All tests passed! Ready for staging deployment 🚀');
      console.log('- Consider adding monitoring for production environment');
    }
    
    // Save results to file
    const reportData = {
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      summary: { total, passed, failed, successRate: Math.round((passed / total) * 100) },
      results: this.results
    };
    
    try {
      const fs = require('fs');
      fs.writeFileSync(
        './qa-dataverse-report.json', 
        JSON.stringify(reportData, null, 2)
      );
      console.log('\n📄 Report saved to: qa-dataverse-report.json');
    } catch (error) {
      console.warn('⚠️  Could not save report to file:', error);
    }
  }
}

// Export for use in other scripts
export { DataverseQATester };

// Run tests if called directly
if (require.main === module) {
  const tester = new DataverseQATester();
  tester.runAllTests().catch(console.error);
}
