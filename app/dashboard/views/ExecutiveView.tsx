"use client";
import Section from "../components/Section";
import KpiGrid from "../components/KpiGrid";

export default function ExecutiveView({ data }: { data: any }) {
  return (
    <div className="space-y-8">
      <Section title="Enterprise Health">
        <KpiGrid exec={data.exec}/>
      </Section>
    </div>
  );
}
