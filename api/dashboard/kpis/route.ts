/**
 * Dashboard KPI Bundle API (Apex Standard)
 * 
 * GET /api/dashboard/kpis
 * 
 * Returns comprehensive KPI bundle for all dashboard views.
 * Currently using investor-demo grade mock data.
 * Will integrate with Intelligence Core in Phase 5.1.
 * 
 * @see docs/PHASE5_IMPLEMENTATION_PLAN.md
 * @see lib/intelligence/types.ts
 */

import { NextResponse } from "next/server";
import { ViewPayloadSchema } from "@/lib/intelligence/types";

export async function GET() {
  // Synthetic but realistic deltas + variance (investor-demo grade)
  const payload = {
    exec: {
      revenue:   { label:"ARR", value: 2480000, deltaPct: 6.4, trend: [2.0,2.2,2.1,2.3,2.35,2.4,2.48], target: 3000000, unit:"$", intent:"good" },
      pipeline:  { label:"Pipeline", value: 6800000, deltaPct: 8.1, trend:[5.4,5.6,5.9,6.1,6.3,6.6,6.8], target: 7000000, unit:"$", intent:"good" },
      winRate:   { label:"Win Rate", value: 28.4, deltaPct: 1.2, trend:[24,25,26,27,27.5,28,28.4], target: 30, unit:"%", intent:"good" },
      cycleTime: { label:"Cycle Time", value: 31, deltaPct: -3.0, trend:[38,36,35,34,33,32,31], target: 28, unit:"hrs", intent:"good" },
      costs:     { label:"Cost / $1 ARR", value: 0.42, deltaPct: -2.1, trend:[0.51,0.5,0.49,0.47,0.46,0.44,0.42], target: 0.40, unit:"$", intent:"good" },
      nrr:       { label:"NRR", value: 118, deltaPct: 2.0, trend:[111,112,113,114,115,116,118], target: 120, unit:"%", intent:"good" }
    },
    sales: {
      quotaAttainment:{ label:"Quota Attain.", value: 92, deltaPct: 4.0, trend:[76,80,84,86,89,91,92], target:100, unit:"%", intent:"good" },
      meetings:{ label:"Meetings", value: 312, deltaPct: 7.2, trend:[210,230,250,265,280,295,312], target:320, unit:"num", intent:"good" },
      aov:{ label:"AOV", value: 14800, deltaPct: 2.5, trend:[12.2,12.8,13.1,13.9,14.2,14.5,14.8], target: 15000, unit:"$", intent:"good" },
      coverage:{ label:"Coverage", value: 3.4, deltaPct: 0.3, trend:[2.6,2.8,3.0,3.1,3.2,3.3,3.4], target: 3.5, unit:"num", intent:"good" }
    },
    marketing: {
      mql:{ label:"MQLs", value: 1840, deltaPct: 9.1, trend:[1100,1200,1350,1500,1600,1720,1840], target: 2000, unit:"num", intent:"good" },
      cpl:{ label:"CPL", value: 41, deltaPct: -6.0, trend:[58,55,51,48,47,44,41], target: 40, unit:"$", intent:"good" },
      webVisitors:{ label:"Site Visitors", value: 124000, deltaPct: 5.2, trend:[85000,90000,95000,100000,110000,118000,124000], target: 130000, unit:"num", intent:"good" },
      convRate:{ label:"Conv Rate", value: 2.8, deltaPct: 0.3, trend:[2.1,2.2,2.3,2.4,2.5,2.6,2.8], target: 3.0, unit:"%", intent:"good" }
    },
    ops: {
      uptime:{ label:"Uptime", value: 99.94, deltaPct: 0.02, trend:[99.85,99.9,99.91,99.92,99.93,99.94,99.94], target: 99.95, unit:"%", intent:"good" },
      incidents:{ label:"Incidents", value: 2, deltaPct: -33.0, trend:[6,5,4,4,3,3,2], target: 0, unit:"num", intent:"good" },
      mttr:{ label:"MTTR (hrs)", value: 1.6, deltaPct: -12.0, trend:[3.2,2.8,2.6,2.3,2.1,1.9,1.6], target: 1.2, unit:"hrs", intent:"good" }
    },
    support: {
      csat:{ label:"CSAT", value: 4.6, deltaPct: 0.1, trend:[4.1,4.2,4.3,4.4,4.5,4.6,4.6], target: 4.8, unit:"num", intent:"good" },
      firstResponse:{ label:"1st Resp (min)", value: 7.2, deltaPct: -8.0, trend:[12,10.5,9.8,9.1,8.5,7.8,7.2], target: 5, unit:"hrs", intent:"good" },
      backlog:{ label:"Backlog", value: 19, deltaPct: -14.0, trend:[42,38,34,30,26,23,19], target: 10, unit:"num", intent:"good" }
    },
    meta: { lastUpdatedIso: new Date().toISOString(), sample: true }
  };

  const safe = ViewPayloadSchema.parse(payload);
  return NextResponse.json(safe, { 
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    }
  });
}
