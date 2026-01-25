'use client';

import { formatDistanceToNow } from 'date-fns';

interface AgentTask {
  id: string;
  agentType: string;
  status: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  model: string;
  costUsd: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

interface AgentTimelineProps {
  tasks: AgentTask[];
}

export function AgentTimeline({ tasks }: AgentTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'running':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatCost = (costUsd: string) => {
    return `$${Number(costUsd).toFixed(4)}`;
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden" data-testid="agent-timeline">
      <div className="px-6 py-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">Agent Timeline</h3>
        <p className="text-sm text-slate-400 mt-1">Real-time agent execution telemetry</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-3">Agent</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Tokens In</th>
              <th className="px-6 py-3">Tokens Out</th>
              <th className="px-6 py-3">Cost</th>
              <th className="px-6 py-3">Model</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {tasks.map((task) => (
              <tr key={task.id} data-testid="agent-row" className="hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-white font-medium capitalize">{task.agentType}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">{formatDuration(task.latencyMs)}</td>
                <td className="px-6 py-4 text-slate-300">{task.tokensIn.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-300">{task.tokensOut.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-300">{formatCost(task.costUsd)}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{task.model}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="px-6 py-12 text-center text-slate-400">
          No agent tasks yet. Click "Run Agents" to start.
        </div>
      )}
    </div>
  );
}
