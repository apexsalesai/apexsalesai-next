/**
 * Test script for Phase 2 agent execution
 * Run with: npx tsx scripts/test-phase2-agents.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { runAgents } from '../lib/agents/runner';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Testing Phase 2 Multi-Agent System\n');

  // Create test campaign
  console.log('1. Creating test campaign...');
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Q4 Product Launch',
      objective: 'Drive demo requests for our new AI-powered sales platform',
      audience: 'IT leaders and RevOps managers at mid-market B2B companies',
      brandVoice: 'professional',
      channels: ['blog', 'social', 'email', 'video'],
      targetLength: 'medium',
      createdById: 'test-user',
    },
  });
  console.log(`✓ Campaign created: ${campaign.id}\n`);

  // Run all 5 agents
  console.log('2. Running agent chain...');
  const result = await runAgents(campaign.id, [
    'strategy',
    'copy',
    'visual',
    'video',
    'personalize',
  ]);

  console.log('\n✅ Agent execution complete!\n');
  console.log('📊 Results:');
  console.log(`- Tasks completed: ${result.tasks.length}`);
  console.log(`- Assets created: ${result.assetsCreated.length}`);
  
  console.log('\n📝 Task Summary:');
  for (const task of result.tasks) {
    const status = task.status === 'done' ? '✓' : '✗';
    const time = task.completedAt && task.startedAt 
      ? `${Math.round((task.completedAt.getTime() - task.startedAt.getTime()) / 1000)}s`
      : 'N/A';
    console.log(`  ${status} ${task.agentType}: ${task.status} (${time})`);
  }

  console.log('\n📦 Assets Created:');
  const assets = await prisma.contentAsset.findMany({
    where: { campaignId: campaign.id },
    select: { id: true, type: true, title: true },
  });
  
  for (const asset of assets) {
    console.log(`  - ${asset.type}: ${asset.title}`);
  }

  console.log('\n🎯 Test complete! Check Prisma Studio to view full content.');
  console.log('   Run: npx prisma studio\n');
}

main()
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
