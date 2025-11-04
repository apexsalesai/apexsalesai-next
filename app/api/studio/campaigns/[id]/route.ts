/**
 * GET /api/studio/campaigns/:id
 * Returns campaign with tasks and assets
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/telemetry-phase2';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            agentType: true,
            status: true,
            tokensIn: true,
            tokensOut: true,
            latencyMs: true,
            model: true,
            costUsd: true,
            createdAt: true,
            startedAt: true,
            completedAt: true,
            error: true,
          },
        },
        assets: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            type: true,
            title: true,
            body: true,
            version: true,
            metadata: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: campaign });
  } catch (error: any) {
    console.error('[API] GET /api/studio/campaigns/:id error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}
