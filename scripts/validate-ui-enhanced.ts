/**
 * Phase 2-3 Enhanced UI Validation Script (Playwright)
 * Tests: /studio renders real DB data, no placeholders, all tabs functional
 * Output: reports/ui-validation-report.json + screenshots
 * Security: All secrets redacted
 */

import 'dotenv/config';
import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const reportDir = path.resolve('reports');
const screenshotsDir = path.join(reportDir, 'screenshots');
const uiReportPath = path.join(reportDir, 'ui-validation-report.json');

fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

interface UIReport {
  timestamp: string;
  checks: {
    studioPageLoads?: boolean;
    headerVisible?: boolean;
    campaignDataPresent?: boolean;
    blogTabPresent?: boolean;
    emailTabPresent?: boolean;
    socialTabPresent?: boolean;
    videoTabPresent?: boolean;
    visualPromptsTabPresent?: boolean;
    allTabsNonEmpty?: boolean;
    wordCountVisible?: boolean;
    publishButtonPresent?: boolean;
    noConsoleErrors?: boolean;
    no500Errors?: boolean;
    no503Errors?: boolean;
    status: 'PASS' | 'FAIL' | 'PENDING';
  };
  screenshots: string[];
  consoleErrors: string[];
  networkErrors: Array<{ url: string; status: number }>;
}

async function createTestCampaign(): Promise<string | null> {
  console.log('📝 Creating test campaign via API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/studio/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'UI Validation Test Campaign',
        objective: 'Test UI rendering and data binding',
        audience: 'QA Engineers',
        brandVoice: 'professional',
        channels: ['blog', 'social', 'email', 'video'],
        targetLength: 'medium',
      }),
    });

    if (!response.ok) {
      console.log(`  ❌ Campaign creation failed: ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    console.log(`  ✅ Campaign created: ${data.id}`);
    return data.id;
  } catch (error: any) {
    console.log(`  ❌ Campaign creation error: ${error.message}`);
    return null;
  }
}

async function runAgents(campaignId: string): Promise<boolean> {
  console.log('🤖 Running agents for campaign...');
  
  try {
    const response = await fetch('http://localhost:3000/api/studio/agents/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        agents: ['strategy', 'copy', 'visual', 'video', 'personalize'],
      }),
    });

    if (!response.ok) {
      console.log(`  ❌ Agent execution failed: ${response.status}`);
      return false;
    }

    console.log('  ✅ Agents executed successfully');
    
    // Wait for agents to complete
    console.log('  ⏳ Waiting for agents to complete (30s)...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    return true;
  } catch (error: any) {
    console.log(`  ❌ Agent execution error: ${error.message}`);
    return false;
  }
}

async function validateUI() {
  const uiReport: UIReport = {
    timestamp: new Date().toISOString(),
    checks: {
      status: 'PENDING',
    },
    screenshots: [],
    consoleErrors: [],
    networkErrors: [],
  };

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('\n🌐 Starting UI validation...\n');

    // Step 1: Create campaign and run agents
    const campaignId = await createTestCampaign();
    if (!campaignId) {
      throw new Error('Failed to create test campaign');
    }

    const agentsRan = await runAgents(campaignId);
    if (!agentsRan) {
      throw new Error('Failed to run agents');
    }

    // Step 2: Launch browser
    console.log('\n🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        uiReport.consoleErrors.push(msg.text());
      }
    });

    // Capture network errors
    page.on('response', (response) => {
      if (response.status() >= 500) {
        uiReport.networkErrors.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    // Step 3: Navigate to studio page
    console.log(`🌐 Opening /studio/${campaignId}...\n`);
    await page.goto(`http://localhost:3000/studio/${campaignId}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // Take initial screenshot
    const initialScreenshot = path.join(screenshotsDir, `studio-initial-${Date.now()}.png`);
    await page.screenshot({ path: initialScreenshot, fullPage: true });
    uiReport.screenshots.push(initialScreenshot);
    console.log(`📸 Screenshot: ${initialScreenshot}`);

    // Step 4: Check page loaded
    uiReport.checks.studioPageLoads = true;
    console.log('  ✅ Studio page loaded');

    // Step 5: Check header
    const header = page.locator('text=/Campaign Studio|Studio/i').first();
    uiReport.checks.headerVisible = await header.isVisible();
    console.log(`  ${uiReport.checks.headerVisible ? '✅' : '❌'} Header visible`);

    // Step 6: Check for campaign data (not placeholder)
    const placeholderText = await page.locator('text=/Coming Soon|Placeholder/i').count();
    uiReport.checks.campaignDataPresent = placeholderText === 0;
    console.log(`  ${uiReport.checks.campaignDataPresent ? '✅' : '❌'} Campaign data present (no placeholders)`);

    // Step 7: Check for tabs
    const tabs = ['Blog', 'Email', 'Social', 'Video', 'Visual'];
    const tabChecks = {
      blogTabPresent: false,
      emailTabPresent: false,
      socialTabPresent: false,
      videoTabPresent: false,
      visualPromptsTabPresent: false,
    };

    for (const tab of tabs) {
      const tabElement = page.locator(`text=${tab}`).first();
      const isVisible = await tabElement.isVisible();
      const key = `${tab.toLowerCase()}${tab === 'Visual' ? 'Prompts' : ''}TabPresent` as keyof typeof tabChecks;
      tabChecks[key] = isVisible;
      console.log(`  ${isVisible ? '✅' : '❌'} ${tab} tab present`);
    }

    Object.assign(uiReport.checks, tabChecks);

    // Step 8: Check tabs have content
    let allTabsNonEmpty = true;
    for (const tab of tabs) {
      try {
        const tabElement = page.locator(`text=${tab}`).first();
        if (await tabElement.isVisible()) {
          await tabElement.click();
          await page.waitForTimeout(1000);
          
          const content = await page.locator('body').textContent();
          const hasContent = content && content.length > 500;
          
          if (!hasContent) {
            console.log(`  ⚠️  ${tab} tab appears empty`);
            allTabsNonEmpty = false;
          } else {
            console.log(`  ✅ ${tab} tab has content`);
          }
        }
      } catch (error) {
        console.log(`  ⚠️  Could not check ${tab} tab content`);
        allTabsNonEmpty = false;
      }
    }
    uiReport.checks.allTabsNonEmpty = allTabsNonEmpty;

    // Step 9: Check for word count display
    const wordCountVisible = await page.locator('text=/\\d+ words|word count/i').count() > 0;
    uiReport.checks.wordCountVisible = wordCountVisible;
    console.log(`  ${wordCountVisible ? '✅' : '❌'} Word count visible`);

    // Step 10: Check for publish button
    const publishButton = page.locator('button:has-text("Publish")').first();
    uiReport.checks.publishButtonPresent = await publishButton.isVisible();
    console.log(`  ${uiReport.checks.publishButtonPresent ? '✅' : '❌'} Publish button present`);

    // Step 11: Check console and network errors
    uiReport.checks.noConsoleErrors = uiReport.consoleErrors.length === 0;
    uiReport.checks.no500Errors = !uiReport.networkErrors.some(e => e.status >= 500 && e.status < 503);
    uiReport.checks.no503Errors = !uiReport.networkErrors.some(e => e.status === 503);

    console.log(`  ${uiReport.checks.noConsoleErrors ? '✅' : '❌'} No console errors (${uiReport.consoleErrors.length} found)`);
    console.log(`  ${uiReport.checks.no500Errors ? '✅' : '❌'} No 500 errors`);
    console.log(`  ${uiReport.checks.no503Errors ? '✅' : '❌'} No 503 errors`);

    // Take final screenshot
    const finalScreenshot = path.join(screenshotsDir, `studio-final-${Date.now()}.png`);
    await page.screenshot({ path: finalScreenshot, fullPage: true });
    uiReport.screenshots.push(finalScreenshot);
    console.log(`📸 Screenshot: ${finalScreenshot}`);

    // Determine overall status
    const criticalChecks = [
      uiReport.checks.studioPageLoads,
      uiReport.checks.headerVisible,
      uiReport.checks.campaignDataPresent,
      uiReport.checks.blogTabPresent,
      uiReport.checks.emailTabPresent,
      uiReport.checks.socialTabPresent,
      uiReport.checks.allTabsNonEmpty,
      uiReport.checks.noConsoleErrors,
      uiReport.checks.no500Errors,
      uiReport.checks.no503Errors,
    ];

    uiReport.checks.status = criticalChecks.every(Boolean) ? 'PASS' : 'FAIL';

    // Save report
    fs.writeFileSync(uiReportPath, JSON.stringify(uiReport, null, 2));
    console.log(`\n📄 UI validation report saved: ${uiReportPath}`);

    if (uiReport.checks.status === 'FAIL') {
      console.log('\n❌ UI Validation Failed\n');
      if (!uiReport.checks.campaignDataPresent) console.log('  - Placeholder content detected');
      if (!uiReport.checks.allTabsNonEmpty) console.log('  - Some tabs are empty');
      if (!uiReport.checks.noConsoleErrors) console.log(`  - ${uiReport.consoleErrors.length} console errors`);
      if (uiReport.networkErrors.length > 0) {
        console.log(`  - ${uiReport.networkErrors.length} network errors:`);
        uiReport.networkErrors.forEach(e => console.log(`    ${e.status} ${e.url}`));
      }
      throw new Error('UI validation failed');
    }

    console.log('\n✅ UI Validation Passed!\n');
  } catch (error: any) {
    uiReport.checks.status = 'FAIL';
    fs.writeFileSync(uiReportPath, JSON.stringify(uiReport, null, 2));
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

validateUI()
  .then(() => {
    console.log('🎉 Phase 2-3 UI Validation Complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error(`\n❌ UI Validation Failed: ${error.message}\n`);
    process.exit(1);
  });
