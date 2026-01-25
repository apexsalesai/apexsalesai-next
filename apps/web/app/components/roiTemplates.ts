// ROI Templates and Benchmarks for Customer Support, HR, and Finance

export type Department = 'support' | 'hr' | 'finance' | 'sales' | 'mortgage' | 'custom';

export interface ROITemplateField {
  key: string;
  label: string;
  type: 'number' | 'text';
  help?: string;
  benchmark?: number;
  source?: string;
}

export interface ROITemplate {
  name: string;
  description: string;
  fields: ROITemplateField[];
  benchmarks?: Record<string, number>;
}

export const roiTemplates: Record<Department, ROITemplate> = {
  support: {
    name: 'Customer Support',
    description: 'Measure ROI for automating customer support with AI agents.',
    fields: [
      { key: 'ticketsPerMonth', label: 'Support Tickets per Month', type: 'number', benchmark: 1200, help: 'Average monthly tickets handled by your team.', source: 'Zendesk Benchmark 2023' },
      { key: 'avgHandleTime', label: 'Average Handle Time (min)', type: 'number', benchmark: 8, help: 'Minutes to resolve a typical ticket.', source: 'Gartner 2023' },
      { key: 'costPerTicket', label: 'Cost per Ticket ($)', type: 'number', benchmark: 7.5, help: 'Fully loaded cost per resolved ticket.', source: 'HDI 2023' },
      { key: 'aiImplementationCost', label: 'AI Implementation Cost ($)', type: 'number', help: 'One-time or annualized cost for AI deployment.' },
      { key: 'numAIAgents', label: 'Number of AI Agents', type: 'number', help: 'Number of AI agents you plan to deploy.' },
      { key: 'numHumanAgents', label: 'Number of Human Agents', type: 'number', help: 'Number of human agents currently handling tickets.' },
      { key: 'humanAnnualCost', label: 'Annual Cost per Human Agent ($)', type: 'number', benchmark: 65000, help: 'Salary + benefits per agent.', source: 'Glassdoor 2024' },
    ],
  },
  hr: {
    name: 'Human Resources',
    description: 'Calculate ROI for automating HR inquiries and processes with AI.',
    fields: [
      { key: 'hrTicketsPerMonth', label: 'HR Requests per Month', type: 'number', benchmark: 400, help: 'Benefits, PTO, onboarding, etc.', source: 'SHRM 2023' },
      { key: 'avgHRHandleTime', label: 'Avg. Handle Time (min)', type: 'number', benchmark: 15, help: 'Minutes per HR request.', source: 'SHRM 2023' },
      { key: 'costPerHRRequest', label: 'Cost per HR Request ($)', type: 'number', benchmark: 11, help: 'Fully loaded cost per HR request.', source: 'SHRM 2023' },
      { key: 'aiImplementationCost', label: 'AI Implementation Cost ($)', type: 'number', help: 'One-time or annualized cost for AI deployment.' },
      { key: 'numAIAgents', label: 'Number of AI Agents', type: 'number', help: 'Number of AI agents you plan to deploy.' },
      { key: 'numHumanAgents', label: 'Number of Human HR Staff', type: 'number', help: 'Number of humans currently handling HR requests.' },
      { key: 'humanAnnualCost', label: 'Annual Cost per HR Staff ($)', type: 'number', benchmark: 78000, help: 'Salary + benefits per HR staff.', source: 'Bureau of Labor Statistics 2024' },
    ],
  },
  finance: {
    name: 'Finance',
    description: 'Assess ROI for automating finance tasks with AI agents.',
    fields: [
      { key: 'invoicesPerMonth', label: 'Invoices Processed per Month', type: 'number', benchmark: 900, help: 'Vendor/customer invoices processed.', source: 'Ardent Partners 2023' },
      { key: 'avgInvoiceHandleTime', label: 'Avg. Handle Time (min)', type: 'number', benchmark: 12, help: 'Minutes per invoice.', source: 'Ardent Partners 2023' },
      { key: 'costPerInvoice', label: 'Cost per Invoice ($)', type: 'number', benchmark: 8.5, help: 'Fully loaded cost per invoice.', source: 'Ardent Partners 2023' },
      { key: 'aiImplementationCost', label: 'AI Implementation Cost ($)', type: 'number', help: 'One-time or annualized cost for AI deployment.' },
      { key: 'numAIAgents', label: 'Number of AI Agents', type: 'number', help: 'Number of AI agents you plan to deploy.' },
      { key: 'numHumanAgents', label: 'Number of Human Finance Staff', type: 'number', help: 'Number of humans currently handling finance tasks.' },
      { key: 'humanAnnualCost', label: 'Annual Cost per Finance Staff ($)', type: 'number', benchmark: 85000, help: 'Salary + benefits per finance staff.', source: 'Bureau of Labor Statistics 2024' },
    ],
  },
  sales: {
    name: 'Sales',
    description: 'Estimate ROI for automating sales outreach and pipeline management with AI.',
    fields: [
      { key: 'leadsPerMonth', label: 'Leads Generated per Month', type: 'number', benchmark: 500, help: 'Number of inbound/outbound leads per month.', source: 'HubSpot Benchmark 2023' },
      { key: 'conversionRate', label: 'Lead-to-Customer Conversion Rate (%)', type: 'number', benchmark: 15, help: 'Percentage of leads that convert to customers.', source: 'Salesforce 2023' },
      { key: 'avgDealSize', label: 'Average Deal Size ($)', type: 'number', benchmark: 8000, help: 'Average value of a closed deal.', source: 'Salesforce 2023' },
      { key: 'salesCycleLength', label: 'Average Sales Cycle Length (days)', type: 'number', benchmark: 45, help: 'Average number of days from lead to close.', source: 'Gartner 2023' },
      { key: 'aiImplementationCost', label: 'AI Implementation Cost ($)', type: 'number', help: 'One-time or annualized cost for AI deployment.' },
      { key: 'numAIAgents', label: 'Number of AI Agents', type: 'number', help: 'Number of AI agents you plan to deploy.' },
      { key: 'numHumanAgents', label: 'Number of Human Sales Reps', type: 'number', help: 'Number of human sales reps currently handling leads.' },
      { key: 'humanAnnualCost', label: 'Annual Cost per Sales Rep ($)', type: 'number', benchmark: 90000, help: 'Salary + benefits per sales rep.', source: 'Glassdoor 2024' },
    ],
  },
  mortgage: {
    name: 'Mortgage',
    description: 'Model ROI for automating mortgage lead management, qualification, and processing with AI.',
    fields: [
      { key: 'leadsPerMonth', label: 'Mortgage Leads per Month', type: 'number', benchmark: 800, help: 'Number of new mortgage inquiries per month.', source: 'MBA 2024' },
      { key: 'conversionRate', label: 'Lead-to-Closed Loan Conversion Rate (%)', type: 'number', benchmark: 4, help: 'Percentage of leads that result in funded mortgages.', source: 'Ellie Mae Origination Insight Report 2023' },
      { key: 'avgHandleTime', label: 'Avg. Handle Time per Lead (min)', type: 'number', benchmark: 30, help: 'Minutes spent qualifying, following up, and processing each lead.', source: 'Industry Estimate' },
      { key: 'avgLoanValue', label: 'Average Loan Value ($)', type: 'number', benchmark: 340000, help: 'Average funded loan size.', source: 'MBA 2024' },
      { key: 'aiImplementationCost', label: 'AI Implementation Cost ($)', type: 'number', help: 'One-time or annualized cost for AI/automation.' },
      { key: 'numAIAgents', label: 'Number of AI Agents', type: 'number', help: 'Number of AI agents you plan to deploy.' },
      { key: 'numHumanAgents', label: 'Number of Human Mortgage Officers', type: 'number', help: 'Number of human staff currently handling leads.' },
      { key: 'humanAnnualCost', label: 'Annual Cost per Mortgage Officer ($)', type: 'number', benchmark: 95000, help: 'Salary + benefits per mortgage officer.', source: 'Glassdoor 2024' },
      { key: 'complianceCost', label: 'Annual Compliance/QA Cost ($)', type: 'number', benchmark: 15000, help: 'Annual cost for compliance and quality assurance.', source: 'Industry Estimate' },
    ],
  },
  custom: {
    name: 'Custom',
    description: 'Create your own ROI scenario with custom fields.',
    fields: [],
  },
};
