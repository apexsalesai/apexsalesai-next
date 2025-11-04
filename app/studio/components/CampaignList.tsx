'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  _count: {
    assets: number;
    tasks: number;
  };
}

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'running':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'draft':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          data-testid="campaign-card"
          onClick={() => router.push(`/studio/${campaign.id}`)}
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {campaign.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                campaign.status
              )}`}
            >
              {campaign.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex justify-between">
              <span>Assets:</span>
              <span className="text-white font-medium">{campaign._count.assets}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasks:</span>
              <span className="text-white font-medium">{campaign._count.tasks}</span>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="text-white font-medium">
                {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
