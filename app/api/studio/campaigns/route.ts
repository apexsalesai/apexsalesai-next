/**
 * Campaign CRUD API
 * POST - Create campaign
 * GET - List campaigns
 * PATCH - Update campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, requireJson } from '@lib/telemetry-phase2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const where = status ? { status } : {};
    
    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            tasks: true,
            assets: true,
          },
        },
      },
    });
    
    return NextResponse.json({ campaigns, count: campaigns.length });
  } catch (error: any) {
    console.error('[API] GET /api/studio/campaigns error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await requireJson<{
      name?: string;
      title?: string;
      objective?: string;
      audience?: string;
      brandVoice?: string;
      channels?: string[];
      targetLength?: string;
    }>(request);

    // Support both "name" (simple) and "title" (full) parameters
    const campaignTitle = body.name || body.title;
    const campaignChannels = body.channels || ['email', 'social'];

    // Validate required fields
    if (!campaignTitle) {
      return NextResponse.json(
        { error: 'name or title is required' },
        { status: 422 }
      );
    }

    // Create campaign
    const campaign = await prisma.campaign.create({
      data: {
        title: campaignTitle,
        objective: body.objective || '',
        audience: body.audience || '',
        brandVoice: body.brandVoice || 'professional',
        channels: campaignChannels,
        targetLength: body.targetLength || 'medium',
        createdById: 'system-user', // TODO: Get from auth session
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /api/studio/campaigns error:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'id parameter is required' },
        { status: 422 }
      );
    }

    const body = await requireJson<Partial<{
      title: string;
      objective: string;
      audience: string;
      brandVoice: string;
      channels: string[];
      targetLength: string;
      status: string;
    }>>(request);

    const campaign = await prisma.campaign.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ data: campaign });
  } catch (error: any) {
    console.error('[API] PATCH /api/studio/campaigns error:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update campaign' },
      { status: 500 }
    );
  }
}
