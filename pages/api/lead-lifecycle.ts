import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the response types
interface LeadStageData {
  stage: string;
  count: number;
  conversionRate: number;
  aiAssisted: boolean;
}

interface LeadTimelineData {
  date: string;
  newLeads: number;
  qualifiedLeads: number;
  opportunities: number;
  closedWon: number;
}

interface LeadLifecycleResponse {
  stageData: LeadStageData[];
  timelineData: LeadTimelineData[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeadLifecycleResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In a real implementation, we would fetch this data from the database
    // For now, we'll generate realistic sample data for real estate/mortgage leads
    
    // Fetch leads from database if available, otherwise use sample data
    let leads;
    try {
      // This assumes you have a Lead model in your Prisma schema
      leads = await prisma.lead.findMany({
        include: {
          agentActions: true,
        },
      });
    } catch (dbError) {
      console.log('Using sample lead data instead of database:', dbError);
      leads = null;
    }

    // Generate stage data based on leads or use sample data
    const stageData = leads?.length 
      ? generateStageDataFromLeads(leads)
      : getSampleStageData();

    // Generate timeline data based on leads or use sample data
    const timelineData = leads?.length
      ? generateTimelineDataFromLeads(leads)
      : getSampleTimelineData();

    res.status(200).json({
      stageData,
      timelineData,
    });
  } catch (error) {
    console.error('Error fetching lead lifecycle data:', error);
    res.status(500).json({ error: 'Failed to fetch lead lifecycle data' });
  }
}

// Function to generate stage data from actual leads
function generateStageDataFromLeads(leads: any[]) {
  // Define the stages in order
  const stages = ['New Lead', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
  
  // Count leads in each stage
  const stageCounts = stages.reduce((acc, stage) => {
    acc[stage] = 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Count AI-assisted leads in each stage
  const aiAssistedCounts = stages.reduce((acc, stage) => {
    acc[stage] = 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Process leads
  leads.forEach(lead => {
    // Map lead status to our stages
    let stage;
    switch (lead.status) {
      case 'NEW':
        stage = 'New Lead';
        break;
      case 'CONTACTED':
        stage = 'Contacted';
        break;
      case 'QUALIFIED':
        stage = 'Qualified';
        break;
      case 'PROPOSAL':
        stage = 'Proposal';
        break;
      case 'NEGOTIATION':
        stage = 'Negotiation';
        break;
      case 'CLOSED_WON':
        stage = 'Closed Won';
        break;
      default:
        stage = 'New Lead';
    }
    
    stageCounts[stage]++;
    
    // Check if lead has AI actions
    if (lead.agentActions?.some((action: any) => action.aiAssisted)) {
      aiAssistedCounts[stage]++;
    }
  });
  
  // Calculate conversion rates
  const stageData: LeadStageData[] = [];
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const count = stageCounts[stage];
    
    // Calculate conversion rate from previous stage
    let conversionRate = 0;
    if (i > 0 && stageCounts[stages[i - 1]] > 0) {
      conversionRate = (count / stageCounts[stages[i - 1]]) * 100;
    } else if (i === 0) {
      conversionRate = 100; // First stage has 100% "conversion"
    }
    
    // Determine if majority of leads in this stage are AI-assisted
    const aiAssisted = aiAssistedCounts[stage] > count / 2;
    
    stageData.push({
      stage,
      count,
      conversionRate,
      aiAssisted,
    });
  }
  
  return stageData;
}

// Function to generate timeline data from actual leads
function generateTimelineDataFromLeads(leads: any[]) {
  // Get date range (last 7 days)
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
  }
  
  // Initialize timeline data
  const timelineData: LeadTimelineData[] = dates.map(date => ({
    date,
    newLeads: 0,
    qualifiedLeads: 0,
    opportunities: 0,
    closedWon: 0,
  }));
  
  // Process leads
  leads.forEach(lead => {
    // Use createdAt date for timeline
    const createdDate = new Date(lead.createdAt).toISOString().split('T')[0];
    const dateIndex = dates.indexOf(createdDate);
    
    if (dateIndex >= 0) {
      // Increment appropriate counters based on lead status
      switch (lead.status) {
        case 'NEW':
        case 'CONTACTED':
          timelineData[dateIndex].newLeads++;
          break;
        case 'QUALIFIED':
          timelineData[dateIndex].qualifiedLeads++;
          break;
        case 'PROPOSAL':
        case 'NEGOTIATION':
          timelineData[dateIndex].opportunities++;
          break;
        case 'CLOSED_WON':
          timelineData[dateIndex].closedWon++;
          break;
      }
    }
  });
  
  return timelineData;
}

// Function to generate sample stage data for real estate/mortgage
function getSampleStageData(): LeadStageData[] {
  // Define the stages with realistic conversion rates for real estate/mortgage
  return [
    {
      stage: 'New Lead',
      count: 120,
      conversionRate: 100, // First stage
      aiAssisted: false,
    },
    {
      stage: 'Contacted',
      count: 98,
      conversionRate: 81.7, // 98/120
      aiAssisted: true, // AI helps with initial outreach
    },
    {
      stage: 'Qualified',
      count: 75,
      conversionRate: 76.5, // 75/98
      aiAssisted: true, // AI helps qualify leads
    },
    {
      stage: 'Proposal',
      count: 52,
      conversionRate: 69.3, // 52/75
      aiAssisted: false,
    },
    {
      stage: 'Negotiation',
      count: 38,
      conversionRate: 73.1, // 38/52
      aiAssisted: true, // AI helps with negotiation strategies
    },
    {
      stage: 'Closed Won',
      count: 29,
      conversionRate: 76.3, // 29/38
      aiAssisted: false,
    },
  ];
}

// Function to generate sample timeline data
function getSampleTimelineData(): LeadTimelineData[] {
  // Generate data for the last 7 days
  const timelineData: LeadTimelineData[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic numbers with some variability
    const baseNewLeads = Math.floor(Math.random() * 8) + 12; // 12-20
    const baseQualified = Math.floor(Math.random() * 6) + 8; // 8-14
    const baseOpportunities = Math.floor(Math.random() * 5) + 5; // 5-10
    const baseClosedWon = Math.floor(Math.random() * 3) + 2; // 2-5
    
    // Add a trend that increases over time (more recent days have higher numbers)
    const trendFactor = 1 + (6 - i) * 0.05; // 1.0 to 1.3
    
    timelineData.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      newLeads: Math.round(baseNewLeads * trendFactor),
      qualifiedLeads: Math.round(baseQualified * trendFactor),
      opportunities: Math.round(baseOpportunities * trendFactor),
      closedWon: Math.round(baseClosedWon * trendFactor),
    });
  }
  
  return timelineData;
}
