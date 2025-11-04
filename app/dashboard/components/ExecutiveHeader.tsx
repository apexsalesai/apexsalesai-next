"use client";
import { Rocket, Gauge, Activity } from "lucide-react";
import { LastUpdated } from "./LastUpdated";

export default function ExecutiveHeader({ title="Apex Intelligence", subtitle="Executive Overview" }:{
  title?: string; subtitle?: string;
}) {
  return (
    <div className="glass gradient-border relative overflow-hidden p-6 md:p-8">
      <div className="flex items-center gap-3 text-cyan-300">
        <Rocket className="h-6 w-6" />
        <span className="uppercase tracking-widest text-xs">Phase 5 Alpha</span>
      </div>
      <div className="mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold">{title}</h1>
          <p className="text-slate-300">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Gauge className="h-5 w-5" /> <span>Real-time Telemetry</span>
          </div>
          <div className="hidden md:block text-slate-400">•</div>
          <div className="flex items-center gap-2 text-slate-300">
            <Activity className="h-5 w-5" /> <span>Adaptive Insights</span>
          </div>
          <LastUpdated />
        </div>
      </div>
    </div>
  );
}
