/**
 * Agent Execution API
 * POST - Run agent chain for a campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireJson, audit } from '@lib/telemetry-phase2';
import { runAgents } from '@lib/agents/runner';
import type { AgentName } from '@lib/agents/registry';

export async function POST(request: NextRequest) {
  try {
    const body = await requireJson<{
      campaignId: string;
      agents?: AgentName[];
    }>(request);

    // Validate
    if (!body.campaignId) {
      return NextResponse.json(
        { error: 'campaignId is required' },
        { status: 422 }
      );
    }

    // Use default agent chain if not specified
    const defaultAgents: AgentName[] = ['strategy', 'copy', 'visual', 'video', 'personalize'];
    const agentsToRun = body.agents && body.agents.length > 0 ? body.agents : defaultAgents;

    // Validate agent names
    const validAgents: AgentName[] = ['strategy', 'copy', 'visual', 'video', 'personalize'];
    const invalidAgents = agentsToRun.filter(a => !validAgents.includes(a));
    
    if (invalidAgents.length > 0) {
      return NextResponse.json(
        { error: `Invalid agents: ${invalidAgents.join(', ')}` },
        { status: 422 }
      );
    }

    console.log(`[API] Running agents for campaign ${body.campaignId}:`, agentsToRun);

    // Execute agent chain
    const result = await runAgents(body.campaignId, agentsToRun);

    // Log execution
    await audit('system-user', 'agents.run', { type: 'campaign', id: body.campaignId }, {
      agents: body.agents,
      tasksCompleted: result.tasks.length,
      assetsCreated: result.assetsCreated.length,
    });

    return NextResponse.json({
      success: true,
      tasks: result.tasks,
      assetsCreated: result.assetsCreated,
    });
  } catch (error: any) {
    console.error('[API] POST /api/studio/agents/run error:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to run agents' },
      { status: 500 }
    );
  }
}
