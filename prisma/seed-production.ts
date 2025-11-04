import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Production-Grade Seed for ApexSalesAI
 * Schema-aligned, field-complete, premium demo data
 */

// Utility: Generate URL-safe slug from title
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Utility: Random number generator
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('🌱 Seeding ApexSalesAI Production Platform…\n');

  /**
   * PHASE 0: Tenant
   */
  console.log('🏢 PHASE 0: Tenant');
  const tenant = await prisma.tenant.upsert({
    where: { orgId: 'apex-demo' },
    update: {},
    create: {
      name: 'Apex Demo Organization',
      orgId: 'apex-demo',
      domain: 'apexdemo.com',
    },
  });
  console.log('  ✅ Tenant created');

  /**
   * PHASE 1: Content Studio (Campaigns, Tasks, Assets)
   */
  console.log('\n📋 PHASE 1: Content Studio');

  // Campaigns
  const campaignData = [
    {
      title: 'Q4 2025 – Predictive Sales Intelligence Launch',
      objective: 'Drive 100 qualified enterprise demos by end of Q4',
      audience: 'IT Directors, RevOps Leaders, VP Sales at B2B SaaS (50-500 employees)',
      brandVoice: 'Professional, data-driven, confident',
      channels: ['blog', 'social', 'email', 'video'],
      status: 'running',
      createdById: 'system',
    },
    {
      title: 'AI Sales Assistant Thought Leadership Series',
      objective: 'Build organic traffic and establish category authority',
      audience: 'Sales leaders, SDRs, Revenue Operations professionals',
      brandVoice: 'Helpful, authoritative, conversational',
      channels: ['blog', 'social', 'email'],
      status: 'draft',
      createdById: 'system',
    },
    {
      title: '2025 Partner Enablement Program',
      objective: 'Activate 50+ technology partners and MSP resellers',
      audience: 'Technology Partners, System Integrators, MSPs',
      brandVoice: 'Collaborative, supportive, technical',
      channels: ['blog', 'email', 'video'],
      status: 'draft',
      createdById: 'system',
    },
  ];

  const existingCampaigns = await prisma.campaign.count();
  if (existingCampaigns === 0) {
    await prisma.campaign.createMany({ data: campaignData });
    console.log('  ✅ Campaigns (3)');
  } else {
    console.log(`  ⏭️  Campaigns already exist (${existingCampaigns})`);
  }

  const campaign = await prisma.campaign.findFirst();
  if (!campaign) throw new Error('Campaign seed failed');

  // Agent Tasks
  const taskData = [
    {
      campaignId: campaign.id,
      agentType: 'strategy',
      status: 'done',
      input: { brief: '30-day content calendar for Q4 launch' },
      output: { plan: 'Generated 30-day plan with 12 blog posts, 20 social posts, 8 emails' },
      costTokensIn: 1500,
      costTokensOut: 3200,
      latencyMs: 4500,
      completedAt: new Date(),
    },
    {
      campaignId: campaign.id,
      agentType: 'copy',
      status: 'running',
      input: { targets: ['blog', 'email', 'social'] },
      costTokensIn: 800,
      costTokensOut: 0,
      latencyMs: 0,
      startedAt: new Date(),
    },
    {
      campaignId: campaign.id,
      agentType: 'visual',
      status: 'queued',
      input: { style: 'clean, modern, enterprise' },
    },
    {
      campaignId: campaign.id,
      agentType: 'video',
      status: 'queued',
      input: { lengthSec: 75, format: '16:9' },
    },
    {
      campaignId: campaign.id,
      agentType: 'personalize',
      status: 'queued',
      input: { segments: ['CIO', 'Head of RevOps', 'VP Sales'] },
    },
  ];

  const taskCount = await prisma.agentTask.count({ where: { campaignId: campaign.id } });
  if (taskCount === 0) {
    await prisma.agentTask.createMany({ data: taskData });
    console.log('  ✅ AgentTasks (5)');
  } else {
    console.log(`  ⏭️  AgentTasks already exist (${taskCount})`);
  }

  // Content Assets
  const assetData = [
    {
      campaignId: campaign.id,
      type: 'blog',
      title: 'The Future of Autonomous Revenue Teams',
      body: `# The Future of Autonomous Revenue Teams

AI agents are fundamentally reshaping how go-to-market teams operate. With autonomous workflows, sales teams are achieving:

## Key Benefits
- **35% reduction** in administrative time
- **18% improvement** in forecast accuracy  
- **Real-time pipeline insights** without manual data entry

## The Shift to Agentic Workflows
Traditional CRMs require constant human input. Agentic platforms like ApexSalesAI work alongside your team, automatically updating records, scheduling follow-ups, and surfacing insights.

This isn't about replacing salespeople—it's about amplifying their impact.`,
      metadata: { tags: ['AI', 'SalesOps', 'Automation'], wordCount: 850, status: 'published' },
    },
    {
      campaignId: campaign.id,
      type: 'email',
      title: 'Launch Email: Predictive Sales Intelligence',
      body: `Subject: Unlock 18% Better Forecast Accuracy with ApexSalesAI

Hi {{first_name}},

Your sales team is drowning in admin work. What if AI could handle it all?

ApexSalesAI's Predictive Sales Intelligence platform:
✓ Auto-updates CRM records
✓ Schedules follow-ups intelligently  
✓ Surfaces at-risk deals before they slip

Book a 15-minute demo → [Link]

Best,
The ApexSalesAI Team`,
      metadata: { variant: 'base', cta: 'Book Demo', audience: 'Enterprise' },
    },
    {
      campaignId: campaign.id,
      type: 'social',
      title: 'LinkedIn Announcement: PSI Launch',
      body: `🚀 Predictive Sales Intelligence is live.

We've helped revenue teams cut admin time by 35% and improve forecast accuracy by 18%.

How? Agentic AI that works alongside your sales team—not against them.

See it in action → [Demo Link]

#RevOps #AI #SalesAutomation #B2BSaaS`,
      metadata: { platform: 'linkedin', scheduled: true, postDate: '2025-10-30' },
    },
  ];

  const assetCount = await prisma.contentAsset.count({ where: { campaignId: campaign.id } });
  if (assetCount === 0) {
    await prisma.contentAsset.createMany({ data: assetData });
    console.log('  ✅ ContentAssets (3)');
  } else {
    console.log(`  ⏭️  ContentAssets already exist (${assetCount})`);
  }

  /**
   * PHASE 2: Leads (with proper name field)
   */
  console.log('\n🎯 PHASE 2: Leads');

  const leadData = [
    { name: 'John Carter', email: 'john.carter@enterprise.com', company: 'Enterprise Solutions', status: 'Qualified', industry: 'Technology', stage: 'Demo', confidence_score: 85, tenantId: tenant.id },
    { name: 'Sophia Nguyen', email: 'sophia.nguyen@techbridge.io', company: 'TechBridge.io', status: 'Contacted', industry: 'SaaS', stage: 'Prospecting', confidence_score: 70, tenantId: tenant.id },
    { name: 'Alex Hernandez', email: 'alex.h@stackroute.ai', company: 'StackRoute AI', status: 'New', industry: 'AI/ML', stage: 'New', confidence_score: 60, tenantId: tenant.id },
    { name: 'Priya Sharma', email: 'priya.sharma@finova.com', company: 'Finova', status: 'Qualified', industry: 'FinTech', stage: 'Qualified', confidence_score: 90, tenantId: tenant.id },
    { name: 'Liam Bishop', email: 'liam@northstar.dev', company: 'NorthStar Dev', status: 'Contacted', industry: 'DevTools', stage: 'Contacted', confidence_score: 75, tenantId: tenant.id },
    { name: 'Nina Park', email: 'nina.park@quorion.co', company: 'Quorion', status: 'Qualified', industry: 'Enterprise Software', stage: 'Proposal', confidence_score: 88, tenantId: tenant.id },
    { name: 'Marcus Chen', email: 'marcus@velocity.ai', company: 'Velocity AI', status: 'New', industry: 'AI/ML', stage: 'New', confidence_score: 65, tenantId: tenant.id },
    { name: 'Elena Rodriguez', email: 'elena.r@cloudscale.io', company: 'CloudScale', status: 'Contacted', industry: 'Cloud Infrastructure', stage: 'Discovery', confidence_score: 80, tenantId: tenant.id },
  ];

  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.createMany({ data: leadData });
    console.log('  ✅ Leads (8)');
  } else {
    console.log(`  ⏭️  Leads already exist (${leadCount})`);
  }

  /**
   * PHASE 3: Blog Posts (with all required fields)
   */
  console.log('\n📝 PHASE 3: Blog Posts');

  const blogData = [
    {
      title: 'Why Agentic AI Is Reshaping B2B Sales',
      content: `# Why Agentic AI Is Reshaping B2B Sales

The landscape of B2B sales is undergoing a fundamental transformation. Traditional sales processes—characterized by manual data entry, reactive follow-ups, and gut-feel forecasting—are giving way to autonomous, AI-driven workflows that operate with unprecedented speed and precision.

## The Shift from Tools to Agents

For decades, sales teams have relied on CRM systems as passive repositories of customer data. Sales reps input information, managers pull reports, and everyone hopes the data is accurate and up-to-date. This model has inherent limitations:

- **Manual overhead**: Reps spend 65% of their time on non-selling activities
- **Data decay**: CRM records become stale within weeks
- **Reactive decision-making**: Insights arrive too late to influence outcomes

Agentic AI represents a paradigm shift. Instead of tools that wait for human input, autonomous agents actively monitor, analyze, and act on sales signals in real-time.

## What Makes an Agent "Agentic"?

True agentic systems possess three core capabilities:

1. **Autonomy**: Agents operate independently, making decisions based on predefined goals and learned patterns
2. **Proactivity**: Rather than responding to queries, agents anticipate needs and surface insights before they're requested
3. **Adaptability**: Agents learn from outcomes, continuously refining their strategies

## Real-World Impact

Organizations deploying agentic AI are seeing transformative results:

- **35% reduction** in administrative time for sales reps
- **18% improvement** in forecast accuracy
- **2.5x faster** response times to high-intent leads
- **22% increase** in pipeline velocity

## The ApexSalesAI Approach

ApexSalesAI's multi-agent architecture orchestrates specialized agents across the entire revenue lifecycle:

- **Max (SDR Agent)**: Qualifies inbound leads, schedules meetings, and nurtures prospects
- **Strategy Agent**: Analyzes market signals and recommends campaign adjustments
- **Content Agent**: Generates personalized outreach at scale
- **Forecast Agent**: Predicts deal outcomes with machine learning

Each agent operates autonomously while coordinating through a central orchestration layer, ensuring coherent, goal-aligned execution.

## Looking Ahead

The future of B2B sales isn't about replacing salespeople—it's about amplifying their impact. Agentic AI handles the repetitive, data-intensive work, freeing revenue teams to focus on relationship-building, strategic thinking, and closing deals.

As AI capabilities advance, we'll see agents take on increasingly sophisticated tasks: negotiating terms, identifying cross-sell opportunities, and even predicting customer churn before it happens.

**The question isn't whether to adopt agentic AI—it's how quickly you can deploy it before your competitors do.**`,
      excerpt: 'Discover how AI agents are transforming B2B sales execution with autonomous workflows that reduce admin time by 35% and improve forecast accuracy by 18%.',
      slug: slugify('Why Agentic AI Is Reshaping B2B Sales'),
      status: 'PUBLISHED',
      publishedAt: new Date('2025-10-15'),
      createdBy: 'system',
      author: 'ApexSalesAI Editorial Team',
    },
    {
      title: 'From Reactive to Predictive: The Sales Intelligence Revolution',
      content: `# From Reactive to Predictive: The Sales Intelligence Revolution

Sales intelligence has evolved dramatically over the past decade. What began as basic lead scoring has matured into sophisticated predictive systems that anticipate customer needs, forecast deal outcomes, and recommend optimal actions in real-time.

## The Reactive Era

Traditional sales intelligence operated in hindsight. Teams would:

- Review last quarter's performance to inform next quarter's strategy
- Analyze closed deals to understand what worked
- React to customer signals after they'd already moved on

This reactive approach left money on the table. By the time insights surfaced, opportunities had passed.

## Enter Predictive Intelligence

Predictive sales intelligence flips the script. Instead of analyzing what happened, it forecasts what will happen—and prescribes actions to influence outcomes.

### Key Capabilities

**1. Deal Scoring**
Machine learning models analyze hundreds of signals to predict deal closure probability:
- Engagement patterns (email opens, meeting attendance, content downloads)
- Firmographic fit (company size, industry, tech stack)
- Behavioral indicators (pricing page visits, competitor research)

**2. Churn Prediction**
Predictive models identify at-risk customers months before renewal:
- Usage trends (declining logins, feature adoption)
- Support ticket sentiment
- Executive turnover signals

**3. Next Best Action**
AI recommends the optimal next step for each prospect:
- "Send case study on ROI within 24 hours"
- "Schedule executive briefing with CFO"
- "Offer extended trial to demonstrate value"

## The ApexSalesAI Difference

ApexSalesAI's predictive engine combines:

- **Real-time data ingestion**: Continuously monitors CRM, email, web activity, and third-party signals
- **Multi-model ensemble**: Combines multiple ML models for robust predictions
- **Explainable AI**: Every prediction includes reasoning, building trust with sales teams

### Case Study: TechCorp

A mid-market SaaS company deployed ApexSalesAI's predictive intelligence:

- **Before**: 52% forecast accuracy, 90-day sales cycles
- **After**: 78% forecast accuracy, 65-day sales cycles
- **Result**: $2.3M additional revenue in Q1

## Building Your Predictive Stack

Implementing predictive intelligence requires:

1. **Data foundation**: Clean, unified customer data across systems
2. **Signal capture**: Instrumentation to track engagement and intent
3. **Model training**: Historical data to train accurate models
4. **Feedback loops**: Continuous learning from outcomes

## The Future Is Prescriptive

The next frontier goes beyond prediction to prescription. Prescriptive AI doesn't just forecast outcomes—it automatically takes action to achieve desired results.

Imagine a system that:
- Detects a high-value lead showing buying intent
- Automatically schedules a meeting with the right rep
- Generates a personalized pitch deck
- Sends a follow-up sequence tailored to their industry

This isn't science fiction. It's the reality ApexSalesAI is building today.

**Ready to move from reactive to predictive? The future of sales intelligence is here.**`,
      excerpt: 'How predictive AI is replacing manual CRM work and enabling sales teams to forecast with 78% accuracy while reducing sales cycles by 28%.',
      slug: slugify('From Reactive to Predictive: The Sales Intelligence Revolution'),
      status: 'PUBLISHED',
      publishedAt: new Date('2025-10-10'),
      createdBy: 'system',
      author: 'ApexSalesAI Editorial Team',
    },
    {
      title: 'Building Trust in AI-Driven Revenue Operations',
      content: `# Building Trust in AI-Driven Revenue Operations

As AI systems take on more responsibility in revenue operations, a critical question emerges: How do we ensure these systems are trustworthy, transparent, and compliant?

## The Trust Gap

Many organizations hesitate to deploy AI in revenue-critical workflows due to:

- **Black box concerns**: "How did the AI reach this decision?"
- **Compliance risks**: "Does this meet GDPR/SOC 2 requirements?"
- **Accountability questions**: "Who's responsible if the AI makes a mistake?"

These concerns are valid. Revenue operations demand the highest standards of reliability and auditability.

## Principles of Trustworthy AI

ApexSalesAI is built on five core principles:

### 1. Explainability

Every AI decision includes human-readable reasoning:

**Example**: 
- **Decision**: "Prioritize Lead #1247"
- **Reasoning**: "High engagement (5 email opens, 3 website visits), strong fit (enterprise, tech industry), recent intent signal (pricing page view)"

### 2. Auditability

Complete audit trails capture:
- What action was taken
- When it occurred
- Which agent made the decision
- What data informed the decision

This enables compliance teams to reconstruct any AI action for regulatory review.

### 3. Human Oversight

Critical decisions require human approval:
- Contract negotiations above $50K
- Pricing discounts exceeding 20%
- Customer data modifications

Agents recommend; humans decide.

### 4. Data Privacy

ApexSalesAI implements:
- **Encryption at rest and in transit** (AES-256)
- **Role-based access control** (RBAC)
- **Data residency options** (US, EU, UK)
- **GDPR compliance** (right to deletion, data portability)

### 5. Continuous Monitoring

Real-time observability dashboards track:
- Agent performance metrics
- Anomaly detection (unusual patterns)
- Error rates and failure modes
- Bias detection across demographic groups

## Compliance Frameworks

ApexSalesAI supports major compliance standards:

- **SOC 2 Type II**: Annual audits of security controls
- **GDPR**: EU data protection compliance
- **CCPA**: California privacy law compliance
- **ISO 27001**: Information security management

## Building Confidence Through Transparency

We publish:
- **Model cards**: Documentation of AI model capabilities and limitations
- **Performance benchmarks**: Accuracy metrics on public datasets
- **Incident reports**: Post-mortems when things go wrong

## The Path Forward

Trust isn't built overnight. It's earned through:

1. **Consistent performance**: Delivering reliable results over time
2. **Transparent communication**: Explaining how systems work
3. **Responsive support**: Addressing concerns quickly
4. **Continuous improvement**: Learning from mistakes

As AI becomes more capable, the stakes get higher. Organizations that prioritize trustworthy AI will win in the long run—not just because it's the right thing to do, but because it's a competitive advantage.

**Trust is the foundation of AI adoption. At ApexSalesAI, we're committed to earning yours.**`,
      excerpt: 'Enterprise compliance for AI-driven sales platforms: Learn how ApexSalesAI ensures transparency, auditability, and GDPR compliance.',
      slug: slugify('Building Trust in AI-Driven Revenue Operations'),
      status: 'PUBLISHED',
      publishedAt: new Date('2025-10-05'),
      createdBy: 'system',
      author: 'ApexSalesAI Editorial Team',
    },
  ];

  const blogCount = await prisma.blogPost.count();
  const newBlogCount = blogData.length;
  
  for (const blog of blogData) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }
  console.log(`  ✅ BlogPosts (${blogCount + newBlogCount} total, ${newBlogCount} new)`);

  /**
   * PHASE 4: Sequences
   */
  console.log('\n🔄 PHASE 4: Sequences');

  const seqDef = await prisma.sequenceDefinition.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Enterprise 5-Touch Outbound',
      description: 'Intro email → LinkedIn → Call → Follow-up email → Demo invite',
      type: 'enterprise_outbound',
      isActive: true,
      tenantId: tenant.id,
    },
  });

  const stepData = [
    { sequenceDefinitionId: seqDef.id, stepId: 'intro_email', order: 1, name: 'Personalized Intro Email', type: 'email', action: 'send_email', delayHours: 0 },
    { sequenceDefinitionId: seqDef.id, stepId: 'linkedin_connect', order: 2, name: 'LinkedIn Connection + Note', type: 'social', action: 'social_touch', delayHours: 48 },
    { sequenceDefinitionId: seqDef.id, stepId: 'discovery_call', order: 3, name: 'Discovery Call Attempt', type: 'call', action: 'log_call', delayHours: 72 },
    { sequenceDefinitionId: seqDef.id, stepId: 'followup_email', order: 4, name: 'Value-Add Follow-up', type: 'email', action: 'send_email', delayHours: 120 },
    { sequenceDefinitionId: seqDef.id, stepId: 'demo_invite', order: 5, name: 'Demo Invitation', type: 'email', action: 'send_email', delayHours: 168 },
  ];

  const stepCount = await prisma.sequenceStep.count({ where: { sequenceDefinitionId: seqDef.id } });
  if (stepCount === 0) {
    await prisma.sequenceStep.createMany({ data: stepData });
    console.log('  ✅ SequenceSteps (5)');
  } else {
    console.log(`  ⏭️  SequenceSteps already exist (${stepCount})`);
  }

  console.log('\n🎉 Production seed complete!\n');
  console.log('📊 Summary:');
  console.log(`   • Campaigns: ${await prisma.campaign.count()}`);
  console.log(`   • AgentTasks: ${await prisma.agentTask.count()}`);
  console.log(`   • ContentAssets: ${await prisma.contentAsset.count()}`);
  console.log(`   • Leads: ${await prisma.lead.count()}`);
  console.log(`   • BlogPosts: ${await prisma.blogPost.count()}`);
  console.log(`   • Sequences: ${await prisma.sequenceDefinition.count()}`);
  console.log(`   • SequenceSteps: ${await prisma.sequenceStep.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
