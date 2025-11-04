import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// Using Auth0 for authentication - session management handled by Auth0 SDK

const prisma = new PrismaClient();

// Helper to get tenantId from session
// TODO: Implement proper Auth0 session validation
async function getTenantId(req: NextRequest) {
  // For now, return a default tenantId
  // This should be replaced with proper Auth0 session extraction
  return 1;
}

export async function GET(req: NextRequest) {
  try {
    const tenantId = await getTenantId(req);
    const leads = await prisma.lead.findMany({
      where: { tenantId },
      include: { assignedTo: true },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await getTenantId(req);
    const body = await req.json();
    const lead = await prisma.lead.create({
      data: { ...body, tenantId },
    });
    return NextResponse.json(lead);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const tenantId = await getTenantId(req);
    const body = await req.json();
    const { id, ...update } = body;
    const lead = await prisma.lead.update({
      where: { id, tenantId },
      data: update,
    });
    return NextResponse.json(lead);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const tenantId = await getTenantId(req);
    const { id } = await req.json();
    await prisma.lead.delete({ where: { id, tenantId } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
