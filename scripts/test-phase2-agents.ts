/**
 * Test script for Phase 2 agent execution
 * Run with: npx tsx -r dotenv/config scripts/test-phase2-agents.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { runAgents } from '../lib/agents/runner';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Testing Phase 2 Multi-Agent System\n');

  // Create test campaign
  console.log('1. Creating test campaign...');
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Q4 Product Launch - Phase 2 Test',
      objective: 'Drive demo requests for our new AI-powered sales platform targeting enterprise customers',
      audience: 'IT leaders, RevOps managers, and sales executives at mid-market and enterprise B2B companies',
      brandVoice: 'professional, authoritative, data-driven',
      channels: ['blog', 'social', 'email', 'video'],
      targetLength: 'medium',
      createdById: 'test-user',
    },
  });
  console.log(`✓ Campaign created: ${campaign.id}\n`);

  // Run all 5 agents
  console.log('2. Running agent chain (strategy → copy → visual → video → personalize)...');
  const startTime = Date.now();
  const result = await runAgents(campaign.id, [
    'strategy',
    'copy',
    'visual',
    'video',
    'personalize',
  ]);
  const totalTime = Date.now() - startTime;

  console.log('\n✅ Agent execution complete!\n');

  // Fetch detailed task data
  const tasks = await prisma.agentTask.findMany({
    where: { campaignId: campaign.id },
    orderBy: { createdAt: 'asc' },
  });

  // Fetch assets
  const assets = await prisma.contentAsset.findMany({
    where: { campaignId: campaign.id },
    select: { id: true, type: true, title: true, metadata: true },
  });

  // Calculate metrics
  const latencies = tasks.map(t => t.latencyMs).filter(l => l > 0);
  const p95Latency = latencies.length > 0 
    ? latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)] 
    : 0;
  
  const totalTokensIn = tasks.reduce((sum, t) => sum + t.tokensIn, 0);
  const totalTokensOut = tasks.reduce((sum, t) => sum + t.tokensOut, 0);
  const totalCost = tasks.reduce((sum, t) => sum + Number(t.costUsd), 0);

  // Generate validation report
  const report = {
    timestamp: new Date().toISOString(),
    campaign: {
      id: campaign.id,
      title: campaign.title,
      status: campaign.status,
    },
    counts: {
      campaigns: 1,
      agentTasks: tasks.length,
      contentAssets: assets.length,
      tasksSucceeded: tasks.filter(t => t.status === 'done').length,
      tasksFailed: tasks.filter(t => t.status === 'error').length,
    },
    metrics: {
      totalLatencyMs: totalTime,
      p95LatencyMs: p95Latency,
      totalTokensIn,
      totalTokensOut,
      totalCostUsd: totalCost,
      avgLatencyMs: latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0,
    },
    tasks: tasks.map(t => ({
      id: t.id,
      agentType: t.agentType,
      status: t.status,
      tokensIn: t.tokensIn,
      tokensOut: t.tokensOut,
      latencyMs: t.latencyMs,
      model: t.model,
      costUsd: t.costUsd,
    })),
    assets: assets.map(a => ({
      id: a.id,
      type: a.type,
      title: a.title,
    })),
    acceptance: {
      campaignCreated: true,
      minAgentTasks: tasks.length >= 5,
      minContentAssets: assets.length >= 10,
      allTasksCompleted: tasks.every(t => t.status === 'done' || t.status === 'error'),
      p95LatencyRecorded: p95Latency > 0,
    },
  };

  // Ensure reports directory exists
  const reportsDir = join(process.cwd(), 'reports');
  try {
    mkdirSync(reportsDir, { recursive: true });
  } catch (e) {
    // Directory might already exist
  }

  // Write validation report
  const reportPath = join(reportsDir, 'validation-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Console output
  console.log('📊 Results:');
  console.log(`- Campaigns: ${report.counts.campaigns}`);
  console.log(`- Agent Tasks: ${report.counts.agentTasks} (≥5 required: ${report.acceptance.minAgentTasks ? '✓' : '✗'})`);
  console.log(`- Content Assets: ${report.counts.contentAssets} (≥10 required: ${report.acceptance.minContentAssets ? '✓' : '✗'})`);
  console.log(`- Tasks Succeeded: ${report.counts.tasksSucceeded}`);
  console.log(`- Tasks Failed: ${report.counts.tasksFailed}`);
  
  console.log('\n⏱️  Performance:');
  console.log(`- Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`- Avg Latency: ${report.metrics.avgLatencyMs}ms`);
  console.log(`- P95 Latency: ${p95Latency}ms`);
  
  console.log('\n💰 Cost:');
  console.log(`- Total Tokens In: ${totalTokensIn.toLocaleString()}`);
  console.log(`- Total Tokens Out: ${totalTokensOut.toLocaleString()}`);
  console.log(`- Total Cost: $${totalCost.toFixed(4)}`);

  console.log('\n📝 Task Summary:');
  for (const task of tasks) {
    const status = task.status === 'done' ? '✓' : '✗';
    console.log(`  ${status} ${task.agentType}: ${task.status} (${task.latencyMs}ms, ${task.tokensIn + task.tokensOut} tokens, $${task.costUsd.toFixed(4)})`);
  }

  console.log('\n📦 Assets Created:');
  for (const asset of assets) {
    console.log(`  - ${asset.type}: ${asset.title}`);
  }

  console.log(`\n✅ Validation report saved to: ${reportPath}`);
  console.log('\n🎯 Acceptance Criteria:');
  console.log(`  ${report.acceptance.campaignCreated ? '✓' : '✗'} Campaign created`);
  console.log(`  ${report.acceptance.minAgentTasks ? '✓' : '✗'} ≥5 AgentTasks`);
  console.log(`  ${report.acceptance.minContentAssets ? '✓' : '✗'} ≥10 ContentAssets`);
  console.log(`  ${report.acceptance.allTasksCompleted ? '✓' : '✗'} All tasks completed`);
  console.log(`  ${report.acceptance.p95LatencyRecorded ? '✓' : '✗'} P95 latency recorded`);

  const allPassed = Object.values(report.acceptance).every(v => v === true);
  console.log(`\n${allPassed ? '🎉 ALL ACCEPTANCE TESTS PASSED!' : '⚠️  Some acceptance tests failed'}\n`);
}

main()
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
