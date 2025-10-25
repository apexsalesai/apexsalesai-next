/**
 * Validation Summary Generator
 * Merges backend + UI reports into final summary
 * Output: reports/final-validation-summary.json
 */

import fs from 'fs';
import path from 'path';

const reportsDir = path.resolve('reports');
const backendReportPath = path.join(reportsDir, 'validation-report.json');
const uiReportPath = path.join(reportsDir, 'ui-validation-report.json');
const summaryPath = path.join(reportsDir, 'final-validation-summary.json');

interface FinalSummary {
  timestamp: string;
  backend: string;
  ui: string;
  totalPassed: number;
  totalFailed: number;
  totalTests: number;
  screenshots: string[];
  details: {
    backendDetails?: any;
    uiDetails?: any;
  };
  status: 'PASS' | 'FAIL' | 'PARTIAL';
}

function main() {
  console.log('📊 Generating final validation summary...\n');

  if (!fs.existsSync(backendReportPath)) {
    console.error(`❌ Backend report not found: ${backendReportPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(uiReportPath)) {
    console.error(`❌ UI report not found: ${uiReportPath}`);
    process.exit(1);
  }

  const backend = JSON.parse(fs.readFileSync(backendReportPath, 'utf8'));
  const ui = JSON.parse(fs.readFileSync(uiReportPath, 'utf8'));

  const backendPassed = backend.phase2.status === 'complete' ? 1 : 0;
  const uiPassed = ui.checks.status === 'PASS' ? 1 : 0;

  const summary: FinalSummary = {
    timestamp: new Date().toISOString(),
    backend: backend.phase2.status,
    ui: ui.checks.status,
    totalPassed: backend.summary.passed + uiPassed,
    totalFailed: backend.summary.failed + (ui.checks.status === 'FAIL' ? 1 : 0),
    totalTests: backend.summary.total + 1, // +1 for UI test
    screenshots: ui.screenshots || [],
    details: {
      backendDetails: {
        agents: backend.phase2.agents,
        api: backend.phase2.api,
        db: backend.phase2.db,
      },
      uiDetails: {
        checks: ui.checks,
        errors: ui.errors,
      },
    },
    status: 'PARTIAL',
  };

  // Determine overall status
  if (summary.totalFailed === 0) {
    summary.status = 'PASS';
  } else if (summary.totalPassed === 0) {
    summary.status = 'FAIL';
  } else {
    summary.status = 'PARTIAL';
  }

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log('✅ Final validation summary generated!\n');
  console.log(`📄 Saved to: ${summaryPath}\n`);
  console.log('📊 Summary:');
  console.log(`   Backend Status: ${summary.backend}`);
  console.log(`   UI Status: ${summary.ui}`);
  console.log(`   Total Passed: ${summary.totalPassed}/${summary.totalTests}`);
  console.log(`   Total Failed: ${summary.totalFailed}/${summary.totalTests}`);
  console.log(`   Overall Status: ${summary.status}\n`);

  if (summary.screenshots.length > 0) {
    console.log('📸 Screenshots:');
    summary.screenshots.forEach((screenshot) => {
      console.log(`   - ${screenshot}`);
    });
    console.log('');
  }

  if (summary.status !== 'PASS') {
    console.log('⚠️  Some tests failed. Review the detailed reports for more information.');
    process.exit(1);
  }
}

main();
