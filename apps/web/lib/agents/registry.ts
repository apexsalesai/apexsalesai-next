/**
 * Agent Registry - Type definitions and interfaces
 */

export type AgentName = 'strategy' | 'copy' | 'visual' | 'video' | 'personalize';

export interface AgentContext {
  campaign: {
    id: string;
    title: string;
    objective: string;
    audience: string;
    brandVoice: string;
    channels: string[];
    targetLength: string;
  };
}

export interface ContentAssetOutput {
  type: 'blog' | 'email' | 'social' | 'videoScript' | 'imagePrompt' | 'chat' | 'faq' | 'press' | 'ad' | 'community';
  title: string;
  body: string;
  metadata?: Record<string, any>;
}

export interface AgentOutput {
  assets?: ContentAssetOutput[];
}

export interface AgentRunResult extends AgentOutput {
  tokensIn: number;
  tokensOut: number;
  ms: number;
}

export interface Agent {
  name: AgentName;
  run: (ctx: AgentContext) => Promise<AgentRunResult>;
}

export interface AgentRegistry {
  [key: string]: Agent;
}
