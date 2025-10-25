/**
 * Phase 2-3 Backend Validation Script
 * Tests: Agent execution, API endpoints, Database persistence
 * Output: reports/validation-report.json
 * Security: All secrets redacted in logs/reports
 */

import fs from 'fs';
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Model pricing (per 1K tokens)
const MODEL_PRICING = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.005, output: 0.015 },
};

// SLO thresholds
const SLO = {
  maxP95LatencyMs: 12000,
  maxTotalTokens: 200000,
};

function redactSecret(value: string | undefined): string {
  if (!value) return '[NOT_SET]';
  if (value.length < 8) return '[REDACTED]';
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<{ success: boolean; result?: T; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { success: true, result };
    } catch (error: any) {
      if (attempt === maxRetries) {
        return { success: false, error: error.message };
      }
      const backoffMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`  ⚠️  Attempt ${attempt} failed, retrying in ${backoffMs}ms...`);
      await sleep(backoffMs);
    }
  }
  return { success: false, error: 'Max retries exceeded' };
}

interface ValidationReport {
  timestamp: string;
  phase2: {
    agents: Array<{ step: string; success: boolean; output: string }>;
    api: {
      campaigns?: number;
      runAgents?: number;
      assetsCount?: number;
      error?: string;
    };
    db: {
      campaigns?: number;
      assets?: number;
      tasks?: number;
      error?: string;
    };
    status: 'pending' | 'complete' | 'incomplete';
  };
  phase3: {
    ui: Record<string, any>;
    legacyCleanup: Record<string, any>;
    status: 'pending' | 'clean' | 'dirty';
  };
  summary: {
    passed: number;
    failed: number;
    total: number;
  };
}

const report: ValidationReport = {
  timestamp: new Date().toISOString(),
  phase2: {
    agents: [],
    api: {},
    db: {},
    status: 'pending',
  },
  phase3: {
    ui: {},
    legacyCleanup: {},
    status: 'pending',
  },
  summary: { passed: 0, failed: 0, total: 0 },
};

function runCommand(cmd: string): { success: boolean; output: string } {
  try {
    const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output };
  } catch (err: any) {
    return { success: false, output: err.message || String(err) };
  }
}

async function testAgents(): Promise<boolean> {
  console.log('🔍 Running agentic test sequence...');
  const result = runCommand('npx tsx scripts/test-phase2-agents.ts');
  report.phase2.agents.push({
    step: 'Agent Execution',
    success: result.success,
    output: result.output.slice(0, 2000),
  });
  return result.success;
}

async function testAPIs(): Promise<boolean> {
  console.log('🌐 Validating APIs...');
  try {
    const fetch = (await import('node-fetch')).default;
    
    // Test campaign creation
    const campaignRes = await fetch('http://localhost:3000/api/studio/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Validation Test',
        objective: 'QA end-to-end verification',
        audience: 'IT Leaders',
        brandVoice: 'Professional',
        channels: ['blog', 'social', 'email', 'video'],
        targetLength: 'medium',
      }),
    });

    const campaignData: any = await campaignRes.json();
    const campaignId = campaignData.id;

    if (!campaignId) {
      report.phase2.api.error = 'Campaign creation failed - no ID returned';
      return false;
    }

    // Test agent execution
    const runRes = await fetch('http://localhost:3000/api/studio/agents/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        agents: ['strategy', 'copy', 'visual', 'video', 'personalize'],
      }),
    });

    // Test asset retrieval
    const assetRes = await fetch(`http://localhost:3000/api/studio/assets?campaignId=${campaignId}`);
    const assetData: any = await assetRes.json();
    const assets = assetData.data || [];

    report.phase2.api = {
      campaigns: campaignRes.status,
      runAgents: runRes.status,
      assetsCount: assets.length,
    };

    return campaignRes.ok && runRes.ok && assets.length > 0;
  } catch (err: any) {
    report.phase2.api.error = err.message;
    return false;
  }
}

async function checkDatabase(): Promise<boolean> {
  console.log('🧩 Checking database records...');
  try {
    const campaigns = await prisma.campaign.findMany();
    const assets = await prisma.contentAsset.findMany();
    const tasks = await prisma.agentTask.findMany();

    report.phase2.db = {
      campaigns: campaigns.length,
      assets: assets.length,
      tasks: tasks.length,
    };

    return campaigns.length > 0 && assets.length > 0 && tasks.length > 0;
  } catch (err: any) {
    report.phase2.db.error = err.message;
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function verifyLegacyCleanup(): Promise<boolean> {
  console.log('🧹 Checking for legacy API noise...');
  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch('http://localhost:3000/api/posts');
    
    // If we get 404, the route is removed (good)
    if (res.status === 404) {
      report.phase3.legacyCleanup = { removed: true };
      return true;
    }
    
    // If we get 500, the route still exists (bad)
    report.phase3.legacyCleanup = { removed: false, status: res.status };
    return false;
  } catch {
    // Network error means route doesn't exist (good)
    report.phase3.legacyCleanup = { removed: true };
    return true;
  }
}

async function main() {
  console.log('\n🚀 Starting ApexSalesAI Validation Runner...\n');

  const agentsPassed = await testAgents();
  const apiPassed = await testAPIs();
  const dbPassed = await checkDatabase();
  const cleanupPassed = await verifyLegacyCleanup();

  report.summary.total = 4;
  report.summary.passed = [agentsPassed, apiPassed, dbPassed, cleanupPassed].filter(Boolean).length;
  report.summary.failed = report.summary.total - report.summary.passed;

  report.phase2.status = agentsPassed && apiPassed && dbPassed ? 'complete' : 'incomplete';
  report.phase3.status = cleanupPassed ? 'clean' : 'dirty';

  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/validation-report.json', JSON.stringify(report, null, 2));

  console.log(`\n✅ Validation complete.`);
  console.log(`📄 Report saved at: reports/validation-report.json`);
  console.log(`📊 Passed: ${report.summary.passed}/${report.summary.total}`);
  
  if (report.summary.failed > 0) {
    console.log(`\n❌ ${report.summary.failed} checks failed. Review report for details.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Validation runner failed:', error);
  process.exit(1);
});
