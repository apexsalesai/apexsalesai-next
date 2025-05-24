export interface KPI {
  title: string;
  value: string;
  trend: string;
  badgeColor: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
  color: string;
}

export interface DepartmentData {
  title: string;
  kpis: KPI[];
  charts: Record<string, ChartData>;
  activity: string[];
}

export interface MockData {
  executive: DepartmentData;
  sales: DepartmentData;
  support: DepartmentData;
  operations: DepartmentData;
  hr: DepartmentData;
  finance: DepartmentData;
  product: DepartmentData;
}

/**
 * Premium SaaS Mock Data for ApexSalesAI Dashboards
 * Consistent, scalable, and realistic for world-class demos & development.
 * All badgeColor values use Tailwind CSS classes for design consistency.
 */
const mockData: MockData = {
  executive: {
    title: 'Executive Dashboard',
    kpis: [
      { title: 'Total Cost Savings', value: '$218,400', trend: '+12% MoM', badgeColor: 'green' },
      { title: 'Revenue Impact', value: '$1.92M', trend: '+7.8% influenced', badgeColor: 'blue' },
      { title: 'AI ROI', value: '368%', trend: 'ROI from Apex Agents', badgeColor: 'cyan' },
      { title: 'Productivity Gains', value: '1,240 hrs/mo', trend: '+20% growth', badgeColor: 'teal' }
    ],
    charts: {
      costSavings: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [150000, 180000, 200000, 218400],
        color: '#00c2cb'
      },
      revenueGrowth: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [1.8, 1.9, 2.0, 2.1],
        color: '#00a8b3'
      }
    },
    activity: [
      'Max responded to Cisco lead – Booked demo @ 11:00 AM',
      'Max closed Tier 1 support issue in 2m 31s',
      'Max flagged an anomaly in usage trend – Ops notified',
      'Max sent follow-up to qualified prospect (Juniper)',
      'Max updated CRM: Revenue Opportunity +$28,000',
      'Max reviewed quarterly strategy with board',
      'Max approved budget for new AI initiative'
    ]
  },
  sales: {
    title: 'Sales Dashboard',
    kpis: [
      { title: 'Pipeline Value', value: '$4.2M', trend: '+15% MoM', badgeColor: 'green' },
      { title: 'Lead Conversion', value: '32%', trend: '+4.5% QoQ', badgeColor: 'blue' },
      { title: 'Response Time', value: '2m 45s', trend: '-25% avg', badgeColor: 'cyan' },
      { title: 'Qualified Leads', value: '125/mo', trend: '+20% growth', badgeColor: 'teal' },
      { title: 'Deal Win Rate', value: '58%', trend: '+6% improvement', badgeColor: 'purple' }
    ],
    charts: {
      pipeline: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [850000, 1200000, 1450000, 1700000],
        color: '#0EA5E9'
      },
      conversion: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        data: [28, 30, 32, 34, 35],
        color: '#22d3ee'
      }
    },
    activity: [
      'Max qualified 10 new leads in last hour',
      'Max booked 3 demos for tomorrow',
      'Max sent 45 personalized follow-ups',
      'Max identified 5 high-potential opportunities',
      'Max updated pipeline: 2 deals moved to "Closing" stage',
      'Max analyzed sales trends for Q2',
      'Max coached new SDR team member'
    ]
  },
  support: {
    title: 'Support Dashboard',
    kpis: [
      { title: 'First Response Time', value: '1m 23s', trend: '-35% avg', badgeColor: 'green' },
      { title: 'Resolution Time', value: '2h 15m', trend: '-22% avg', badgeColor: 'blue' },
      { title: 'CSAT Score', value: '9.4/10', trend: '+0.8 pts', badgeColor: 'cyan' },
      { title: 'Ticket Volume', value: '245/mo', trend: '+10% growth', badgeColor: 'teal' },
      { title: 'Agent Efficiency', value: '92%', trend: '+5% improvement', badgeColor: 'purple' }
    ],
    charts: {
      response: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        data: [90, 85, 80, 75, 70],
        color: '#0EA5E9'
      },
      satisfaction: {
        labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
        data: [45, 35, 15, 5],
        color: '#22d3ee'
      }
    },
    activity: [
      'Max resolved 15 tickets in last hour',
      'Max identified 3 recurring issues',
      'Max improved 5 KB articles',
      'Max escalated 2 critical issues',
      'Max updated SLA metrics',
      'Max trained new support agent',
      'Max hosted customer feedback session'
    ]
  },
  operations: {
    title: 'Operations Dashboard',
    kpis: [
      { title: 'MTTR', value: '30 mins', trend: '-10%', badgeColor: 'green' },
      { title: 'Deployment Time', value: '15 mins', trend: '-15%', badgeColor: 'blue' },
      { title: 'Incident Rate', value: '0.5%', trend: '-20%', badgeColor: 'cyan' },
      { title: 'Resource Utilization', value: '75%', trend: '+5%', badgeColor: 'teal' },
      { title: 'Uptime', value: '99.99%', trend: '+0.01%', badgeColor: 'purple' }
    ],
    charts: {
      uptime: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [99.98, 99.99, 99.995, 99.998],
        color: '#0EA5E9'
      },
      incidents: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        data: [5, 4, 3, 2, 1],
        color: '#22d3ee'
      }
    },
    activity: [
      'Automated 12 workflows last week',
      'Reduced deployment time by 40%',
      'Deployed 5 new features',
      'Resolved 3 critical incidents',
      'Optimized 8 cloud resources',
      'Max conducted quarterly ops review',
      'Max implemented new monitoring tools'
    ]
  },
  hr: {
    title: 'HR Dashboard',
    kpis: [
      { title: 'Turnover Rate', value: '12%', trend: '-5%', badgeColor: 'green' },
      { title: 'Training Hours', value: '45', trend: '+10%', badgeColor: 'blue' },
      { title: 'Recruitment Time', value: '30 days', trend: '-15%', badgeColor: 'cyan' },
      { title: 'Diversity Score', value: '85%', trend: '+2%', badgeColor: 'teal' },
      { title: 'Employee Satisfaction', value: '92%', trend: '+3%', badgeColor: 'purple' }
    ],
    charts: {
      turnover: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [15, 12, 10, 8],
        color: '#0EA5E9'
      },
      diversity: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        data: [80, 82, 84, 85, 86],
        color: '#22d3ee'
      }
    },
    activity: [
      'Processed 15 new hires',
      'Conducted 20 performance reviews',
      'Updated 5 training programs',
      'Scheduled 10 interviews',
      'Launched new diversity initiative',
      'Max hosted employee wellness seminar',
      'Max updated benefits documentation'
    ]
  },
  finance: {
    title: 'Finance Dashboard',
    kpis: [
      { title: 'Budget Variance', value: '2%', trend: '-1%', badgeColor: 'green' },
      { title: 'AP Processing Time', value: '3 days', trend: '-25%', badgeColor: 'blue' },
      { title: 'Invoice Accuracy', value: '99%', trend: '+1%', badgeColor: 'cyan' },
      { title: 'Revenue Growth', value: '15%', trend: '+3% QoQ', badgeColor: 'teal' },
      { title: 'Expense Ratio', value: '22%', trend: '-2%', badgeColor: 'purple' }
    ],
    charts: {
      budget: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        data: [100, 102, 101, 100, 99],
        color: '#0EA5E9'
      },
      revenue: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [500000, 600000, 700000, 800000],
        color: '#22d3ee'
      }
    },
    activity: [
      'Processed 120 invoices',
      'Closed Q1 financials',
      'Updated budget forecasts',
      'Reviewed 15 expense reports',
      'Generated financial reports',
      'Max reconciled accounts payable',
      'Max presented financials to execs'
    ]
  },
  product: {
    title: 'Product Dashboard',
    kpis: [
      { title: 'Time to Market', value: '30 days', trend: '-20%', badgeColor: 'green' },
      { title: 'Bug Rate', value: '0.2%', trend: '-30%', badgeColor: 'blue' },
      { title: 'Feature Completion', value: '95%', trend: '+5%', badgeColor: 'cyan' },
      { title: 'User Feedback Score', value: '4.5', trend: '+10%', badgeColor: 'teal' },
      { title: 'Code Quality', value: '92%', trend: '+3%', badgeColor: 'purple' }
    ],
    charts: {
      timeToMarket: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [45, 38, 32, 30],
        color: '#00c2cb'
      },
      bugs: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [0.5, 0.35, 0.25, 0.2],
        color: '#00a8b3'
      }
    },
    activity: [
      'Time to market reduced by 20%',
      'Bug rate decreased by 30%'
    ]
  }
};

export default mockData;
