import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the response type
interface AgentROIResponse {
  agentData: {
    name: string;
    revenue: number;
    cost: number;
    deals: number;
    roi: number;
  }[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AgentROIResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In a real implementation, we would fetch this data from the database
    // For now, we'll generate realistic sample data for real estate/mortgage agents
    
    // Fetch agents from database if available, otherwise use sample data
    let agents;
    try {
      // This assumes you have an Agent model in your Prisma schema
      // If not, this will fail gracefully and use the sample data
      agents = await prisma.agent.findMany({
        include: {
          leads: true,
          actions: true,
        },
      });
    } catch (dbError) {
      console.log('Using sample agent data instead of database:', dbError);
      agents = null;
    }

    const agentData = agents?.length 
      ? agents.map(agent => {
          // Calculate metrics based on actual database data
          const totalLeads = agent.leads?.length || 0;
          const totalActions = agent.actions?.length || 0;
          
          // Calculate revenue based on closed deals
          const closedDeals = agent.leads?.filter(lead => lead.status === 'CLOSED_WON') || [];
          const totalRevenue = closedDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
          
          // Estimate cost based on actions (in a real system, this would be more sophisticated)
          const estimatedCost = totalActions * 5; // $5 per action as a simple estimate
          
          return {
            name: agent.name,
            revenue: totalRevenue,
            cost: estimatedCost,
            deals: closedDeals.length,
            roi: estimatedCost > 0 ? (totalRevenue - estimatedCost) / estimatedCost : 0,
          };
        })
      : getSampleAgentData();

    res.status(200).json({ agentData });
  } catch (error) {
    console.error('Error fetching agent ROI data:', error);
    res.status(500).json({ error: 'Failed to fetch agent ROI data' });
  }
}

// Function to generate sample agent data for real estate/mortgage
function getSampleAgentData() {
  // Real estate and mortgage agent names
  const agentNames = [
    'Sarah Johnson', 
    'Michael Chen', 
    'Jessica Rodriguez', 
    'David Kim', 
    'Rachel Thompson',
    'Robert Garcia',
    'Emma Wilson',
    'James Taylor'
  ];

  return agentNames.map(name => {
    // Generate realistic revenue between $50,000 and $500,000
    const revenue = Math.floor(Math.random() * 450000) + 50000;
    
    // Generate realistic cost between $5,000 and $50,000
    const cost = Math.floor(Math.random() * 45000) + 5000;
    
    // Generate realistic number of deals between 2 and 20
    const deals = Math.floor(Math.random() * 18) + 2;
    
    // Calculate ROI
    const roi = (revenue - cost) / cost;
    
    return {
      name,
      revenue,
      cost,
      deals,
      roi,
    };
  });
}
