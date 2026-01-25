/**
 * Phase 3: Metrics Panel Component
 * Displays real-time KPIs from Dataverse in Studio dashboard
 */

'use client';

import useSWR from 'swr';
import { TrendingUp, DollarSign, Clock, CheckCircle, FileText } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface MetricData {
  apex_cost_usd: number;
  apex_latency_p95_ms: number;
  apex_success_rate: number;
  apex_assets_generated: number;
  apex_tokens_in: number;
  apex_tokens_out: number;
}

export function MetricsPanel() {
  const { data, error, isLoading } = useSWR('/api/metrics/recent?limit=1', fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    revalidateOnFocus: true,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          Loading metrics from Dataverse...
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <div className="text-sm text-red-400">
          ⚠️ {data?.message || 'Metrics unavailable'}
        </div>
        {data?.error === 'Dataverse not configured' && (
          <div className="mt-2 text-xs text-slate-500">
            Configure Azure credentials to enable enterprise telemetry
          </div>
        )}
      </div>
    );
  }

  const metrics = data.metrics?.[0] as MetricData | undefined;

  if (!metrics) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <div className="text-sm text-slate-400">No metrics data available yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Campaign Metrics</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live from Dataverse
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard
          icon={<DollarSign className="h-5 w-5" />}
          title="Cost / Campaign"
          value={`$${Number(metrics.apex_cost_usd).toFixed(4)}`}
          color="text-green-400"
          bgColor="bg-green-500/10"
        />

        <MetricCard
          icon={<Clock className="h-5 w-5" />}
          title="P95 Latency"
          value={`${metrics.apex_latency_p95_ms} ms`}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />

        <MetricCard
          icon={<CheckCircle className="h-5 w-5" />}
          title="Success Rate"
          value={`${Number(metrics.apex_success_rate).toFixed(1)}%`}
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
        />

        <MetricCard
          icon={<FileText className="h-5 w-5" />}
          title="Assets / Run"
          value={`${metrics.apex_assets_generated}`}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
        />

        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Tokens (In/Out)"
          value={`${metrics.apex_tokens_in}/${metrics.apex_tokens_out}`}
          color="text-orange-400"
          bgColor="bg-orange-500/10"
        />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  bgColor: string;
}

function MetricCard({ icon, title, value, color, bgColor }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 transition-all hover:border-slate-600">
      <div className={`inline-flex rounded-lg p-2 ${bgColor} ${color} mb-3`}>
        {icon}
      </div>
      <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">{title}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
