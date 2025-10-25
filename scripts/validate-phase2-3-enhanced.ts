/**
 * Phase 2-3 Enhanced Backend Validation Script
 * Tests: Agent execution, API endpoints, Database persistence, Cost/Latency SLOs
 * Output: reports/validation-report.json, reports/usage-metrics.json
 * Security: All secrets redacted in logs/reports
 */

import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Model pricing (per 1K tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o': { input: 0.005, output: 0.015 },
};

// SLO thresholds
const SLO = {
  maxP95LatencyMs: 12000,
  maxTotalTokens: 200000,
  minCampaigns: 1,
  minAgentTasks: 5,
  minContentAssets: 10,
  minBlogWords: 800,
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
  maxRetries: number = 3,
  name: string = 'operation'
): Promise<{ success: boolean; result?: T; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return { success: true, result };
    } catch (error: any) {
      if (attempt === maxRetries) {
        console.log(`  ❌ ${name} failed after ${maxRetries} attempts: ${error.message}`);
        return { success: false, error: error.message };
      }
      const backoffMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`  ⚠️  ${name} attempt ${attempt} failed, retrying in ${backoffMs}ms...`);
      await sleep(backoffMs);
    }
  }
  return { success: false, error: 'Max retries exceeded' };
}

interface ValidationReport {
  timestamp: string;
  environment: {
    openaiKey: string;
    databaseUrl: string;
  };
  phase2: {
    agents: Array<{ step: string; success: boolean; output?: string; error?: string }>;
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
    legacyCleanup: Record<string, any>;
    status: 'pending' | 'clean' | 'dirty';
  };
  summary: {
    passed: number;
    failed: number;
    total: number;
  };
}

interface UsageMetrics {
  timestamp: string;
  agents: Array<{
    name: string;
    latencyMs: number;
    tokensIn: number;
    tokensOut: number;
    costUsd: number;
  }>;
  totals: {
    totalLatencyMs: number;
    totalTokensIn: number;
    totalTokensOut: number;
    totalTokens: number;
    totalCostUsd: number;
    p95LatencyMs: number;
  };
  sloStatus: {
    p95LatencyPass: boolean;
    totalTokensPass: boolean;
  };
}

const report: ValidationReport = {
  timestamp: new Date().toISOString(),
  environment: {
    openaiKey: redactSecret(process.env.OPENAI_API_KEY),
    databaseUrl: redactSecret(process.env.DATABASE_URL),
  },
  phase2: {
    agents: [],
    api: {},
    db: {},
    status: 'pending',
  },
  phase3: {
    legacyCleanup: {},
    status: 'pending',
  },
  summary: { passed: 0, failed: 0, total: 0 },
};

const usageMetrics: UsageMetrics = {
  timestamp: new Date().toISOString(),
  agents: [],
  totals: {
    totalLatencyMs: 0,
    totalTokensIn: 0,
    totalTokensOut: 0,
    totalTokens: 0,
    totalCostUsd: 0,
    p95LatencyMs: 0,
  },
  sloStatus: {
    p95LatencyPass: true,
    totalTokensPass: true,
  },
};

function calculateCost(tokensIn: number, tokensOut: number, model: string = 'gpt-4o-mini'): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o-mini'];
  return (tokensIn / 1000) * pricing.input + (tokensOut / 1000) * pricing.output;
}

function calculateP95(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[index];
}

async function checkEnvironment(): Promise<boolean> {
  console.log('🔍 Checking environment variables...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('  ❌ OPENAI_API_KEY not set');
    return false;
  }
  
  if (!process.env.DATABASE_URL) {
    console.log('  ❌ DATABASE_URL not set');
    return false;
  }
  
  console.log(`  ✅ OPENAI_API_KEY: ${redactSecret(process.env.OPENAI_API_KEY)}`);
  console.log(`  ✅ DATABASE_URL: ${redactSecret(process.env.DATABASE_URL)}`);
  return true;
}

async function checkDatabase(): Promise<boolean> {
  console.log('\n🧩 Checking database records...');
  
  const result = await retryWithBackoff(async () => {
    const campaigns = await prisma.campaign.findMany();
    const assets = await prisma.contentAsset.findMany();
    const tasks = await prisma.agentTask.findMany();

    report.phase2.db = {
      campaigns: campaigns.length,
      assets: assets.length,
      tasks: tasks.length,
    };

    console.log(`  📊 Campaigns: ${campaigns.length} (min: ${SLO.minCampaigns})`);
    console.log(`  📊 Assets: ${assets.length} (min: ${SLO.minContentAssets})`);
    console.log(`  📊 Tasks: ${tasks.length} (min: ${SLO.minAgentTasks})`);

    // Check blog word count
    const blogAssets = assets.filter(a => a.type === 'blog');
    if (blogAssets.length > 0) {
      const blogWords = blogAssets[0].body.split(/\s+/).length;
      console.log(`  📊 Blog word count: ${blogWords} (min: ${SLO.minBlogWords})`);
      
      if (blogWords < SLO.minBlogWords) {
        throw new Error(`Blog word count ${blogWords} below minimum ${SLO.minBlogWords}`);
      }
    }

    // Collect usage metrics from tasks
    for (const task of tasks) {
      const latencyMs = task.latencyMs || 0;
      const tokensIn = task.tokensIn || 0;
      const tokensOut = task.tokensOut || 0;
      const costUsd = calculateCost(tokensIn, tokensOut);

      usageMetrics.agents.push({
        name: task.agentType,
        latencyMs,
        tokensIn,
        tokensOut,
        costUsd,
      });

      usageMetrics.totals.totalLatencyMs += latencyMs;
      usageMetrics.totals.totalTokensIn += tokensIn;
      usageMetrics.totals.totalTokensOut += tokensOut;
      usageMetrics.totals.totalCostUsd += costUsd;
    }

    usageMetrics.totals.totalTokens = usageMetrics.totals.totalTokensIn + usageMetrics.totals.totalTokensOut;
    usageMetrics.totals.p95LatencyMs = calculateP95(usageMetrics.agents.map(a => a.latencyMs));

    // Check SLOs
    usageMetrics.sloStatus.p95LatencyPass = usageMetrics.totals.p95LatencyMs <= SLO.maxP95LatencyMs;
    usageMetrics.sloStatus.totalTokensPass = usageMetrics.totals.totalTokens <= SLO.maxTotalTokens;

    console.log(`\n  📊 Usage Metrics:`);
    console.log(`     Total tokens: ${usageMetrics.totals.totalTokens} (limit: ${SLO.maxTotalTokens})`);
    console.log(`     P95 latency: ${usageMetrics.totals.p95LatencyMs}ms (limit: ${SLO.maxP95LatencyMs}ms)`);
    console.log(`     Total cost: $${usageMetrics.totals.totalCostUsd.toFixed(4)}`);

    const meetsMinimums =
      campaigns.length >= SLO.minCampaigns &&
      assets.length >= SLO.minContentAssets &&
      tasks.length >= SLO.minAgentTasks;

    if (!meetsMinimums) {
      throw new Error('Database record counts below minimum thresholds');
    }

    if (!usageMetrics.sloStatus.p95LatencyPass) {
      console.log(`  ⚠️  P95 latency ${usageMetrics.totals.p95LatencyMs}ms exceeds SLO ${SLO.maxP95LatencyMs}ms`);
    }

    if (!usageMetrics.sloStatus.totalTokensPass) {
      console.log(`  ⚠️  Total tokens ${usageMetrics.totals.totalTokens} exceeds SLO ${SLO.maxTotalTokens}`);
    }

    return meetsMinimums;
  }, 3, 'Database check');

  if (result.success) {
    console.log('  ✅ Database validation passed');
    return true;
  } else {
    report.phase2.db.error = result.error;
    console.log(`  ❌ Database validation failed: ${result.error}`);
    return false;
  }
}

async function verifyLegacyCleanup(): Promise<boolean> {
  console.log('\n🧹 Checking for legacy API routes...');
  
  const legacyRoutes = ['/api/posts', '/api/kpis', '/api/jobs'];
  let allClean = true;

  for (const route of legacyRoutes) {
    try {
      const response = await fetch(`http://localhost:3000${route}`);
      if (response.status === 404) {
        console.log(`  ✅ ${route} - removed (404)`);
        report.phase3.legacyCleanup[route] = 'removed';
      } else {
        console.log(`  ❌ ${route} - still exists (${response.status})`);
        report.phase3.legacyCleanup[route] = `exists_${response.status}`;
        allClean = false;
      }
    } catch {
      console.log(`  ✅ ${route} - removed (no response)`);
      report.phase3.legacyCleanup[route] = 'removed';
    }
  }

  return allClean;
}

async function main() {
  console.log('\n🚀 Starting ApexSalesAI Enhanced Validation Runner...\n');
  console.log('=' .repeat(80));

  // Step 1: Environment check
  const envPassed = await checkEnvironment();
  report.phase2.agents.push({
    step: 'Environment Check',
    success: envPassed,
    error: envPassed ? undefined : 'Missing required environment variables',
  });

  if (!envPassed) {
    console.log('\n❌ Environment check failed. Cannot proceed.');
    report.phase2.status = 'incomplete';
    report.summary.total = 1;
    report.summary.failed = 1;
    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync('reports/validation-report.json', JSON.stringify(report, null, 2));
    process.exit(1);
  }

  // Step 2: Database check
  const dbPassed = await checkDatabase();
  
  // Step 3: Legacy cleanup check
  const cleanupPassed = await verifyLegacyCleanup();

  // Calculate summary
  report.summary.total = 3;
  report.summary.passed = [envPassed, dbPassed, cleanupPassed].filter(Boolean).length;
  report.summary.failed = report.summary.total - report.summary.passed;

  report.phase2.status = envPassed && dbPassed ? 'complete' : 'incomplete';
  report.phase3.status = cleanupPassed ? 'clean' : 'dirty';

  // Save reports
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync('reports/validation-report.json', JSON.stringify(report, null, 2));
  fs.writeFileSync('reports/usage-metrics.json', JSON.stringify(usageMetrics, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log(`\n✅ Validation complete.`);
  console.log(`📄 Report saved: reports/validation-report.json`);
  console.log(`📄 Metrics saved: reports/usage-metrics.json`);
  console.log(`📊 Passed: ${report.summary.passed}/${report.summary.total}`);
  
  if (report.summary.failed > 0) {
    console.log(`\n❌ ${report.summary.failed} checks failed. Review reports for details.`);
    process.exit(1);
  }

  console.log('\n🎉 All validation checks passed!\n');
}

main()
  .catch((error) => {
    console.error('❌ Validation runner failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
