import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed script...');
  // Create demo tenants for different verticals
  console.log('Creating tenants...');
  const apexEnterprise = await prisma.tenant.upsert({
    where: { orgId: 'apex-enterprises' },
    update: {},
    create: {
      name: 'Apex Enterprises',
      orgId: 'apex-enterprises',
      domain: 'apex.com',
    },
  });

  const realEstateAgency = await prisma.tenant.upsert({
    where: { orgId: 'skyline-realty' },
    update: {},
    create: {
      name: 'Skyline Realty Group',
      orgId: 'skyline-realty',
      domain: 'skylinerealty.com',
    },
  });

  const mortgageCompany = await prisma.tenant.upsert({
    where: { orgId: 'premier-mortgage' },
    update: {},
    create: {
      name: 'Premier Mortgage Solutions',
      orgId: 'premier-mortgage',
      domain: 'premiermortgage.com',
    },
  });

  // Create demo users
  console.log('Creating users...');
  const enterpriseUser = await prisma.user.upsert({
    where: { email: 'ceo@apex.com' },
    update: {},
    create: {
      email: 'ceo@apex.com',
      name: 'Jordan CEO',
      role: 'ADMIN',
      tenantId: apexEnterprise.id,
    },
  });

  const realEstateAgent = await prisma.user.upsert({
    where: { email: 'sarah@skylinerealty.com' },
    update: {},
    create: {
      email: 'sarah@skylinerealty.com',
      name: 'Sarah Johnson',
      role: 'AGENT',
      tenantId: realEstateAgency.id,
    },
  });

  const mortgageOfficer = await prisma.user.upsert({
    where: { email: 'michael@premiermortgage.com' },
    update: {},
    create: {
      email: 'michael@premiermortgage.com',
      name: 'Michael Rodriguez',
      role: 'LOAN_OFFICER',
      tenantId: mortgageCompany.id,
    },
  });

  // Create agent records for our users
  console.log('Creating agents...');
  await prisma.agent.upsert({
    where: { userId: realEstateAgent.id },
    update: { status: 'active', model: 'gpt-4o' },
    create: {
      userId: realEstateAgent.id,
      model: 'gpt-4o',
      status: 'active'
    }
  });

  await prisma.agent.upsert({
    where: { userId: mortgageOfficer.id },
    update: { status: 'active', model: 'gpt-4o' },
    create: {
      userId: mortgageOfficer.id,
      model: 'gpt-4o',
      status: 'active'
    }
  });

  // Create enterprise demo leads (simulate a thriving pipeline)
  const enterpriseStages = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const enterpriseIndustries = ['FinTech', 'Healthcare', 'SaaS', 'Retail', 'Manufacturing'];
  const companies = [
    { name: 'Cisco', value: 120000 },
    { name: 'Juniper', value: 95000 },
    { name: 'Tesla', value: 185000 },
    { name: 'Zoom', value: 72000 },
    { name: 'Epic Health', value: 133000 },
    { name: 'Stripe', value: 112000 },
    { name: 'Shopify', value: 88000 },
    { name: 'Snowflake', value: 99000 },
    { name: 'Datadog', value: 87000 },
    { name: 'Splunk', value: 105000 },
  ];
  
  console.log('Creating enterprise leads...');
  for (let i = 0; i < companies.length; i++) {
    await prisma.lead.create({
      data: {
        name: companies[i].name,
        email: `${companies[i].name.toLowerCase()}@example.com`,
        industry: enterpriseIndustries[i % enterpriseIndustries.length],
        stage: enterpriseStages[Math.floor(Math.random() * enterpriseStages.length)],
        confidence_score: Math.min(100, Math.round(companies[i].value / 2500)), // Convert dollar value to a confidence score between 0-100
        assignedToId: null,
        tenantId: apexEnterprise.id,
        source: 'Inbound',
      },
    });
  }

  // Create real estate leads with property-specific details
  console.log('Creating real estate leads...');
  const realEstateLeadStages = ['New Inquiry', 'Showing Scheduled', 'Offer Made', 'Under Contract', 'Closed', 'Lost'];
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Luxury'];
  const realEstateLeads = [
    { name: 'John Smith', email: 'john.smith@gmail.com', value: 850000, propertyType: 'Single Family', bedrooms: 4, bathrooms: 3 },
    { name: 'Emma Davis', email: 'emma.davis@yahoo.com', value: 425000, propertyType: 'Condo', bedrooms: 2, bathrooms: 2 },
    { name: 'Robert Johnson', email: 'robert.j@outlook.com', value: 1250000, propertyType: 'Luxury', bedrooms: 5, bathrooms: 4.5 },
    { name: 'Maria Garcia', email: 'maria.g@gmail.com', value: 550000, propertyType: 'Townhouse', bedrooms: 3, bathrooms: 2.5 },
    { name: 'David Chen', email: 'david.chen@hotmail.com', value: 675000, propertyType: 'Single Family', bedrooms: 4, bathrooms: 2 },
    { name: 'Sarah Wilson', email: 'sarah.w@icloud.com', value: 920000, propertyType: 'Single Family', bedrooms: 4, bathrooms: 3.5 },
    { name: 'James Brown', email: 'james.brown@gmail.com', value: 1500000, propertyType: 'Luxury', bedrooms: 6, bathrooms: 5 },
    { name: 'Lisa Taylor', email: 'lisa.taylor@yahoo.com', value: 390000, propertyType: 'Condo', bedrooms: 1, bathrooms: 1.5 },
    { name: 'Michael Rodriguez', email: 'mrodriguez@gmail.com', value: 780000, propertyType: 'Townhouse', bedrooms: 3, bathrooms: 3 },
    { name: 'Jennifer Lee', email: 'jennifer.lee@outlook.com', value: 625000, propertyType: 'Single Family', bedrooms: 3, bathrooms: 2 },
  ];

  for (let i = 0; i < realEstateLeads.length; i++) {
    const lead = realEstateLeads[i];
    await prisma.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        industry: 'Real Estate',
        stage: realEstateLeadStages[Math.floor(Math.random() * realEstateLeadStages.length)],
        confidence_score: Math.min(100, Math.round(lead.value / 15000)), // Convert property value to a confidence score
        assignedToId: realEstateAgent.id,
        tenantId: realEstateAgency.id,
        source: i % 3 === 0 ? 'Zillow' : i % 3 === 1 ? 'Referral' : 'Website',
      },
    });
  }

  // Create mortgage leads with loan-specific details
  console.log('Creating mortgage leads...');
  const mortgageLeadStages = ['Inquiry', 'Pre-Approval', 'Application', 'Processing', 'Underwriting', 'Approved', 'Closed', 'Denied'];
  const loanTypes = ['Conventional', 'FHA', 'VA', 'Jumbo', 'Refinance'];
  const mortgageLeads = [
    { name: 'Thomas Wilson', email: 'thomas.w@gmail.com', value: 320000, loanType: 'Conventional', creditScore: 740, downPayment: 20 },
    { name: 'Jessica Martinez', email: 'jessica.m@yahoo.com', value: 275000, loanType: 'FHA', creditScore: 680, downPayment: 3.5 },
    { name: 'Andrew Thompson', email: 'andrew.t@outlook.com', value: 550000, loanType: 'Jumbo', creditScore: 790, downPayment: 25 },
    { name: 'Sophia Kim', email: 'sophia.k@gmail.com', value: 425000, loanType: 'Conventional', creditScore: 720, downPayment: 15 },
    { name: 'Daniel Garcia', email: 'daniel.g@hotmail.com', value: 180000, loanType: 'VA', creditScore: 710, downPayment: 0 },
    { name: 'Olivia Johnson', email: 'olivia.j@icloud.com', value: 390000, loanType: 'Conventional', creditScore: 760, downPayment: 20 },
    { name: 'William Davis', email: 'william.d@gmail.com', value: 620000, loanType: 'Jumbo', creditScore: 800, downPayment: 30 },
    { name: 'Ava Brown', email: 'ava.b@yahoo.com', value: 210000, loanType: 'FHA', creditScore: 650, downPayment: 3.5 },
    { name: 'Ethan Wilson', email: 'ethan.w@gmail.com', value: 450000, loanType: 'Conventional', creditScore: 730, downPayment: 15 },
    { name: 'Isabella Rodriguez', email: 'isabella.r@outlook.com', value: 340000, loanType: 'Refinance', creditScore: 750, downPayment: 0 },
  ];

  for (let i = 0; i < mortgageLeads.length; i++) {
    const lead = mortgageLeads[i];
    await prisma.lead.create({
      data: {
        name: lead.name,
        email: lead.email,
        industry: 'Mortgage',
        stage: mortgageLeadStages[Math.floor(Math.random() * mortgageLeadStages.length)],
        confidence_score: Math.min(100, Math.round((lead.creditScore / 8) + (lead.downPayment * 1.5))), // Calculate score based on credit and down payment
        assignedToId: mortgageOfficer.id,
        tenantId: mortgageCompany.id,
        source: i % 3 === 0 ? 'Bank Referral' : i % 3 === 1 ? 'Real Estate Agent' : 'Website',
      },
    });
  }

  // Add a few closed-won and lost leads for realism
  console.log('Adding additional enterprise leads...');
  await prisma.lead.createMany({
    data: [
      { name: 'Microsoft', email: 'ms@microsoft.com', industry: 'SaaS', stage: 'Closed Won', confidence_score: 98, tenantId: apexEnterprise.id, source: 'Referral' },
      { name: 'Oracle', email: 'oracle@oracle.com', industry: 'SaaS', stage: 'Closed Lost', confidence_score: 40, tenantId: apexEnterprise.id, source: 'Outbound' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log('Seed completed successfully!');
    prisma.$disconnect();
  })
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
