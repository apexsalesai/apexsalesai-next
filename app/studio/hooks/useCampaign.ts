/**
 * Campaign data hook with polling for running tasks
 */

import useSWR from 'swr';
import { getJSON } from '@/lib/http';

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

interface ContentAsset {
  id: string;
  type: string;
  title: string;
  body: string;
  version: number;
  metadata: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Campaign {
  id: string;
  title: string;
  objective: string;
  audience: string;
  brandVoice: string;
  channels: string[];
  status: string;
  createdAt: string;
  tasks: AgentTask[];
  assets: ContentAsset[];
}

interface CampaignResponse {
  data: Campaign;
}

function hasRunning(tasks?: AgentTask[]) {
  return tasks?.some(t => t.status === 'queued' || t.status === 'running') ?? false;
}

export function useCampaign(campaignId: string) {
  const { data, error, isLoading, mutate } = useSWR<CampaignResponse>(
    `/api/studio/campaigns/${campaignId}`,
    (url) => getJSON<CampaignResponse>(url),
    { 
      refreshInterval: (latest) => hasRunning(latest?.data?.tasks) ? 3000 : 0,
      revalidateOnFocus: false,
    }
  );

  return { 
    campaign: data?.data,
    error, 
    isLoading, 
    mutate 
  };
}
