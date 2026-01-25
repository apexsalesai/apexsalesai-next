// Mock data for dashboard components when API/database is unavailable
export const mockKPIStats = {
  dashboard_kpis: {
    closed_deals: 23,
    meetings_booked: 47,
    leads_rescued: 15,
    ai_driven_revenue: 27800,
  }
};

export const mockFeedEvents = {
  feed_events: [
    {
      type: 'Lead',
      text: 'Qualified lead: Jane Smith from Acme Corp',
      time: new Date().toISOString()
    },
    {
      type: 'Action',
      text: 'Sent follow-up email to Michael Johnson at Tech Innovators',
      time: new Date(Date.now() - 3600000).toISOString()
    },
    {
      type: 'Task',
      text: 'Scheduled demo with Sarah Williams from Global Solutions',
      time: new Date(Date.now() - 7200000).toISOString()
    },
    {
      type: 'Revenue',
      text: 'Deal closed with Acme Corp - $12,500',
      time: new Date(Date.now() - 86400000).toISOString()
    },
    {
      type: 'Alert',
      text: 'High-value lead requires immediate attention: Robert Chen',
      time: new Date(Date.now() - 1800000).toISOString()
    }
  ]
};

export const mockAgentData = {
  decision: {
    action: 'send_follow_up',
    reasoning: "Lead has shown interest but hasn't responded in 5 days. A personalized follow-up has high probability of re-engagement.",
    confidence: 0.92,
    next_steps: [
      'Monitor response rate',
      'If no response in 3 days, schedule call attempt',
      'Update lead score based on engagement'
    ]
  }
};
