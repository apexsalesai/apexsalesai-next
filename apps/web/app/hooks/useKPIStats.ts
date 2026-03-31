import type { KPIsResponse } from '../../types/api';

// Static representative KPI data for the homepage dashboard demo.
// Replaces broken /api/kpis fetch (endpoint does not exist, returned 404).
const STATIC_KPI_DATA: KPIsResponse = {
  success: true,
  dashboard_kpis: {
    // Core metrics
    closed_deals: 12,
    meetings_booked: 34,
    leads_rescued: 18,
    pipeline_at_risk: 5,

    // Executive KPIs
    ai_driven_revenue: 284000,
    sales_cycle_reduction: 32,
    cost_savings: 47000,
    roi_percentage: 368,
    conversion_lift: 24,

    // Sales Leadership
    forecast_accuracy: 91,
    win_rate: 64,
    deal_size_increase: 18,

    // Marketing Leadership
    lead_quality_score: 8.4,
    campaign_optimization: 29,

    // Customer Success
    churn_reduction: 15,
    expansion_revenue: 62000,
    csat_improvement: 22,

    // SMB
    time_saved_hours: 24,
    leads_per_dollar: 3.2,

    // Real Estate Agent
    leads_captured: 42,
    response_time_seconds: 30,
    showings_booked: 28,

    // Mortgage Broker
    applications_completed: 31,
    doc_followups: 86,
    closing_rate: 68,
    avg_loan_value: 380000,
    compliance_flags: 7,
  },
};

export const useKPIStats = () => {
  return { data: STATIC_KPI_DATA, isLoading: false, error: null };
};
