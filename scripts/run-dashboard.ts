/**
 * Command Dashboard Runner
 * Executes all validation phases in sequence
 * Output: reports/pipeline-log.txt
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const dashboardPath = path.resolve('./pipeline/command-dashboard.json');
const logDir = path.resolve('./reports');
const logFile = path.join(logDir, 'pipeline-log.txt');

fs.mkdirSync(logDir, { recursive: true });

if (!fs.existsSync(dashboardPath)) {
  console.error(`❌ Command dashboard not found at: ${dashboardPath}`);
  process.exit(1);
}

const dashboard = JSON.parse(fs.readFileSync(dashboardPath, 'utf8'));

function log(message: string) {
  console.log(message);
  fs.appendFileSync(logFile, `${message}\n`);
}

function runCommand(cmd: string): boolean {
  log(`\n🔧 Executing: ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit', encoding: 'utf8' });
    log(`✅ SUCCESS: ${cmd}`);
    return true;
  } catch (error: any) {
    log(`❌ ERROR (${cmd}): ${error.message}`);
    return false;
  }
}

async function main() {
  log(`\n${'='.repeat(80)}`);
  log(`🚀 Running ${dashboard.meta.name} v${dashboard.meta.version}`);
  log(`📝 ${dashboard.meta.description}`);
  log(`${'='.repeat(80)}\n`);

  let totalCommands = 0;
  let successfulCommands = 0;
  let failedPhases: string[] = [];

  for (const [phaseName, phaseDetails] of Object.entries(dashboard.phases) as [string, any][]) {
    log(`\n${'='.repeat(80)}`);
    log(`🧩 Phase: ${phaseName}`);
    log(`📋 ${phaseDetails.description}`);
    log(`${'='.repeat(80)}`);

    let phaseSuccess = true;

    for (const cmd of phaseDetails.commands) {
      totalCommands++;
      const success = runCommand(cmd);
      
      if (success) {
        successfulCommands++;
      } else {
        phaseSuccess = false;
        log(`\n⚠️  Phase "${phaseName}" encountered an error. Continuing to next phase...`);
        break; // Skip remaining commands in this phase
      }
    }

    if (!phaseSuccess) {
      failedPhases.push(phaseName);
    }
  }

  log(`\n${'='.repeat(80)}`);
  log(`📊 Pipeline Execution Summary`);
  log(`${'='.repeat(80)}`);
  log(`Total Commands: ${totalCommands}`);
  log(`Successful: ${successfulCommands}`);
  log(`Failed: ${totalCommands - successfulCommands}`);
  
  if (failedPhases.length > 0) {
    log(`\n❌ Failed Phases: ${failedPhases.join(', ')}`);
  } else {
    log(`\n✅ All phases completed successfully!`);
  }
  
  log(`\n📄 Full log saved to: ${logFile}`);
  log(`📁 Reports directory: ${dashboard.reports.outputDirectory}`);
  log(`${'='.repeat(80)}\n`);

  if (failedPhases.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Pipeline execution failed: ${error.message}`);
  process.exit(1);
});
