"use client";
import Section from "../components/Section";
import StatCard from "../components/StatCard";

export default function SupportView({ data }: { data: any }) {
  const k = data.support;
  return (
    <div className="space-y-8">
      <Section title="Customer Experience">
        <StatCard kpi={k.csat} />
        <StatCard kpi={k.firstResponse} />
        <StatCard kpi={k.backlog} />
      </Section>
      <p className="text-sm text-slate-400">
        💬 Apex Insight: CSAT remains above 4.5 with first-response time improving 8%. Backlog reduction shows sustained team execution excellence.
      </p>
    </div>
  );
}
