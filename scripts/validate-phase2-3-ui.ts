/**
 * Phase 2-3 UI Validation Script (Playwright)
 * Tests: /studio renders real data, captures screenshots
 * Output: reports/ui-validation-report.json + screenshots
 */

import { chromium, Browser, Page } from 'playwright';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const reportDir = path.resolve('reports');
const backendReportPath = path.join(reportDir, 'validation-report.json');
const uiReportPath = path.join(reportDir, 'ui-validation-report.json');

fs.mkdirSync(reportDir, { recursive: true });

interface UIReport {
  timestamp: string;
  checks: {
    headerVisible?: boolean;
    assetsRendered?: boolean;
    noConsoleErrors?: boolean;
    status: 'PASS' | 'FAIL' | 'PENDING';
  };
  screenshots: string[];
  errors: string[];
}

async function runBackendValidation(): Promise<boolean> {
  console.log('🧩 Running backend validation first...');
  try {
    execSync('npx tsx scripts/validate-phase2-3.ts', { stdio: 'inherit' });
    
    if (!fs.existsSync(backendReportPath)) {
      console.error('❌ Backend validation report not found');
      return false;
    }
    
    const data = JSON.parse(fs.readFileSync(backendReportPath, 'utf8'));
    return data.phase2.status === 'complete';
  } catch (err) {
    console.error('❌ Backend validation failed:', err);
    return false;
  }
}

async function validateUI() {
  const backendPassed = await runBackendValidation();
  
  if (!backendPassed) {
    throw new Error('❌ Backend validation failed. Aborting UI check.');
  }

  const uiReport: UIReport = {
    timestamp: new Date().toISOString(),
    checks: {
      status: 'PENDING',
    },
    screenshots: [],
    errors: [],
  };

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    console.log('🌐 Launching browser...');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        uiReport.errors.push(msg.text());
      }
    });

    console.log('🌐 Opening /studio...');
    await page.goto('http://localhost:3000/studio', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // 1. Verify core UI elements
    console.log('🔍 Checking for Campaign Studio header...');
    const header = page.locator('text=Campaign Studio').first();
    uiReport.checks.headerVisible = await header.isVisible();

    // 2. Check if dynamic campaign or asset data exists
    console.log('🔍 Checking for rendered assets...');
    const dynamicContent = await page.locator('text=/Blog|Email|Social|Video/i').count();
    uiReport.checks.assetsRendered = dynamicContent > 0;

    // 3. Check for console errors
    uiReport.checks.noConsoleErrors = uiReport.errors.length === 0;

    // 4. Screenshot evidence
    const screenshotPath = path.join(reportDir, `studio-validation-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    uiReport.screenshots.push(screenshotPath);
    console.log(`📸 Screenshot saved: ${screenshotPath}`);

    // 5. Determine status
    uiReport.checks.status =
      uiReport.checks.headerVisible &&
      uiReport.checks.assetsRendered &&
      uiReport.checks.noConsoleErrors
        ? 'PASS'
        : 'FAIL';

    // 6. Save report
    fs.writeFileSync(uiReportPath, JSON.stringify(uiReport, null, 2));
    console.log(`📄 UI validation report saved: ${uiReportPath}`);

    if (uiReport.checks.status === 'FAIL') {
      console.log('\n❌ UI Validation Failed:');
      if (!uiReport.checks.headerVisible) console.log('  - Header not visible');
      if (!uiReport.checks.assetsRendered) console.log('  - No assets rendered');
      if (!uiReport.checks.noConsoleErrors) console.log(`  - ${uiReport.errors.length} console errors`);
      throw new Error('UI validation failed');
    }

    console.log('\n✅ UI Validation Passed!');
  } catch (error: any) {
    uiReport.checks.status = 'FAIL';
    uiReport.errors.push(error.message);
    fs.writeFileSync(uiReportPath, JSON.stringify(uiReport, null, 2));
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}

validateUI()
  .then(() => {
    console.log('\n🎉 Phase 2-3 UI Validation Complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ UI Validation Failed:', error.message);
    process.exit(1);
  });
