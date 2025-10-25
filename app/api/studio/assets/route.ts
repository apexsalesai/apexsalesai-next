/**
 * Content Asset API
 * GET - Get assets for a campaign
 * POST - Create or update asset
 * PATCH - Update asset
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, requireJson, audit, wordCount, charCount, readingTime } from '@lib/telemetry-phase2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const userId = searchParams.get('userId') || 'demo-user';
    const type = searchParams.get('type');
    
    // Build flexible where clause
    const where: any = {};
    if (campaignId) where.campaignId = campaignId;
    if (type) where.type = type;
    
    // If no filters, return recent assets (limit 50)
    const assets = await prisma.contentAsset.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    
    return NextResponse.json({ data: assets });
  } catch (error: any) {
    console.error('[API] GET /api/studio/assets error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await requireJson<{
      id?: string;
      campaignId: string;
      type: string;
      title: string;
      body: string;
      metadata?: any;
    }>(request);

    // Validate
    if (!body.campaignId || !body.type || !body.title || !body.body) {
      return NextResponse.json(
        { error: 'campaignId, type, title, and body are required' },
        { status: 422 }
      );
    }

    // Calculate metadata
    const metadata = {
      ...body.metadata,
      wordCount: wordCount(body.body),
      charCount: charCount(body.body),
      readingTime: readingTime(body.body),
    };

    let asset;
    
    if (body.id) {
      // Update existing asset
      asset = await prisma.contentAsset.update({
        where: { id: body.id },
        data: {
          title: body.title,
          body: body.body,
          metadata,
        },
      });
      
      await audit('system-user', 'asset.update', { type: 'asset', id: asset.id }, {
        type: asset.type,
        campaignId: asset.campaignId,
      });
    } else {
      // Create new asset
      asset = await prisma.contentAsset.create({
        data: {
          campaignId: body.campaignId,
          type: body.type,
          title: body.title,
          body: body.body,
          metadata,
        },
      });
      
      await audit('system-user', 'asset.create', { type: 'asset', id: asset.id }, {
        type: asset.type,
        campaignId: asset.campaignId,
      });
    }

    return NextResponse.json({ id: asset.id, data: asset });
  } catch (error: any) {
    console.error('[API] POST /api/studio/assets error:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to save asset' },
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

    const body = await requireJson<{
      title?: string;
      body?: string;
      status?: string;
      publishedTo?: string[];
    }>(request);

    const updateData: any = {};
    
    if (body.title) updateData.title = body.title;
    if (body.body) {
      updateData.body = body.body;
      updateData.metadata = {
        wordCount: wordCount(body.body),
        charCount: charCount(body.body),
        readingTime: readingTime(body.body),
      };
    }
    if (body.status) {
      updateData.status = body.status;
      if (body.status === 'published') {
        updateData.publishedAt = new Date();
      }
    }
    if (body.publishedTo) updateData.publishedTo = body.publishedTo;

    const asset = await prisma.contentAsset.update({
      where: { id },
      data: updateData,
    });

    await audit('system-user', 'asset.update', { type: 'asset', id: asset.id }, {
      type: asset.type,
      changes: Object.keys(updateData),
    });

    return NextResponse.json({ data: asset });
  } catch (error: any) {
    console.error('[API] PATCH /api/studio/assets error:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update asset' },
      { status: 500 }
    );
  }
}
