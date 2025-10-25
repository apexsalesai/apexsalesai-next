import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Utilities for robust seeding
 */
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const choice = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];

type AnyModel = keyof PrismaClient;

async function createSafe(model: AnyModel, data: any, note?: string) {
  // @ts-ignore
  const client = prisma[model];
  if (!client?.create) {
    console.log(`⚠️  Skipped ${note ?? model} (model not found)`);
    return null;
  }
  try {
    // @ts-ignore
    return await client.create({ data });
  } catch (e: any) {
    console.log(`⚠️  Skipped ${note ?? model}: ${e?.message || e}`);
    return null;
  }
}

async function createManySafe(model: AnyModel, data: any[], note?: string) {
  // @ts-ignore
  const client = prisma[model];
  if (!client?.createMany) {
    const results = [];
    for (const d of data) results.push(await createSafe(model, d, note));
    return results;
  }
  try {
    // @ts-ignore
    return await client.createMany({ data, skipDuplicates: true });
  } catch (e: any) {
    console.log(`⚠️  Skipped bulk for ${note ?? model}: ${e?.message || e}`);
    const results = [];
    for (const d of data) results.push(await createSafe(model, d, note));
    return results;
  }
}

async function main() {
  console.log('🌱 Seeding ApexSalesAI Premium Platform…\n');

  /**
   * PHASE 0: Tenants
   */
  console.log('🏢 PHASE 0: Tenants');
  const apexEnterprise = await prisma.tenant.upsert({
    where: { orgId: 'apex-enterprises' },
    update: {},
    create: {
      name: 'Apex Enterprises',
      orgId: 'apex-enterprises',
      domain: 'apex.com',
    },
  });
  console.log('  ✅ Tenants (1)');

  /**
   * PHASE 1: Content Studio Foundation
   */
  console.log('\n📋 PHASE 1: Content Studio');
  
  // Campaigns
  const existingCampaigns = await prisma.campaign.count();
  if (existingCampaigns === 0) {
    await prisma.campaign.createMany({
      data: [
        {
          title: 'Q4 Launch – Predictive Sales Intelligence',
          objective: 'Drive qualified demos for Enterprise',
          audience: 'IT & RevOps leaders at B2B SaaS',
          brandVoice: 'professional',
          channels: ['blog', 'social', 'email', 'video'],
          status: 'draft',
          createdById: 'system',
        },
        {
          title: 'AI Assistants for Customer Support',
          objective: 'Increase newsletter signups',
          audience: 'Support/Success Directors',
          brandVoice: 'confident',
          channels: ['blog', 'social', 'email'],
          status: 'active',
          createdById: 'system',
        },
        {
          title: '2025 Partner Enablement Program',
          objective: 'Channel and MSP partner activation',
          audience: 'Technology Partners & Resellers',
          brandVoice: 'collaborative',
          channels: ['blog', 'email', 'video'],
          status: 'draft',
          createdById: 'system',
        },
      ],
    });
    console.log('  ✅ Campaigns (3)');
  } else {
    console.log(`  ⏭️  Campaigns already exist (${existingCampaigns})`);
  }

  const campaign = await prisma.campaign.findFirst();
  if (!campaign) throw new Error('Campaign seed failed');

  // Agent Tasks
  const taskCount = await prisma.agentTask.count({ where: { campaignId: campaign.id } });
  if (taskCount === 0) {
    await prisma.agentTask.createMany({
      data: [
        { campaignId: campaign.id, agentType: 'strategy', status: 'completed', input: { brief: 'Create content plan for 30 days' }, output: { plan: 'Generated' } },
        { campaignId: campaign.id, agentType: 'copy', status: 'in_progress', input: { targets: ['blog','email','social'] } },
        { campaignId: campaign.id, agentType: 'visual', status: 'queued', input: { style: 'clean, enterprise' } },
        { campaignId: campaign.id, agentType: 'video', status: 'queued', input: { lengthSec: 75 } },
        { campaignId: campaign.id, agentType: 'personalize', status: 'queued', input: { segments: ['CIO','Head of RevOps','VP Sales'] } },
      ],
    });
    console.log('  ✅ AgentTasks (5)');
  } else {
    console.log(`  ⏭️  AgentTasks already exist (${taskCount})`);
  }

  // Content Assets
  const assetCount = await prisma.contentAsset.count({ where: { campaignId: campaign.id } });
  if (assetCount === 0) {
    await prisma.contentAsset.createMany({
      data: [
        {
          campaignId: campaign.id,
          type: 'blog',
          title: 'The Future of Autonomous Revenue Teams',
          body: '# Autonomous Revenue Teams\n\nAI agents are reshaping go-to-market—fewer manual tasks, more pipeline velocity.\n\n## Key Benefits\n- 35% reduction in admin time\n- 18% improvement in forecast accuracy\n- Real-time pipeline insights',
          metadata: { tags: ['AI', 'SalesOps'], wordCount: 850, status: 'published' }
        },
        {
          campaignId: campaign.id,
          type: 'email',
          title: 'Kickoff: Predictive Sales Intelligence',
          body: 'Subject: Unlock pipeline accuracy with ApexSalesAI\n\nHi {{first_name}},\n\nDiscover how teams boost forecasting accuracy by 18% with agentic workflows.',
          metadata: { variant: 'base', cta: 'Book Demo' }
        },
        {
          campaignId: campaign.id,
          type: 'social',
          title: 'LinkedIn Post – PSI Launch',
          body: '🚀 Predictive Sales Intelligence is live.\n\nSee how agentic workflows cut admin time 35%.\n\n#RevOps #AI #SalesAutomation',
          metadata: { platform: 'linkedin', scheduled: true }
        },
      ],
    });
    console.log('  ✅ ContentAssets (3)');
  } else {
    console.log(`  ⏭️  ContentAssets already exist (${assetCount})`);
  }

  /**
   * PHASE 2: Sales Execution Data
   */
  console.log('\n🎯 PHASE 2: Sales Execution');

  // Agents
  console.log('  → Agents');
  await createManySafe('agent', [
    { name: 'Max', role: 'Sales Development AI', status: 'active' },
    { name: 'Mia', role: 'Marketing AI', status: 'active' },
    { name: 'DemoBot', role: 'Demo Scheduler AI', status: 'active' },
  ]);
  // @ts-ignore
  const agents = (await prisma.agent?.findMany?.()) ?? [];

  // Leads
  console.log('  → Leads');
  const leadPool = [
    ['John', 'Carter', 'john.carter@enterprise.com', 'Enterprise Solutions', 'Qualified'],
    ['Sophia', 'Nguyen', 'sophia.nguyen@techbridge.io', 'TechBridge.io', 'Contacted'],
    ['Alex', 'Hernandez', 'alex.h@stackroute.ai', 'StackRoute AI', 'New'],
    ['Priya', 'Sharma', 'priya.sharma@finova.com', 'Finova', 'Qualified'],
    ['Liam', 'Bishop', 'liam@northstar.dev', 'NorthStar Dev', 'Contacted'],
    ['Nina', 'Park', 'nina.park@quorion.co', 'Quorion', 'Qualified'],
    ['Marcus', 'Chen', 'marcus@velocity.ai', 'Velocity AI', 'New'],
    ['Elena', 'Rodriguez', 'elena.r@cloudscale.io', 'CloudScale', 'Contacted'],
  ];
  await createManySafe('lead', leadPool.map(([firstName, lastName, email, company, status]) => ({
    name: `${firstName} ${lastName}`,
    firstName, 
    lastName, 
    email, 
    company, 
    status,
  })));
  // @ts-ignore
  const leads = (await prisma.lead?.findMany?.()) ?? [];

  // Sequence Definition & Steps
  console.log('  → Sequences');
  const seqDef = await createSafe('sequenceDefinition', {
    name: 'Enterprise 5-Touch Outbound',
    description: 'Intro email → LinkedIn → Call → Follow-up email → Demo invite',
    isActive: true,
  });

  const stepsPayload = [
    { order: 1, name: 'Personalized Intro Email', type: 'email', delayHours: 0 },
    { order: 2, name: 'LinkedIn Connection + Note', type: 'social', delayHours: 48 },
    { order: 3, name: 'Discovery Call Attempt', type: 'call', delayHours: 72 },
    { order: 4, name: 'Value-Add Follow-up', type: 'email', delayHours: 120 },
    { order: 5, name: 'Demo Invitation', type: 'email', delayHours: 168 },
  ].map((s) => ({ ...(seqDef ? { sequenceDefinitionId: (seqDef as any).id } : {}), ...s }));

  await createManySafe('sequenceStep', stepsPayload);
  // @ts-ignore
  const steps = (await prisma.sequenceStep?.findMany?.({
    where: seqDef ? { sequenceDefinitionId: (seqDef as any).id } : undefined,
    orderBy: { order: 'asc' },
  })) ?? [];

  // Executions with Actions, Events, and Metrics
  console.log('  → Executions + Actions + Events + Metrics');
  const statuses = ['queued', 'in_progress', 'completed', 'completed', 'completed'];
  const actionTypes = ['compose_email', 'send_email', 'log_call', 'social_touch', 'schedule_demo'];
  const levels = ['info', 'info', 'info', 'warning', 'error'];

  for (const lead of leads) {
    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - rand(1, 14));
    const status = choice(statuses);

    const exec = await createSafe('sequenceExecution', {
      ...(seqDef ? { sequenceDefinitionId: (seqDef as any).id } : {}),
      ...(lead ? { leadId: (lead as any).id } : {}),
      status,
      startedAt,
      completedAt: status === 'completed' ? new Date() : null,
      metadata: { channel: 'email', batch: 'Q4_2025', campaign: campaign.title } as any,
    });

    const actionsToCreate = rand(2, 4);
    for (let i = 0; i < actionsToCreate; i++) {
      const createdAt = new Date(startedAt.getTime() + i * 45 * 60 * 1000);
      const actionStatus = i < actionsToCreate - 1 ? 'success' : choice(['success', 'success', 'success', 'error']);
      
      await createSafe('agentAction', {
        ...(agents[0] ? { agentId: (agents[0] as any).id } : {}),
        ...(exec ? { sequenceExecutionId: (exec as any).id } : {}),
        type: choice(actionTypes),
        status: actionStatus,
        input: { 
          leadEmail: (lead as any).email, 
          step: steps[i]?.name ?? 'N/A',
          company: (lead as any).company 
        } as any,
        output: { 
          messageId: `msg_${Math.random().toString(36).slice(2, 10)}`,
          deliveryStatus: actionStatus === 'success' ? 'delivered' : 'failed'
        } as any,
        createdAt,
      });

      await createSafe('observabilityEvent', {
        source: 'agent',
        level: choice(levels),
        message: `${actionStatus === 'success' ? 'Completed' : 'Failed'} action for ${(lead as any).company}`,
        data: {
          latencyMs: rand(150, 2500),
          tokens: rand(200, 2000),
          step: steps[i]?.name ?? 'N/A',
          leadId: (lead as any).id,
        } as any,
        occurredAt: createdAt,
      });
    }

    for (let d = 0; d < 14; d++) {
      const when = new Date();
      when.setDate(when.getDate() - d);
      
      await createSafe('metricEvent', {
        metric: 'sequence.step.duration_ms',
        value: rand(800, 5000),
        dimensions: {
          sequence: (seqDef as any)?.name ?? 'unknown',
          leadCompany: (lead as any).company ?? 'unknown',
          status: status,
        } as any,
        occurredAt: when,
      });
    }
  }

  // Blog posts
  console.log('\n📝 PHASE 3: Premium Content');
  await createManySafe('blogPost', [
    {
      title: 'Why Agentic AI Is Reshaping B2B Sales',
      slug: 'why-agentic-ai-is-reshaping-b2b-sales',
      content: 'The new generation of AI-driven sales agents are accelerating revenue execution across the entire GTM motion.',
      excerpt: 'Discover how AI-driven sales agents are transforming B2B sales execution and revenue operations.',
      createdBy: 'system',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    {
      title: 'From Reactive to Predictive: The Sales Intelligence Revolution',
      slug: 'from-reactive-to-predictive-sales-intelligence-revolution',
      content: 'ApexSalesAI empowers teams to execute faster, smarter, and at scale with autonomous workflows.',
      excerpt: 'Learn how predictive sales intelligence is revolutionizing revenue operations.',
      createdBy: 'system',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    {
      title: 'Building Trust in AI-Driven Revenue Operations',
      slug: 'building-trust-in-ai-driven-revenue-operations',
      content: 'Enterprise-grade observability and compliance for agentic sales platforms.',
      excerpt: 'Explore enterprise-grade observability and compliance for AI sales platforms.',
      createdBy: 'system',
      status: 'DRAFT',
    },
  ]);

  console.log('\n🎉 Premium seed complete!\n');
  console.log('📊 Summary:');
  console.log(`   • Campaigns: ${await prisma.campaign.count()}`);
  console.log(`   • AgentTasks: ${await prisma.agentTask.count()}`);
  console.log(`   • ContentAssets: ${await prisma.contentAsset.count()}`);
  // @ts-ignore
  console.log(`   • Agents: ${await prisma.agent?.count?.() ?? 0}`);
  // @ts-ignore
  console.log(`   • Leads: ${await prisma.lead?.count?.() ?? 0}`);
  // @ts-ignore
  console.log(`   • Sequences: ${await prisma.sequenceDefinition?.count?.() ?? 0}`);
  // @ts-ignore
  console.log(`   • Executions: ${await prisma.sequenceExecution?.count?.() ?? 0}`);
  // @ts-ignore
  console.log(`   • BlogPosts: ${await prisma.blogPost?.count?.() ?? 0}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
