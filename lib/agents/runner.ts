/**
 * Agent Runner - Orchestrates multi-agent execution with telemetry
 */

import { prisma, audit, metric, logContentGeneration, wordCount, charCount, readingTime } from '@lib/telemetry-phase2';
import type { AgentContext, Agent, AgentName } from './registry';
import { strategyAgent } from './strategyAgent';
import { copyAgent } from './copyAgent';
import { visualAgent } from './visualAgent';
import { videoScriptAgent } from './videoScriptAgent';
import { personalizeAgent } from './personalizeAgent';

const REGISTRY: Record<AgentName, Agent> = {
  strategy: strategyAgent,
  copy: copyAgent,
  visual: visualAgent,
  video: videoScriptAgent,
  personalize: personalizeAgent,
};

export interface RunAgentsResult {
  tasks: Array<{
    id: string;
    agent: string;
    status: string;
    latencyMs: number;
    tokensIn: number;
    tokensOut: number;
  }>;
  assetsCreated: string[];
}

/**
 * Run agent chain for a campaign
 */
export async function runAgents(
  campaignId: string,
  order: AgentName[]
): Promise<RunAgentsResult> {
  console.log(`[AgentRunner] Starting agent chain for campaign ${campaignId}`);
  
  // Fetch campaign
  const campaign = await prisma.campaign.findUniqueOrThrow({
    where: { id: campaignId },
  });

  // Build context
  const ctx: AgentContext = {
    campaign: {
      id: campaign.id,
      title: campaign.title,
      objective: campaign.objective,
      audience: campaign.audience,
      brandVoice: campaign.brandVoice,
      channels: campaign.channels,
      targetLength: campaign.targetLength,
    },
  };

  const createdAssets: string[] = [];
  const taskResults: any[] = [];

  // Update campaign status
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'running' },
  });

  // Execute agents in sequence
  for (const agentName of order) {
    const agent = REGISTRY[agentName];
    if (!agent) {
      console.warn(`[AgentRunner] Agent ${agentName} not found in registry`);
      continue;
    }

    console.log(`[AgentRunner] Executing ${agentName} agent...`);

    // Create task record
    const task = await prisma.agentTask.create({
      data: {
        campaignId,
        agentType: agentName,
        status: 'running',
        input: ctx as any,
        startedAt: new Date(),
      },
    });

    try {
      // Run agent
      const result = await agent.run(ctx);

      // Save assets
      if (result.assets && result.assets.length > 0) {
        for (const assetData of result.assets) {
          const asset = await prisma.contentAsset.create({
            data: {
              campaignId,
              type: assetData.type,
              title: assetData.title,
              body: assetData.body,
              metadata: {
                ...assetData.metadata,
                wordCount: wordCount(assetData.body),
                charCount: charCount(assetData.body),
                readingTime: readingTime(assetData.body),
              },
            },
          });

          createdAssets.push(asset.id);

          // Log asset creation
          await audit('system', 'asset.create', { type: 'asset', id: asset.id }, {
            agent: agentName,
            type: assetData.type,
            campaignId,
          });

          // Log content generation metrics
          await logContentGeneration({
            campaignId,
            type: assetData.type,
            wordCount: wordCount(assetData.body),
            charCount: charCount(assetData.body),
            tokensIn: result.tokensIn,
            tokensOut: result.tokensOut,
            latencyMs: result.ms,
            model: 'gpt-4o-mini',
          });
        }
      }

      // Update task as completed
      await prisma.agentTask.update({
        where: { id: task.id },
        data: {
          status: 'done',
          output: result as any,
          costTokensIn: result.tokensIn,
          costTokensOut: result.tokensOut,
          latencyMs: result.ms,
          completedAt: new Date(),
        },
      });

      // Log metrics
      await metric('agent.latency', result.ms, { agent: agentName, campaignId }, 'ms');
      await metric('agent.tokens.in', result.tokensIn, { agent: agentName, campaignId }, 'tokens');
      await metric('agent.tokens.out', result.tokensOut, { agent: agentName, campaignId }, 'tokens');

      // Log audit
      await audit('system', 'agent.run', { type: 'agentTask', id: task.id }, {
        agent: agentName,
        ms: result.ms,
        assetsCreated: result.assets?.length || 0,
      });

      taskResults.push({
        id: task.id,
        agent: agentName,
        status: 'done',
        latencyMs: result.ms,
        tokensIn: result.tokensIn,
        tokensOut: result.tokensOut,
      });

      console.log(`[AgentRunner] ✓ ${agentName} completed in ${result.ms}ms`);
    } catch (error: any) {
      console.error(`[AgentRunner] ✗ ${agentName} failed:`, error);

      // Update task as error
      await prisma.agentTask.update({
        where: { id: task.id },
        data: {
          status: 'error',
          error: error.message || String(error),
          completedAt: new Date(),
        },
      });

      // Log error
      await audit('system', 'agent.error', { type: 'agentTask', id: task.id }, {
        agent: agentName,
        error: error.message || String(error),
      });

      await metric('agent.error', 1, { agent: agentName, campaignId, error: error.message });

      taskResults.push({
        id: task.id,
        agent: agentName,
        status: 'error',
        latencyMs: 0,
        tokensIn: 0,
        tokensOut: 0,
      });

      // Continue with next agent instead of failing entire chain
      continue;
    }
  }

  // Update campaign as completed
  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status: 'completed' },
  });

  // Final audit log
  await audit('system', 'campaign.completed', { type: 'campaign', id: campaignId }, {
    assetsCreated: createdAssets.length,
    tasksCompleted: taskResults.filter(t => t.status === 'done').length,
    tasksErrored: taskResults.filter(t => t.status === 'error').length,
  });

  console.log(`[AgentRunner] Campaign ${campaignId} completed. Created ${createdAssets.length} assets.`);

  return {
    tasks: taskResults,
    assetsCreated: createdAssets,
  };
}

/**
 * Get agent execution status for a campaign
 */
export async function getAgentStatus(campaignId: string) {
  const tasks = await prisma.agentTask.findMany({
    where: { campaignId },
    orderBy: { createdAt: 'asc' },
  });

  return tasks.map(task => ({
    id: task.id,
    agent: task.agentType,
    status: task.status,
    startedAt: task.startedAt,
    completedAt: task.completedAt,
    latencyMs: task.latencyMs,
    tokensIn: task.costTokensIn,
    tokensOut: task.costTokensOut,
    error: task.error,
  }));
}
