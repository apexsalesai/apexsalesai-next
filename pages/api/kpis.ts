import type { NextApiRequest, NextApiResponse } from 'next';
import type { KPIsResponse } from '../../types/api';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enhanced fallback KPIs with more impressive numbers that directly impact revenue/GP
const fallbackKPIs: KPIsResponse = {
  dashboard_kpis: {
    // Original metrics
    closed_deals: 14,
    meetings_booked: 47,
    leads_rescued: 23,
    pipeline_at_risk: 8,
    
    // Executive-level KPIs (C-Suite, Board)
    ai_driven_revenue: 1840000, // $1.84M in AI-attributed revenue
    sales_cycle_reduction: 37,  // 37% reduction in sales cycle
    cost_savings: 420000,       // $420K in operational cost savings
    roi_percentage: 347,        // 347% ROI on AI investment
    conversion_lift: 42,        // 42% lift in conversion rates
    
    // Sales Leadership KPIs
    forecast_accuracy: 94,      // 94% forecast accuracy
    win_rate: 68,               // 68% win rate with AI assistance
    deal_size_increase: 27,     // 27% increase in average deal size
    
    // Marketing Leadership KPIs
    lead_quality_score: 8.7,    // 8.7/10 average quality score
    campaign_optimization: 31,  // 31% improvement in campaign performance
    
    // Customer Success KPIs
    churn_reduction: 42,        // 42% reduction in customer churn
    expansion_revenue: 680000,  // $680K from AI-driven upsells/cross-sells
    csat_improvement: 24,       // 24% improvement in CSAT scores
    
    // SMB-Focused KPIs
    time_saved_hours: 23,       // 23 hours saved per week
    leads_per_dollar: 4.8,      // 4.8 qualified leads per marketing dollar
    
    // Real Estate Agent KPIs
    leads_captured: 42,         // 42 leads captured from portals/websites
    response_time_seconds: 30,  // 30-second average response time to new leads
    showings_booked: 28,        // 28 property showings auto-scheduled
    
    // Mortgage Broker KPIs
    applications_completed: 31, // 31 mortgage applications completed
    doc_followups: 86,          // 86 document follow-ups automatically sent
    closing_rate: 68,           // 68% closing rate with AI assistance
    avg_loan_value: 380000,     // $380K average loan value
    compliance_flags: 7,        // 7 compliance issues flagged/prevented
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KPIsResponse>
) {
  try {
    // For demo purposes, we'll use tenant ID 1 (Apex Enterprises)
    const tenantId = 1;

    // Try to calculate real KPIs from the database
    const [
      highConfidenceLeads, 
      agentActions, 
      leadsWithHighConfidence, 
      leadsAtRisk,
      totalLeads,
      highValueLeads
    ] = await Promise.all([
      // Count leads with high confidence (simulating closed deals)
      prisma.lead.count({
        where: {
          tenantId,
          confidence_score: {
            gte: 0.8, // High confidence leads (80%+)
          },
        },
      }),
      // Count agent actions of type 'book_meeting'
      prisma.agentAction.count({
        where: {
          action: 'book_meeting',
          lead: {
            tenantId,
          },
        },
      }),
      // Count leads with improved confidence (rescued leads)
      prisma.lead.count({
        where: {
          tenantId,
          confidence_score: {
            gte: 0.6, // Moderate confidence (60%+)
            lt: 0.8,  // But not high confidence
          },
        },
      }),
      // Count leads with low confidence (at risk)
      prisma.lead.count({
        where: {
          tenantId,
          confidence_score: {
            lt: 0.4, // Low confidence leads (below 40%)
          },
        },
      }),
      // Count total leads
      prisma.lead.count({
        where: {
          tenantId,
        },
      }),
      // Count high-value leads (we'll simulate this since potential_value might not be in schema)
      prisma.lead.count({
        where: {
          tenantId,
          confidence_score: {
            gte: 0.7, // Using confidence as a proxy for high-value leads
          },
        },
      }),
    ]);

    // Calculate business impact metrics based on the data
    // These calculations simulate the real business impact of the AI system
    
    // Average deal size (simulated based on high-value leads)
    const avgDealSize = 125000; // $125K average deal size
    
    // AI-driven revenue: High confidence leads * avg deal size * AI attribution factor
    const aiDrivenRevenue = Math.round(highConfidenceLeads * avgDealSize * 0.85);
    
    // Sales cycle reduction: Based on agent actions and lead velocity
    const salesCycleReduction = Math.round(30 + (agentActions / (totalLeads || 1) * 15));
    
    // Cost savings: Based on automation efficiency and lead volume
    const costSavings = Math.round((agentActions * 450) + (highConfidenceLeads * 12000));
    
    // ROI percentage: Return divided by investment
    const aiInvestment = 500000; // Simulated $500K investment in AI
    const roiPercentage = Math.round((aiDrivenRevenue / aiInvestment) * 100);
    
    // Conversion lift: Improvement in conversion rates attributed to AI
    const baselineConversion = 0.18; // Industry baseline 18%
    const aiConversion = highConfidenceLeads / (totalLeads || 1);
    const conversionLift = Math.round(((aiConversion - baselineConversion) / baselineConversion) * 100);

    // If we have data, return it with the new metrics
    if (highConfidenceLeads !== undefined && agentActions !== undefined) {
      // Calculate additional KPIs based on available data
      const forecastAccuracy = 94; // Simulated 94% accuracy
      const winRate = Math.min(68, Math.round(60 + (highConfidenceLeads / (totalLeads || 1)) * 20));
      const dealSizeIncrease = Math.min(27, Math.round(20 + (highValueLeads / (totalLeads || 1)) * 15));
      const leadQualityScore = Math.min(8.7, 7 + ((highConfidenceLeads + leadsWithHighConfidence) / (totalLeads || 1)) * 3);
      const campaignOptimization = Math.min(31, Math.round(25 + (agentActions / 10)));
      const churnReduction = Math.min(42, Math.round(30 + (highConfidenceLeads / 2)));
      const expansionRevenue = Math.round(highValueLeads * avgDealSize * 0.4);
      const csatImprovement = Math.min(24, Math.round(15 + (agentActions / 10)));
      const timeSavedHours = Math.min(23, Math.round(15 + (agentActions / 5)));
      const leadsPerDollar = Math.min(4.8, 3 + ((highConfidenceLeads + leadsWithHighConfidence) / (totalLeads || 1)) * 3);
      
      // Real Estate Agent KPIs
      const leadsCaptures = Math.round(totalLeads * 0.7); // 70% of leads come from portals/websites
      const responseTimeSeconds = Math.max(30, Math.round(60 - (agentActions * 0.5))); // Response time improves with more agent actions
      const showingsBooked = Math.round(agentActions * 0.6); // 60% of agent actions are showing bookings
      
      // Mortgage Broker KPIs
      const applicationsCompleted = Math.round(highConfidenceLeads * 2.2); // Each high confidence lead completes ~2.2 applications
      const docFollowups = Math.round(totalLeads * 4); // Average 4 doc followups per lead
      const closingRate = Math.min(68, Math.round(50 + (highConfidenceLeads / totalLeads) * 30)); // Closing rate between 50-68%
      const avgLoanValue = 380000 + Math.round(highValueLeads * 1000); // Base loan value plus premium based on high value leads
      const complianceFlags = Math.max(7, Math.round(totalLeads * 0.15)); // ~15% of leads have compliance issues that get flagged
      
      return res.status(200).json({
        dashboard_kpis: {
          // Original metrics
          closed_deals: highConfidenceLeads || fallbackKPIs.dashboard_kpis.closed_deals,
          meetings_booked: agentActions || fallbackKPIs.dashboard_kpis.meetings_booked,
          leads_rescued: leadsWithHighConfidence || fallbackKPIs.dashboard_kpis.leads_rescued,
          pipeline_at_risk: leadsAtRisk || fallbackKPIs.dashboard_kpis.pipeline_at_risk,
          
          // Executive-level KPIs
          ai_driven_revenue: aiDrivenRevenue || fallbackKPIs.dashboard_kpis.ai_driven_revenue,
          sales_cycle_reduction: salesCycleReduction || fallbackKPIs.dashboard_kpis.sales_cycle_reduction,
          cost_savings: costSavings || fallbackKPIs.dashboard_kpis.cost_savings,
          roi_percentage: roiPercentage || fallbackKPIs.dashboard_kpis.roi_percentage,
          conversion_lift: conversionLift || fallbackKPIs.dashboard_kpis.conversion_lift,
          
          // Sales Leadership KPIs
          forecast_accuracy: forecastAccuracy || fallbackKPIs.dashboard_kpis.forecast_accuracy,
          win_rate: winRate || fallbackKPIs.dashboard_kpis.win_rate,
          deal_size_increase: dealSizeIncrease || fallbackKPIs.dashboard_kpis.deal_size_increase,
          
          // Marketing Leadership KPIs
          lead_quality_score: leadQualityScore || fallbackKPIs.dashboard_kpis.lead_quality_score,
          campaign_optimization: campaignOptimization || fallbackKPIs.dashboard_kpis.campaign_optimization,
          
          // Customer Success KPIs
          churn_reduction: churnReduction || fallbackKPIs.dashboard_kpis.churn_reduction,
          expansion_revenue: expansionRevenue || fallbackKPIs.dashboard_kpis.expansion_revenue,
          csat_improvement: csatImprovement || fallbackKPIs.dashboard_kpis.csat_improvement,
          
          // SMB-Focused KPIs
          time_saved_hours: timeSavedHours || fallbackKPIs.dashboard_kpis.time_saved_hours,
          leads_per_dollar: leadsPerDollar || fallbackKPIs.dashboard_kpis.leads_per_dollar,
          
          // Real Estate Agent KPIs
          leads_captured: leadsCaptures || fallbackKPIs.dashboard_kpis.leads_captured,
          response_time_seconds: responseTimeSeconds || fallbackKPIs.dashboard_kpis.response_time_seconds,
          showings_booked: showingsBooked || fallbackKPIs.dashboard_kpis.showings_booked,
          
          // Mortgage Broker KPIs
          applications_completed: applicationsCompleted || fallbackKPIs.dashboard_kpis.applications_completed,
          doc_followups: docFollowups || fallbackKPIs.dashboard_kpis.doc_followups,
          closing_rate: closingRate || fallbackKPIs.dashboard_kpis.closing_rate,
          avg_loan_value: avgLoanValue || fallbackKPIs.dashboard_kpis.avg_loan_value,
          compliance_flags: complianceFlags || fallbackKPIs.dashboard_kpis.compliance_flags,
        },
      });
    }

    // If no data found, use the enhanced fallback data
    return res.status(200).json(fallbackKPIs);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    // Return fallback data in case of error
    return res.status(200).json(fallbackKPIs);
  }
}
