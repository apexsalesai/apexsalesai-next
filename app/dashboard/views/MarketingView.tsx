"use client";
import Section from "../components/Section";
import StatCard from "../components/StatCard";

export default function MarketingView({ data }: { data: any }) {
  const k = data.marketing;
  return (
    <div className="space-y-8">
      <Section title="Marketing Efficiency">
        <StatCard kpi={k.mql} />
        <StatCard kpi={k.cpl} />
        <StatCard kpi={k.webVisitors} />
        <StatCard kpi={k.convRate} />
      </Section>
      <p className="text-sm text-slate-400">
        📈 Apex Insight: MQL volume and conversion are trending up. CPL efficiency has improved 6%, reinforcing campaign optimization success.
      </p>
    </div>
  );
}
