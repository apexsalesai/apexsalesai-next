/**
 * Enhanced Validation Pipeline Runner
 * Executes all validation phases with security, SLO checks, and comprehensive reporting
 * Output: Complete validation suite with redacted secrets
 */

import 'dotenv/config';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const logDir = path.resolve('./reports');
const logFile = path.join(logDir, 'pipeline-log.txt');

fs.mkdirSync(logDir, { recursive: true });

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(message);
  fs.appendFileSync(logFile, `${logMessage}\n`);
}

function runCommand(cmd: string, phase: string): boolean {
  log(`\n🔧 Executing: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', encoding: 'utf8' });
    log(`✅ SUCCESS: ${phase}`);
    return true;
  } catch (error: any) {
    log(`❌ ERROR (${phase}): ${error.message}`);
    return false;
  }
}

async function main() {
  log('\n' + '='.repeat(80));
  log('🚀 ApexSalesAI Phase 2-3 Enhanced Validation Pipeline');
  log('='.repeat(80));
  log('');
  log('Security: All secrets will be redacted in reports');
  log('SLO: P95 latency ≤ 12s, Total tokens ≤ 200k');
  log('');

  const phases = [
    {
      name: 'Environment Setup',
      commands: [
        { cmd: 'npm install', desc: 'Install dependencies' },
        { cmd: 'npx prisma generate', desc: 'Generate Prisma client' },
        { cmd: 'npx playwright install chromium --with-deps', desc: 'Install Playwright' },
      ],
    },
    {
      name: 'Legacy Cleanup',
      commands: [
        { cmd: 'npx tsx scripts/cleanup-legacy-routes.ts', desc: 'Remove legacy API routes' },
      ],
    },
    {
      name: 'Backend Validation',
      commands: [
        { cmd: 'npx tsx scripts/validate-phase2-3-enhanced.ts', desc: 'Validate agents, DB, SLOs' },
      ],
    },
    {
      name: 'UI Validation',
      commands: [
        { cmd: 'npx tsx scripts/validate-ui-enhanced.ts', desc: 'Validate UI rendering and data binding' },
      ],
    },
    {
      name: 'Report Generation',
      commands: [
        { cmd: 'npx tsx scripts/generate-validation-summary.ts', desc: 'Generate final summary' },
      ],
    },
  ];

  let totalCommands = 0;
  let successfulCommands = 0;
  let failedPhases: string[] = [];

  for (const phase of phases) {
    log('\n' + '='.repeat(80));
    log(`🧩 Phase: ${phase.name}`);
    log('='.repeat(80));

    let phaseSuccess = true;

    for (const { cmd, desc } of phase.commands) {
      totalCommands++;
      log(`\n📋 ${desc}`);
      const success = runCommand(cmd, desc);

      if (success) {
        successfulCommands++;
      } else {
        phaseSuccess = false;
        log(`\n⚠️  Phase "${phase.name}" encountered an error.`);
        
        // For critical phases, stop the pipeline
        if (phase.name === 'Backend Validation' || phase.name === 'UI Validation') {
          log(`\n❌ Critical phase failed. Stopping pipeline.`);
          failedPhases.push(phase.name);
          break;
        }
        break;
      }
    }

    if (!phaseSuccess) {
      failedPhases.push(phase.name);
      
      // Stop if critical phase failed
      if (phase.name === 'Backend Validation' || phase.name === 'UI Validation') {
        break;
      }
    }
  }

  // Generate final summary
  log('\n' + '='.repeat(80));
  log('📊 Pipeline Execution Summary');
  log('='.repeat(80));
  log(`Total Commands: ${totalCommands}`);
  log(`Successful: ${successfulCommands}`);
  log(`Failed: ${totalCommands - successfulCommands}`);

  if (failedPhases.length > 0) {
    log(`\n❌ Failed Phases: ${failedPhases.join(', ')}`);
  } else {
    log(`\n✅ All phases completed successfully!`);
  }

  // List generated artifacts
  log('\n📁 Generated Artifacts:');
  const expectedFiles = [
    'validation-report.json',
    'usage-metrics.json',
    'ui-validation-report.json',
    'final-validation-summary.json',
    'screenshots/',
  ];

  for (const file of expectedFiles) {
    const filePath = path.join(logDir, file);
    if (fs.existsSync(filePath)) {
      log(`  ✅ ${file}`);
    } else {
      log(`  ❌ ${file} - MISSING`);
    }
  }

  log(`\n📄 Full log saved to: ${logFile}`);
  log('='.repeat(80) + '\n');

  if (failedPhases.length > 0) {
    log('\n❌ VALIDATION FAILED - Review reports and fix issues before proceeding to Phase 4\n');
    process.exit(1);
  } else {
    log('\n✅ VALIDATION PASSED - Phase 2-3 complete and ready for Phase 4\n');
  }
}

main().catch((error) => {
  log(`\n❌ Pipeline execution failed: ${error.message}`);
  process.exit(1);
});
