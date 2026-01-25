import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First, let's clear any existing events
  await prisma.observabilityEvent.deleteMany({});

  console.log('Seeding ObservabilityEvent table with impressive activity data...');

  // Create an array of impressive events
  const events = [
    // High-value deals and revenue impact
    {
      tenantId: 1,
      type: 'Revenue',
      message: 'Max identified $1.2M opportunity with Salesforce - Flagged for executive attention',
      meta: JSON.stringify({ dealSize: 1200000, probability: 0.85, company: 'Salesforce' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      tenantId: 1,
      type: 'Action',
      message: 'Max negotiated contract terms with Microsoft, increasing deal value by 22%',
      meta: JSON.stringify({ dealSize: 850000, valueIncrease: 0.22, company: 'Microsoft' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    {
      tenantId: 1,
      type: 'Lead',
      message: 'Max qualified enterprise lead (Cisco) - 92% match to ideal customer profile',
      meta: JSON.stringify({ leadScore: 92, company: 'Cisco', annualRevenue: '49B' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },

    // Customer success and support
    {
      tenantId: 1,
      type: 'Support',
      message: 'Max resolved Tier 1 support issue for Adobe in 2m 31s - Customer satisfaction: 9.8/10',
      meta: JSON.stringify({ resolutionTime: '2m 31s', satisfaction: 9.8, company: 'Adobe' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    },
    {
      tenantId: 1,
      type: 'Action',
      message: 'Max detected churn risk for Oracle account - Proactive intervention scheduled',
      meta: JSON.stringify({ churnProbability: 0.68, company: 'Oracle', annualValue: '$420,000' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    },

    // AI-powered insights
    {
      tenantId: 1,
      type: 'Alert',
      message: 'Max identified market trend: 31% increase in enterprise AI adoption - Sales briefing created',
      meta: JSON.stringify({ trend: 'Enterprise AI Adoption', increase: 0.31, source: 'Market Analysis' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
    },
    {
      tenantId: 1,
      type: 'Action',
      message: 'Max analyzed 1,247 customer interactions - Identified 3 new product feature opportunities',
      meta: JSON.stringify({ interactionsAnalyzed: 1247, newFeatures: 3, potentialRevenue: '$2.4M' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    },

    // Operational efficiency
    {
      tenantId: 1,
      type: 'Task',
      message: 'Max automated 47 routine follow-ups, saving sales team 12.5 hours this week',
      meta: JSON.stringify({ automatedTasks: 47, timeSaved: '12.5 hours', efficiency: '+28%' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
    },
    {
      tenantId: 1,
      type: 'Revenue',
      message: 'Max optimized pricing strategy for enterprise segment - Projected impact: +$3.7M ARR',
      meta: JSON.stringify({ segment: 'Enterprise', projectedARR: '$3.7M', confidence: 0.91 }),
      createdAt: new Date(Date.now() - 1000 * 60 * 240) // 4 hours ago
    },

    // Strategic initiatives
    {
      tenantId: 1,
      type: 'Lead',
      message: 'Max identified 5 high-value targets in emerging healthcare AI vertical',
      meta: JSON.stringify({ vertical: 'Healthcare AI', targets: 5, potentialValue: '$8.2M' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 300) // 5 hours ago
    },
    {
      tenantId: 1,
      type: 'Alert',
      message: 'Max detected competitor pricing change - Strategic response recommended',
      meta: JSON.stringify({ competitor: 'Acme Corp', priceChange: '-15%', impact: 'Medium' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 360) // 6 hours ago
    },

    // Personalized engagement
    {
      tenantId: 1,
      type: 'Action',
      message: 'Max personalized outreach to 126 prospects based on buying intent signals',
      meta: JSON.stringify({ prospects: 126, engagementRate: '38%', meetings: 17 }),
      createdAt: new Date(Date.now() - 1000 * 60 * 420) // 7 hours ago
    },
    {
      tenantId: 1,
      type: 'Support',
      message: 'Max created custom onboarding plan for IBM - Implementation time reduced by 40%',
      meta: JSON.stringify({ customer: 'IBM', timeReduction: '40%', satisfaction: '9.7/10' }),
      createdAt: new Date(Date.now() - 1000 * 60 * 480) // 8 hours ago
    },
  ];

  // Insert all events
  for (const event of events) {
    await prisma.observabilityEvent.create({
      data: event
    });
  }

  console.log(`Successfully seeded ${events.length} observability events!`);
}

main()
  .catch((e) => {
    console.error('Error seeding events:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
