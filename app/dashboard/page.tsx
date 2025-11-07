"use client";
import { useEffect, useState } from "react";
import ExecutiveHeader from "./components/ExecutiveHeader";
import SegmentedToggle from "./components/SegmentedToggle";
import ExecutiveView from "./views/ExecutiveView";
import SalesView from "./views/SalesView";
import MarketingView from "./views/MarketingView";
import OpsView from "./views/OpsView";
import SupportView from "./views/SupportView";
import { assertViewPayload } from "@/lib/intelligence/guards";

const tabs = [
  { id:"exec", label:"Executive" },
  { id:"sales", label:"Sales" },
  { id:"marketing", label:"Marketing" },
  { id:"ops", label:"Ops & IT" },
  { id:"support", label:"Support" },
];

const REFRESH_INTERVAL = 15000; // 15 seconds

export default function DashboardPage() {
  const [tab, setTab] = useState("exec");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/dashboard/kpis");
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const payload = await response.json();
      const safe = assertViewPayload(payload);
      setData(safe);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("[Dashboard] API error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <ExecutiveHeader />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-100">Intelligence Dashboard</h2>
        <SegmentedToggle items={tabs} value={tab} onChange={setTab}/>
      </div>

      {loading && (
        <div className="glass p-10 text-slate-300 text-center">
          <div className="animate-pulse">Loading intelligence…</div>
        </div>
      )}

      {error && !loading && (
        <div className="glass p-10 text-center">
          <div className="text-red-400 mb-2">⚠️ Failed to load dashboard data</div>
          <div className="text-slate-400 text-sm">{error}</div>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && data && (
        <div className="animate-fadeIn">
          {tab==="exec"      && <ExecutiveView data={data} />}
          {tab==="sales"     && <SalesView data={data} />}
          {tab==="marketing" && <MarketingView data={data} />}
          {tab==="ops"       && <OpsView data={data} />}
          {tab==="support"   && <SupportView data={data} />}
        </div>
      )}
    </div>
  );
}
