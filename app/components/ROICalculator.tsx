'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { roiTemplates, Department, ROITemplateField } from './roiTemplates';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ROIInput {
  currentRevenue: number;
  targetRevenue: number;
  costSavings: number;
  implementationCost: number;
  numAIAgents: number;
  numHumans: number;
  humanAnnualCost: number;
}

// --- Result types for each department ---
type SupportResults = {
  annualTickets: number;
  humanTotalCost: number;
  aiTotalCost: number;
  totalHumanTicketCost: number;
  aiTicketCost: number;
  savings: number;
  roi: number;
};
type HRResults = {
  annualHRRequests: number;
  humanTotalCost: number;
  aiTotalCost: number;
  totalHumanHRRequestCost: number;
  aiHRRequestCost: number;
  savings: number;
  roi: number;
};
type FinanceResults = {
  annualInvoices: number;
  humanTotalCost: number;
  aiTotalCost: number;
  totalHumanInvoiceCost: number;
  aiInvoiceCost: number;
  savings: number;
  roi: number;
};
type SalesResults = {
  annualLeads: number;
  annualDeals: number;
  annualRevenue: number;
  humanTotalCost: number;
  aiTotalCost: number;
  aiRevenue: number;
  savings: number;
  roi: number;
};
type DepartmentResults = SupportResults | HRResults | FinanceResults | SalesResults;

function isSupportResults(obj: any): obj is SupportResults {
  return obj && typeof obj.annualTickets === 'number';
}
function isHRResults(obj: any): obj is HRResults {
  return obj && typeof obj.annualHRRequests === 'number';
}
function isFinanceResults(obj: any): obj is FinanceResults {
  return obj && typeof obj.annualInvoices === 'number';
}
function isSalesResults(obj: any): obj is SalesResults {
  return obj && typeof obj.annualLeads === 'number';
}

const departmentResultKeys: Record<Department, string[]> = {
  support: ['annualTickets','humanTotalCost','aiTotalCost','totalHumanTicketCost','aiTicketCost','savings','roi'],
  hr: ['annualHRRequests','humanTotalCost','aiTotalCost','totalHumanHRRequestCost','aiHRRequestCost','savings','roi'],
  finance: ['annualInvoices','humanTotalCost','aiTotalCost','totalHumanInvoiceCost','aiInvoiceCost','savings','roi'],
  sales: ['annualLeads','annualDeals','annualRevenue','humanTotalCost','aiTotalCost','aiRevenue','savings','roi'],
  mortgage: ['annualLeads','annualClosedLoans','annualRevenue','numHumanAgents','numAIAgents','humanTotalCost','aiTotalCost','savings','roi'],
  custom: [],
};

export default function ROICalculator() {
  const [department, setDepartment] = useState<Department>('support');
  const template = roiTemplates[department];
  // Build initial state from template
  const defaultInputs = Object.fromEntries(
    template.fields.map(f => [f.key, f.benchmark ?? 0])
  );
  const [inputs, setInputs] = useState<Record<string, number | string>>(defaultInputs);

  // When department changes, reset inputs to template defaults
  React.useEffect(() => {
    setInputs(Object.fromEntries(template.fields.map(f => [f.key, f.benchmark ?? 0])));
  }, [department]);

  const calculateROI = () => {
    // Coerce all input values to numbers for calculations
    const get = (key: string) => Number(inputs[key]) || 0;
    // Support template field mapping
    if (department === 'support') {
      const ticketsPerMonth = get('ticketsPerMonth');
      const avgHandleTime = get('avgHandleTime');
      const costPerTicket = get('costPerTicket');
      const aiImplementationCost = get('aiImplementationCost');
      const humanAnnualCost = get('humanAnnualCost');
      const workHoursPerYear = 2080;
      // Dynamically compute agents needed based on volume and handle time
      const numHumanAgents = Math.max(1, Math.ceil((ticketsPerMonth * avgHandleTime * 12) / (workHoursPerYear * 60)));
      const numAIAgents = Math.max(1, Math.ceil((ticketsPerMonth * avgHandleTime * 12) / (workHoursPerYear * 60)));
      const annualTickets = ticketsPerMonth * 12;
      const humanTotalCost = numHumanAgents * humanAnnualCost;
      const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
      const totalHumanTicketCost = humanTotalCost;
      const aiTicketCost = aiTotalCost + aiImplementationCost;
      const savings = totalHumanTicketCost - aiTicketCost;
      const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
      return {
        annualTickets,
        numHumanAgents,
        numAIAgents,
        humanTotalCost,
        aiTotalCost,
        totalHumanTicketCost,
        aiTicketCost,
        savings,
        roi,
      };
    }
    // HR
    if (department === 'hr') {
      const hrTicketsPerMonth = get('hrTicketsPerMonth');
      const avgHRHandleTime = get('avgHRHandleTime');
      const costPerHRRequest = get('costPerHRRequest');
      const aiImplementationCost = get('aiImplementationCost');
      const humanAnnualCost = get('humanAnnualCost');
      const workHoursPerYear = 2080;
      // Dynamically compute agents needed based on volume and handle time
      const numHumanAgents = Math.max(1, Math.ceil((hrTicketsPerMonth * avgHRHandleTime * 12) / (workHoursPerYear * 60)));
      const numAIAgents = Math.max(1, Math.ceil((hrTicketsPerMonth * avgHRHandleTime * 12) / (workHoursPerYear * 60)));
      const annualHRRequests = hrTicketsPerMonth * 12;
      const humanTotalCost = numHumanAgents * humanAnnualCost;
      const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
      const totalHumanHRRequestCost = humanTotalCost;
      const aiHRRequestCost = aiTotalCost + aiImplementationCost;
      const savings = totalHumanHRRequestCost - aiHRRequestCost;
      const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
      return {
        annualHRRequests,
        numHumanAgents,
        numAIAgents,
        humanTotalCost,
        aiTotalCost,
        totalHumanHRRequestCost,
        aiHRRequestCost,
        savings,
        roi,
      };
    }
    // Finance
    if (department === 'finance') {
      const invoicesPerMonth = get('invoicesPerMonth');
      const avgInvoiceHandleTime = get('avgInvoiceHandleTime');
      const costPerInvoice = get('costPerInvoice');
      const aiImplementationCost = get('aiImplementationCost');
      const humanAnnualCost = get('humanAnnualCost');
      const workHoursPerYear = 2080;
      // Dynamically compute agents needed based on volume and handle time
      const numHumanAgents = Math.max(1, Math.ceil((invoicesPerMonth * avgInvoiceHandleTime * 12) / (workHoursPerYear * 60)));
      const numAIAgents = Math.max(1, Math.ceil((invoicesPerMonth * avgInvoiceHandleTime * 12) / (workHoursPerYear * 60)));
      const annualInvoices = invoicesPerMonth * 12;
      const humanTotalCost = numHumanAgents * humanAnnualCost;
      const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
      const totalHumanInvoiceCost = humanTotalCost;
      const aiInvoiceCost = aiTotalCost + aiImplementationCost;
      const savings = totalHumanInvoiceCost - aiInvoiceCost;
      const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
      return {
        annualInvoices,
        numHumanAgents,
        numAIAgents,
        humanTotalCost,
        aiTotalCost,
        totalHumanInvoiceCost,
        aiInvoiceCost,
        savings,
        roi,
      };
    }
    // Mortgage
    if (department === 'mortgage') {
      const leadsPerMonth = get('leadsPerMonth');
      const conversionRate = get('conversionRate') / 100; // percent to decimal
      const avgHandleTime = get('avgHandleTime');
      const avgLoanValue = get('avgLoanValue');
      const aiImplementationCost = get('aiImplementationCost');
      const humanAnnualCost = get('humanAnnualCost');
      const complianceCost = get('complianceCost');
      const workHoursPerYear = 2080;
      // Dynamically compute required agents
      const numHumanAgents = Math.max(1, Math.ceil((leadsPerMonth * avgHandleTime * 12) / (workHoursPerYear * 60)));
      const numAIAgents = Math.max(1, Math.ceil((leadsPerMonth * avgHandleTime * 12) / (workHoursPerYear * 60)));
      const annualLeads = leadsPerMonth * 12;
      const annualClosedLoans = Math.round(annualLeads * conversionRate);
      const annualRevenue = annualClosedLoans * avgLoanValue;
      const humanTotalCost = numHumanAgents * humanAnnualCost + complianceCost;
      const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1)) + complianceCost;
      const savings = humanTotalCost - aiTotalCost;
      const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
      return {
        annualLeads,
        annualClosedLoans,
        annualRevenue,
        numHumanAgents,
        numAIAgents,
        humanTotalCost,
        aiTotalCost,
        savings,
        roi,
      };
    }
    // Sales
    if (department === 'sales') {
      const leadsPerMonth = get('leadsPerMonth');
      const conversionRate = get('conversionRate') / 100; // percent to decimal
      const avgDealSize = get('avgDealSize');
      const salesCycleLength = get('salesCycleLength');
      const aiImplementationCost = get('aiImplementationCost');
      const numAIAgents = get('numAIAgents');
      const numHumanAgents = get('numHumanAgents');
      const humanAnnualCost = get('humanAnnualCost');
      const annualLeads = leadsPerMonth * 12;
      const annualDeals = annualLeads * conversionRate;
      const annualRevenue = annualDeals * avgDealSize;
      const humanTotalCost = numHumanAgents * humanAnnualCost;
      const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
      const aiRevenue = annualRevenue; // Assume same revenue for now
      const savings = humanTotalCost - aiTotalCost;
      const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
      return {
        annualLeads,
        annualDeals,
        annualRevenue,
        humanTotalCost,
        aiTotalCost,
        aiRevenue,
        savings,
        roi,
      };
    }
    // fallback
    return {};
  };


  const results = calculateROI();

  const chartData = {
    labels: ['Current', 'Target'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [inputs.currentRevenue, inputs.targetRevenue],
        borderColor: '#0ea5e9',
        tension: 0.4,
      },
      {
        label: 'Cost Savings ($)',
        data: [0, inputs.costSavings],
        borderColor: '#10b981',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-[#1a1e29] rounded-2xl p-6 font-inter">
      {/* Branding/analytics hooks can be added here */}

      <div className="flex items-center gap-4 mb-6">
        <img src="/images/apex-logo-white.png" alt="Apex Logo" width="120" height="40" loading="lazy" className="h-10 w-auto" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }} />
        <h3 className="text-2xl font-bold text-white font-inter">ROI Calculator</h3>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-white/80 font-semibold">Department:&nbsp;</label>
        <select
          value={department}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartment(e.target.value as Department)}
          className="bg-[#0d1321] text-white px-4 py-2 rounded-lg"
        >
          <option value="support">Customer Support</option>
          <option value="hr">HR</option>
          <option value="finance">Finance</option>
          <option value="sales">Sales</option>
          <option value="mortgage">Mortgage</option>
          <option value="custom">Custom</option>
        </select>
        <span className="text-[#cbd5e0] text-sm">{template.description}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {template.fields.map(field => (
          <div className="space-y-2" key={field.key}>
            <label className="text-white/80 flex gap-1 items-center">
              {field.label}
              {field.help && (
                <span className="text-xs text-[#10b981] cursor-pointer" title={field.help}>ⓘ</span>
              )}
              {/* Validation: show error if required and empty/invalid */}
              {field.type === 'number' && (Number(inputs[field.key]) < 0 || (field.key !== 'conversionRate' && Number(inputs[field.key]) === 0)) && (
                <span className="text-xs text-red-400 ml-2">{field.label} must be positive</span>
              )}
            </label>
            <input
              type={field.type}
              value={
                ['humanAnnualCost', 'aiImplementationCost'].includes(field.key)
                  ? (inputs[`${field.key}Type`] === 'monthly'
                      ? (Number(inputs[field.key]) / 12).toString()
                      : inputs[field.key]?.toString() ?? '')
                  : inputs[field.key]?.toString() ?? ''
              }
              onChange={e => {
                if (['humanAnnualCost', 'aiImplementationCost'].includes(field.key)) {
                  setInputs(prev => ({
                    ...prev,
                    [field.key]: prev[`${field.key}Type`] === 'monthly'
                      ? Number(e.target.value) * 12
                      : Number(e.target.value)
                  }));
                } else {
                  setInputs(prev => ({ ...prev, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }));
                }
              }}
              className={`w-full bg-[#0d1321] text-white px-4 py-2 rounded-lg border ${field.type === 'number' && (Number(inputs[field.key]) < 0 || (field.key !== 'conversionRate' && Number(inputs[field.key]) === 0)) ? 'border-red-500' : 'border-transparent'}`}
              aria-label={field.label}
            />
            {/* Dynamic industry benchmark and source */}
            {field.benchmark !== undefined && (
              <div className="text-xs text-[#cbd5e0] mt-1">
                Benchmark: <span className="font-bold">{field.benchmark}</span>
                {field.source && <span className="ml-2 text-[#6ee7b7]">({field.source})</span>}
              </div>
            )}
            {/* If this is a cost field, show monthly/annual toggle */}
            {['humanAnnualCost', 'aiImplementationCost'].includes(field.key) && (
              <div className="flex gap-2 text-xs text-[#cbd5e0] mt-1">
                <label>
                  <input
                    type="radio"
                    name={`costType-${field.key}`}
                    checked={(inputs[`${field.key}Type`] ?? 'annual') === 'annual'}
                    onChange={() => setInputs(prev => {
                      // If switching from monthly to annual, multiply value by 12
                      if ((prev[`${field.key}Type`] ?? 'annual') === 'monthly') {
                        return {
                          ...prev,
                          [`${field.key}Type`]: 'annual',
                          [field.key]: Number(prev[field.key]) * 12
                        };
                      }
                      return { ...prev, [`${field.key}Type`]: 'annual' };
                    })}
                  />
                  Annual
                </label>
                <label>
                  <input
                    type="radio"
                    name={`costType-${field.key}`}
                    checked={(inputs[`${field.key}Type`] ?? 'annual') === 'monthly'}
                    onChange={() => setInputs(prev => {
                      // If switching from annual to monthly, divide value by 12
                      if ((prev[`${field.key}Type`] ?? 'annual') === 'annual') {
                        return {
                          ...prev,
                          [`${field.key}Type`]: 'monthly',
                          [field.key]: Number(prev[field.key]) / 12
                        };
                      }
                      return { ...prev, [`${field.key}Type`]: 'monthly' };
                    })}
                  />
                  Monthly
                </label>
              </div>
            )}
            {field.benchmark !== undefined && (
              <div className="text-xs text-[#cbd5e0]">Benchmark: <span className="font-bold">{field.benchmark}</span></div>
            )}
            {field.source && (
              <div className="text-xs text-[#6ee7b7]">Source: {field.source}</div>
            )}
          </div>
        ))}
      </div>

      {/* ROI Explanation */}
      <div className="mb-4 p-4 bg-[#0d1321] rounded-lg text-[#cbd5e0]">
        <div className="font-semibold text-white mb-1 flex items-center gap-2">
          What does this ROI mean?
          <span className="text-xs text-[#10b981] cursor-pointer" title="ROI shows the percentage return on investment when using AI agents vs. hiring more staff. Positive ROI means savings; negative means higher cost.">ⓘ</span>
        </div>
        <div>
          ROI in this calculator measures the estimated cost savings from automating with AI agents, compared to using only human staff. It is calculated as:<br />
          <span className="text-[#10b981]">ROI = (Estimated Savings from AI / AI Implementation Cost) × 100</span><br />
          <span className="text-xs text-[#6ee7b7]">Estimated Savings = (Total Human Cost) - (AI Cost)</span>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-6">
        {department === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">AI Ticket Cost</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">${results.aiTicketCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Estimated Savings</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.savings?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 col-span-2">
              <h4 className="text-lg font-semibold text-white mb-2">ROI</h4>
              <p className="text-2xl font-bold text-[#10b981]">{results.roi?.toFixed?.(2) ?? '-'}%</p>
            </div>
          </div>
        )}
        {department === 'hr' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual HR Requests</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.annualHRRequests?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Total Human HR Cost</h4>
              <p className="text-2xl font-bold text-[#ef4444]">${results.totalHumanHRRequestCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">AI HR Cost</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">${results.aiHRRequestCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Estimated Savings</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.savings?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 col-span-2">
              <h4 className="text-lg font-semibold text-white mb-2">ROI</h4>
              <p className="text-2xl font-bold text-[#10b981]">{results.roi?.toFixed?.(2) ?? '-'}%</p>
            </div>
          </div>
        )}
        {department === 'finance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual Invoices</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.annualInvoices?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Total Human Invoice Cost</h4>
              <p className="text-2xl font-bold text-[#ef4444]">${results.totalHumanInvoiceCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">AI Invoice Cost</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">${results.aiInvoiceCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Estimated Savings</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.savings?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 col-span-2">
              <h4 className="text-lg font-semibold text-white mb-2">ROI</h4>
              <p className="text-2xl font-bold text-[#10b981]">{results.roi?.toFixed?.(2) ?? '-'}%</p>
            </div>
          </div>
        )}
        {department === 'sales' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual Leads</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.annualLeads?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual Deals</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.annualDeals?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual Revenue</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.annualRevenue?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Human Sales Cost</h4>
              <p className="text-2xl font-bold text-[#ef4444]">${results.humanTotalCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">AI Sales Cost</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">${results.aiTotalCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Estimated Savings</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.savings?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 col-span-2">
              <h4 className="text-lg font-semibold text-white mb-2">ROI</h4>
              <p className="text-2xl font-bold text-[#10b981]">{results.roi?.toFixed?.(2) ?? '-'}%</p>
            </div>
          </div>
        )}
        {department === 'mortgage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual Leads</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.annualLeads?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Closed Loans</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.annualClosedLoans?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Annual Revenue</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.annualRevenue?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2"># Human Mortgage Officers</h4>
              <p className="text-2xl font-bold text-[#ef4444]">{results.numHumanAgents?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2"># AI Agents</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">{results.numAIAgents?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Total Human Cost</h4>
              <p className="text-2xl font-bold text-[#ef4444]">${results.humanTotalCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Total AI Cost</h4>
              <p className="text-2xl font-bold text-[#0ea5e9]">${results.aiTotalCost?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Estimated Savings</h4>
              <p className="text-2xl font-bold text-[#10b981]">${results.savings?.toLocaleString?.() ?? '-'}</p>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 col-span-2">
              <h4 className="text-lg font-semibold text-white mb-2">ROI</h4>
              <p className="text-2xl font-bold text-[#10b981]">{results.roi?.toFixed?.(2) ?? '-'}%</p>
            </div>
          </div>
        )}
      </div>
      {/* ROI Sensitivity Sliders */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Implementation Cost Slider */}
        <div>
          <label htmlFor="aiCostSlider" className="block text-white/80 mb-1">AI Implementation Cost Sensitivity</label>
          <input
            id="aiCostSlider"
            type="range"
            min={1000}
            max={500000}
            step={1000}
            value={Number(inputs.aiImplementationCost) || 0}
            onChange={e => setInputs(prev => ({ ...prev, aiImplementationCost: Number(e.target.value) }))}
            className="w-full accent-cyan-500"
            aria-label="AI Implementation Cost Sensitivity"
          />
          <span className="text-xs text-[#cbd5e0]">${inputs.aiImplementationCost}</span>
        </div>
        {/* Human Annual Cost Slider */}
        <div>
          <label htmlFor="humanCostSlider" className="block text-white/80 mb-1">Human Annual Cost Sensitivity</label>
          <input
            id="humanCostSlider"
            type="range"
            min={30000}
            max={200000}
            step={1000}
            value={inputs['humanAnnualCostType'] === 'monthly'
              ? Math.round(Number(inputs.humanAnnualCost) / 12)
              : Number(inputs.humanAnnualCost) || 0}
            // When in monthly mode, slider displays monthly value but updates annual value in state
            onChange={e => {
              const val = Number(e.target.value);
              setInputs(prev => ({
                ...prev,
                humanAnnualCost: prev['humanAnnualCostType'] === 'monthly' ? val * 12 : val
              }));
            }}
            className="w-full accent-emerald-500"
            aria-label="Human Annual Cost Sensitivity"
          />
          <span className="text-xs text-[#cbd5e0]">${inputs.humanAnnualCost}</span>
        </div>
        {/* Volume Slider (tickets/leads/invoices) */}
        <div>
          <label htmlFor="volumeSlider" className="block text-white/80 mb-1">Volume Sensitivity</label>
          <input
            id="volumeSlider"
            type="range"
            min={100}
            max={10000}
            step={10}
            value={Number(inputs.ticketsPerMonth || inputs.leadsPerMonth || inputs.invoicesPerMonth || inputs.hrTicketsPerMonth) || 0}
            onChange={e => {
              const val = Number(e.target.value);
              // Set the right key based on department
              if (department === 'support') setInputs(prev => ({ ...prev, ticketsPerMonth: val }));
              else if (department === 'sales') setInputs(prev => ({ ...prev, leadsPerMonth: val }));
              else if (department === 'finance') setInputs(prev => ({ ...prev, invoicesPerMonth: val }));
              else if (department === 'hr') setInputs(prev => ({ ...prev, hrTicketsPerMonth: val }));
              else if (department === 'mortgage') setInputs(prev => ({ ...prev, leadsPerMonth: val }));
            }}
            className="w-full accent-blue-500"
            aria-label="Volume Sensitivity"
          />
          <span className="text-xs text-[#cbd5e0]">
            {department === 'support' && `${inputs.ticketsPerMonth ?? 0} tickets/mo`}
            {department === 'sales' && `${inputs.leadsPerMonth ?? 0} leads/mo`}
            {department === 'finance' && `${inputs.invoicesPerMonth ?? 0} invoices/mo`}
            {department === 'hr' && `${inputs.hrTicketsPerMonth ?? 0} requests/mo`}
            {department === 'mortgage' && `${inputs.leadsPerMonth ?? 0} leads/mo`}
          </span>
        </div>
      </div>

      {/* Scenario Comparison Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Scenario Comparison">
        {/* Render a ScenarioCard for each saved scenario in localStorage */}
        {Object.keys(localStorage).filter(k => k.startsWith('roi-scenario-')).map(key => {
          const scenario = JSON.parse(localStorage.getItem(key) || '{}');
          // Use the same calculateROI logic for each scenario
          const scenarioResults = (() => {
            const get = (k: string) => Number(scenario[k]) || 0;
            if (department === 'support') {
              const ticketsPerMonth = get('ticketsPerMonth');
              const avgHandleTime = get('avgHandleTime');
              const costPerTicket = get('costPerTicket');
              const aiImplementationCost = get('aiImplementationCost');
              const numAIAgents = get('numAIAgents');
              const numHumanAgents = get('numHumanAgents');
              const humanAnnualCost = get('humanAnnualCost');
              const annualTickets = ticketsPerMonth * 12;
              const humanTotalCost = numHumanAgents * humanAnnualCost;
              const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
              const totalHumanTicketCost = annualTickets * costPerTicket;
              const aiTicketCost = aiTotalCost + aiImplementationCost;
              const savings = totalHumanTicketCost - aiTicketCost;
              const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
              return { annualTickets, humanTotalCost, aiTotalCost, totalHumanTicketCost, aiTicketCost, savings, roi };
            }
            if (department === 'hr') {
              const hrTicketsPerMonth = get('hrTicketsPerMonth');
              const avgHRHandleTime = get('avgHRHandleTime');
              const costPerHRRequest = get('costPerHRRequest');
              const aiImplementationCost = get('aiImplementationCost');
              const numAIAgents = get('numAIAgents');
              const numHumanAgents = get('numHumanAgents');
              const humanAnnualCost = get('humanAnnualCost');
              const annualHRRequests = hrTicketsPerMonth * 12;
              const humanTotalCost = numHumanAgents * humanAnnualCost;
              const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
              const totalHumanHRRequestCost = annualHRRequests * costPerHRRequest;
              const aiHRRequestCost = aiTotalCost + aiImplementationCost;
              const savings = totalHumanHRRequestCost - aiHRRequestCost;
              const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
              return { annualHRRequests, humanTotalCost, aiTotalCost, totalHumanHRRequestCost, aiHRRequestCost, savings, roi };
            }
            if (department === 'finance') {
              const invoicesPerMonth = get('invoicesPerMonth');
              const avgInvoiceHandleTime = get('avgInvoiceHandleTime');
              const costPerInvoice = get('costPerInvoice');
              const aiImplementationCost = get('aiImplementationCost');
              const numAIAgents = get('numAIAgents');
              const numHumanAgents = get('numHumanAgents');
              const humanAnnualCost = get('humanAnnualCost');
              const annualInvoices = invoicesPerMonth * 12;
              const humanTotalCost = numHumanAgents * humanAnnualCost;
              const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
              const totalHumanInvoiceCost = annualInvoices * costPerInvoice;
              const aiInvoiceCost = aiTotalCost + aiImplementationCost;
              const savings = totalHumanInvoiceCost - aiInvoiceCost;
              const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
              return { annualInvoices, humanTotalCost, aiTotalCost, totalHumanInvoiceCost, aiInvoiceCost, savings, roi };
            }
            if (department === 'sales') {
              const leadsPerMonth = get('leadsPerMonth');
              const conversionRate = get('conversionRate') / 100;
              const avgDealSize = get('avgDealSize');
              const salesCycleLength = get('salesCycleLength');
              const aiImplementationCost = get('aiImplementationCost');
              const numAIAgents = get('numAIAgents');
              const numHumanAgents = get('numHumanAgents');
              const humanAnnualCost = get('humanAnnualCost');
              const annualLeads = leadsPerMonth * 12;
              const annualDeals = annualLeads * conversionRate;
              const annualRevenue = annualDeals * avgDealSize;
              const humanTotalCost = numHumanAgents * humanAnnualCost;
              const aiTotalCost = numAIAgents * (aiImplementationCost / Math.max(numAIAgents,1));
              const aiRevenue = annualRevenue;
              const savings = humanTotalCost - aiTotalCost;
              const roi = aiImplementationCost ? (savings / aiImplementationCost) * 100 : 0;
              return { annualLeads, annualDeals, annualRevenue, humanTotalCost, aiTotalCost, aiRevenue, savings, roi };
            }
            return {};
          })();
          return (
            <div key={key} className="bg-[#22293a] rounded-xl p-4 shadow-md" tabIndex={0} aria-label={`Scenario ${key.replace('roi-scenario-','')}`}> 
              <div className="font-bold text-white mb-2">Scenario: {key.replace('roi-scenario-','')}</div>
              {/* Executive summary placeholder */}
              <div className="text-[#10b981] mb-2">Executive Summary: This scenario demonstrates the projected ROI and cost savings for {template.name} based on your assumptions. Results are benchmarked against industry standards for credibility.</div>
              {/* Results */}
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(scenarioResults).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[#cbd5e0]">
                    <span>{k}</span>
                    <span className="font-bold">{typeof v === 'number' ? v.toLocaleString() : v}</span>
                  </div>
                ))}
              </div>
              {/* Benchmarks and summary could be expanded here */}
            </div>
          );
        })}
      </div>

      {/* Export & Reset Section */}
      {/* Future analytics hooks can be added here */}
      {/* Sticky action bar for mobile */}
      <div className="mb-6 flex flex-wrap gap-4 sticky bottom-0 bg-[#192136] shadow-lg rounded-xl z-20 p-2 md:static md:bg-transparent md:shadow-none md:rounded-none md:p-0">
        {/* Save/Load Scenario Controls */}
        <button
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-800 transition-colors duration-200 min-w-[120px]"
          aria-label="Save Scenario"
          onClick={() => {
            const name = prompt('Enter a name for this scenario:');
            if (name) {
              localStorage.setItem('roi-scenario-' + name, JSON.stringify(inputs));
              alert('Scenario saved!');
            }
          }}
        >
          Save Scenario
        </button>
        <button
          className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800 transition-colors duration-200 min-w-[120px]"
          aria-label="Load Scenario"
          onClick={() => {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('roi-scenario-'));
            const name = prompt('Available: ' + keys.map(k => k.replace('roi-scenario-','')).join(', ') + '\nEnter scenario name to load:');
            if (name && localStorage.getItem('roi-scenario-' + name)) {
              setInputs(JSON.parse(localStorage.getItem('roi-scenario-' + name) || '{}'));
            } else if (name) {
              alert('Scenario not found.');
            }
          }}
        >
          Load Scenario
        </button>
        <button
          className="bg-rose-700 text-white px-4 py-2 rounded hover:bg-rose-800 transition-colors duration-200 min-w-[120px]"
          aria-label="Delete Scenario"
          onClick={() => {
            const keys = Object.keys(localStorage).filter(k => k.startsWith('roi-scenario-'));
            const name = prompt('Available: ' + keys.map(k => k.replace('roi-scenario-','')).join(', ') + '\nEnter scenario name to delete:');
            if (name && localStorage.getItem('roi-scenario-' + name)) {
              localStorage.removeItem('roi-scenario-' + name);
              alert('Deleted.');
            } else if (name) {
              alert('Scenario not found.');
            }
          }}
        >
          Delete Scenario
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 min-w-[120px]"
          onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute('href', dataStr);
            dlAnchorElem.setAttribute('download', `${department}_roi_results.json`);
            dlAnchorElem.click();
          }}
        >
          Export JSON
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 min-w-[120px]"
          onClick={() => {
            const keys = departmentResultKeys[department];
            const values = keys.map(k => (results as any)[k]);
            const csv = keys.join(',') + '\n' + values.join(',');
            const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute('href', dataStr);
            dlAnchorElem.setAttribute('download', `${department}_roi_results.csv`);
            dlAnchorElem.click();
          }}
        >
          Export CSV
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 min-w-[120px]"
          aria-label="Export PDF"
          onClick={() => {
            const doc = new jsPDF();
            // Logo (top left)
            const logoImg = new Image();
            logoImg.src = '/images/apex-logo-white.png';
            logoImg.onload = () => {
              doc.addImage(logoImg, 'PNG', 10, 5, 30, 18);
              doc.setFontSize(18);
              doc.text(`${template.name} ROI Report`, 45, 18);
              doc.setFontSize(12);
              let y = 30;
              // Executive summary
              const roiVal = results.roi?.toFixed?.(2) ?? '-';
              const summary = `This analysis projects an ROI of ${roiVal}%. By leveraging AI in ${template.name}, your organization can achieve cost savings and efficiency gains that benchmark favorably against industry standards. These results are based on your scenario inputs and the latest industry data.`;
              doc.text('Executive Summary:', 10, y); y += 7;
              doc.text(doc.splitTextToSize(summary, 180), 12, y); y += 14;
              doc.text('Inputs:', 10, y); y += 7;
              template.fields.forEach(field => {
                doc.text(`${field.label}: ${inputs[field.key] ?? ''}`, 12, y);
                y += 7;
              });
              y += 3;
              doc.text('Results:', 10, y); y += 7;
              departmentResultKeys[department].forEach(key => {
                const value = (results as any)[key];
                doc.text(`${key}: ${typeof value === 'number' ? value.toLocaleString() : value}` , 12, y);
                y += 7;
              });
              y += 3;
              doc.text('Benchmarks:', 10, y); y += 7;
              template.fields.forEach(field => {
                if (field.benchmark !== undefined) {
                  doc.text(`${field.label}: ${field.benchmark}${field.source ? ' (' + field.source + ')' : ''}`, 12, y);
                  y += 7;
                }
              });
              doc.save(`${department}_roi_report.pdf`);
            };
          }}
        >
          Export PDF
        </button>
        {/* Email/Share Button */}
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 min-w-[120px]"
          aria-label="Share Results"
          onClick={() => {
            const subject = encodeURIComponent(`${template.name} ROI Results`);
            const body = encodeURIComponent(`Executive Summary:\n\nThis analysis projects an ROI of ${results.roi?.toFixed?.(2) ?? '-'}%. By leveraging AI in ${template.name}, your organization can achieve cost savings and efficiency gains that benchmark favorably against industry standards.\n\nInputs:\n${template.fields.map(field => `${field.label}: ${inputs[field.key] ?? ''}`).join('\n')}\n\nResults:\n${departmentResultKeys[department].map(key => `${key}: ${(results as any)[key]}`).join('\n')}`);
            window.open(`mailto:?subject=${subject}&body=${body}`);
          }}
        >
          Share Results
        </button>
        {/* Feedback Button */}
        {/* Feedback Button */}
        <button
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 min-w-[120px]"
          aria-label="Send Feedback"
          onClick={() => {
            window.open('mailto:info@apexsalesai.com?subject=ROI Calculator Feedback');
          }}
        >
          Feedback
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 min-w-[120px]"
          onClick={() => setInputs(Object.fromEntries(template.fields.map(f => [f.key, f.benchmark ?? 0])))}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
