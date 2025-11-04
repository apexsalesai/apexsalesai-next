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

export default function DashboardPage() {
  const [tab, setTab] = useState("exec");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    fetch("/api/dashboard/kpis").then(r=>r.json()).then(payload=>{
      const safe = assertViewPayload(payload);
      if(mounted){ setData(safe); setLoading(false); }
    }).catch(err => {
      console.error("Dashboard API error:", err);
      if(mounted) setLoading(false);
    });
    return ()=>{ mounted=false; };
  },[]);

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
      
      {!loading && data && (
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
