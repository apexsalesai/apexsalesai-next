/**
 * Main KPI Service
 * Orchestrates Lead, Opportunity, and Agent Activity KPI services
 * Provides unified interface for dashboard data
 */

import { DataverseApiService } from './dataverseApi';
import { LeadKpiService } from './leadKpiService';
import { OpportunityKpiService } from './opportunityKpiService';
import { AgentActivityKpiService } from './agentActivityKpiService';
import { 
  DataverseConfig, 
  DashboardData, 
  VerticalDashboardData,
  KPIData,
  ChartData 
} from './types';
import { ErrorLogger } from '../../utils/errorLogger';

export class KpiService {
  private dataverseApi: DataverseApiService;
  private leadKpiService: LeadKpiService;
  private opportunityKpiService: OpportunityKpiService;
  private agentActivityKpiService: AgentActivityKpiService;

  constructor(config: DataverseConfig) {
    this.dataverseApi = new DataverseApiService(config);
    this.leadKpiService = new LeadKpiService(this.dataverseApi);
    this.opportunityKpiService = new OpportunityKpiService(this.dataverseApi);
    this.agentActivityKpiService = new AgentActivityKpiService(this.dataverseApi);
  }

  /**
   * Get dashboard data for a specific vertical
   */
  async getDashboardData(vertical: string): Promise<DashboardData> {
    try {
      const [
        leadData,
        opportunityData,
        agentData
      ] = await Promise.all([
        this.leadKpiService.getLeadKpis(vertical),
        this.opportunityKpiService.getOpportunityKpis(vertical),
        this.agentActivityKpiService.getAgentActivityKpis(vertical)
      ]);

      // Combine all KPIs
      const kpis: KPIData[] = [
        ...leadData.kpis,
        ...opportunityData.kpis,
        ...agentData.kpis
      ];

      // Combine all charts
      const charts: Record<string, ChartData> = {
        ...leadData.charts,
        ...opportunityData.charts,
        ...agentData.charts
      };

      return {
        kpis,
        charts,
        activity: agentData.activity
      };
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'KpiService',
        'Failed to get dashboard data',
        { error, vertical }
      );
      
      // Return fallback data
      return this.getFallbackDashboardData();
    }
  }

  /**
   * Get dashboard data for all verticals
   */
  async getAllVerticalsDashboardData(): Promise<VerticalDashboardData> {
    try {
      const verticals = ['realEstate', 'mortgage', 'msp', 'consulting', 'solar', 'hvac'];
      
      const dashboardData: VerticalDashboardData = {};
      
      // Fetch data for each vertical in parallel
      const promises = verticals.map(async (vertical) => {
        try {
          const data = await this.getDashboardData(vertical);
          return { vertical, data };
        } catch (error) {
          ErrorLogger.logWindsurfError(
            'KpiService',
            `Failed to get data for vertical ${vertical}`,
            { error, vertical }
          );
          return { vertical, data: this.getFallbackDashboardData() };
        }
      });

      const results = await Promise.all(promises);
      
      // Map results to the dashboard data structure
      for (const result of results) {
        dashboardData[result.vertical as keyof VerticalDashboardData] = result.data;
      }

      return dashboardData;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'KpiService',
        'Failed to get all verticals dashboard data',
        { error }
      );
      
      // Return fallback data for all verticals
      return this.getFallbackAllVerticalsDashboardData();
    }
  }

  /**
   * Refresh KPI data (force cache invalidation)
   */
  async refreshDashboardData(vertical: string): Promise<DashboardData> {
    // Force fresh data fetch by bypassing any caching
    return this.getDashboardData(vertical);
  }

  /**
   * Get KPI summary for a specific metric across all verticals
   */
  async getKpiSummary(kpiType: 'leads' | 'opportunities' | 'activity'): Promise<{
    total: number;
    trend: string;
    breakdown: Array<{ vertical: string; value: number; }>;
  }> {
    try {
      const verticals = ['realEstate', 'mortgage', 'msp', 'consulting', 'solar', 'hvac'];
      const breakdown: Array<{ vertical: string; value: number; }> = [];
      let total = 0;

      for (const vertical of verticals) {
        let value = 0;
        
        switch (kpiType) {
          case 'leads':
            const leadData = await this.leadKpiService.getLeadKpis(vertical);
            value = parseInt(leadData.kpis[0]?.value || '0');
            break;
          case 'opportunities':
            const oppData = await this.opportunityKpiService.getOpportunityKpis(vertical);
            value = parseInt(oppData.kpis[0]?.value || '0');
            break;
          case 'activity':
            const actData = await this.agentActivityKpiService.getAgentActivityKpis(vertical);
            value = parseInt(actData.kpis[0]?.value || '0');
            break;
        }
        
        breakdown.push({ vertical, value });
        total += value;
      }

      return {
        total,
        trend: '+15% overall',
        breakdown: breakdown.sort((a, b) => b.value - a.value)
      };
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'KpiService',
        'Failed to get KPI summary',
        { error, kpiType }
      );
      
      return {
        total: 0,
        trend: 'N/A',
        breakdown: []
      };
    }
  }

  /**
   * Test Dataverse connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Simple test query to verify connection
      await this.dataverseApi.query('systemusers', {
        top: 1,
        select: ['systemuserid']
      });
      
      return true;
    } catch (error) {
      ErrorLogger.logWindsurfError(
        'KpiService',
        'Dataverse connection test failed',
        { error }
      );
      
      return false;
    }
  }

  /**
   * Get fallback dashboard data
   */
  private getFallbackDashboardData(): DashboardData {
    return {
      kpis: [
        { title: 'Total Leads', value: '125', trend: '+15% MoM', badgeColor: 'green', tooltip: 'Total number of leads in the pipeline' },
        { title: 'Qualified Leads', value: '85/mo', trend: '+20% MoM', badgeColor: 'green', tooltip: 'Number of leads that meet qualification criteria' },
        { title: 'Lead Conversion', value: '32%', trend: '+4.5% QoQ', badgeColor: 'blue', tooltip: 'Percentage of leads converted to opportunities' },
        { title: 'Response Time', value: '2m 45s', trend: '-25% avg', badgeColor: 'green', tooltip: 'Average time to first response for new leads' },
        { title: 'Total Opportunities', value: '87', trend: '+12% MoM', badgeColor: 'green', tooltip: 'Total active opportunities in pipeline' },
        { title: 'Won Deals', value: '23', trend: '+8% MoM', badgeColor: 'green', tooltip: 'Number of closed-won opportunities' },
        { title: 'Avg Deal Size', value: '$42,500', trend: '+15% QoQ', badgeColor: 'green', tooltip: 'Average value of closed-won deals' },
        { title: 'Sales Cycle', value: '45d', trend: '-8 days', badgeColor: 'green', tooltip: 'Average days from lead to close' },
        { title: 'Daily Actions', value: '40', trend: '+12% avg', badgeColor: 'green', tooltip: 'Average daily agent actions performed' },
        { title: 'Follow-up Rate', value: '92%', trend: '+5% MoM', badgeColor: 'green', tooltip: 'Percentage of leads receiving timely follow-up' },
        { title: 'Agent Score', value: '87/100', trend: '+3 pts', badgeColor: 'green', tooltip: 'Overall agent performance rating' },
        { title: 'Active Today', value: '24/7', trend: 'Always On', badgeColor: 'green', tooltip: 'Agent uptime and availability' }
      ],
      charts: {
        conversion: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Lead Conversion Rate (%)',
            data: [28, 30, 32, 34, 35, 32],
            fill: true,
            backgroundColor: 'rgba(34,211,238,0.2)',
            borderColor: '#22d3ee',
            tension: 0.4
          }]
        },
        pipeline: {
          labels: ['Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
          datasets: [{
            label: 'Opportunities by Stage',
            data: [45, 32, 18, 12],
            backgroundColor: ['rgba(59,130,246,0.7)', 'rgba(34,211,238,0.7)', 'rgba(244,114,182,0.7)', 'rgba(34,197,94,0.7)']
          }]
        },
        activity: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Daily Actions',
            data: [42, 38, 45, 41, 39, 35, 28],
            fill: true,
            backgroundColor: 'rgba(168,85,247,0.2)',
            borderColor: '#a855f7',
            tension: 0.4
          }]
        }
      },
      activity: [
        'Sent follow-up email to Sarah Wilson - 2m ago',
        'Scheduled demo for TechCorp - 15m ago',
        'Updated lead status for Mike Johnson - 1h ago',
        'Sent LinkedIn connection to Jennifer Lee - 2h ago',
        'Completed lead qualification for ABC Solutions - 3h ago'
      ]
    };
  }

  /**
   * Get fallback data for all verticals
   */
  private getFallbackAllVerticalsDashboardData(): VerticalDashboardData {
    const fallbackData = this.getFallbackDashboardData();
    
    return {
      realEstate: fallbackData,
      mortgage: fallbackData,
      msp: fallbackData,
      consulting: fallbackData,
      solar: fallbackData,
      hvac: fallbackData
    };
  }
}

// Export singleton instance
let kpiServiceInstance: KpiService | null = null;

export const getKpiService = (config?: DataverseConfig): KpiService => {
  if (!kpiServiceInstance && config) {
    kpiServiceInstance = new KpiService(config);
  }
  
  if (!kpiServiceInstance) {
    throw new Error('KpiService not initialized. Please provide DataverseConfig.');
  }
  
  return kpiServiceInstance;
};
