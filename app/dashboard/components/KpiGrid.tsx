"use client";
import StatCard from "./StatCard";

export default function KpiGrid({ exec }:{ exec: any }) {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <StatCard kpi={exec.revenue} />
      <StatCard kpi={exec.pipeline} />
      <StatCard kpi={exec.winRate} />
      <StatCard kpi={exec.cycleTime} />
      <StatCard kpi={exec.costs} />
      <StatCard kpi={exec.nrr} />
    </div>
  );
}
