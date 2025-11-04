"use client";
import Section from "../components/Section";
import StatCard from "../components/StatCard";

export default function OpsView({ data }: { data: any }) {
  const k = data.ops;
  return (
    <div className="space-y-8">
      <Section title="Operations & IT Health">
        <StatCard kpi={k.uptime} />
        <StatCard kpi={k.incidents} />
        <StatCard kpi={k.mttr} />
      </Section>
      <p className="text-sm text-slate-400">
        ⚙️ Apex Insight: Operational resilience exceeds SLA. Incident frequency and MTTR continue to decline, driven by real-time telemetry alerts.
      </p>
    </div>
  );
}
