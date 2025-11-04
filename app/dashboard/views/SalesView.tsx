"use client";
import Section from "../components/Section";
import StatCard from "../components/StatCard";

export default function SalesView({ data }: { data: any }) {
  const k = data.sales;
  return (
    <div className="space-y-8">
      <Section title="Sales Performance">
        <StatCard kpi={k.quotaAttainment} />
        <StatCard kpi={k.meetings} />
        <StatCard kpi={k.aov} />
        <StatCard kpi={k.coverage} />
      </Section>
      <p className="text-sm text-slate-400">
        🚀 Apex Insight: Quota attainment continues to rise week-over-week, powered by optimized pipeline coverage and shorter cycles.
      </p>
    </div>
  );
}
