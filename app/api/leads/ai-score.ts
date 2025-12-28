import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { getServerSession } from 'next-auth'; // Removed - not using NextAuth
// import { authOptions } from '../auth/[...nextauth]/route'; // Using Auth0 instead

const prisma = new PrismaClient();

// Helper to get tenantId from session
async function getTenantId(req: NextRequest) {
  // TODO: Replace with proper Auth0 session handling
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user) throw new Error('Unauthorized');
  // For now, return demo tenant ID to unblock deployment
  return 1; // Demo tenant ID
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await getTenantId(req);
    const { leadId } = await req.json();
    const lead = await prisma.lead.findUnique({ where: { id: leadId, tenantId } });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    // Compose a prompt for Max (Azure OpenAI)
    const prompt = `You are Max, an AI sales expert. Analyze the following lead and provide a confidence score (0-100) and 2-3 actionable recommendations.\n\nLead Info:\nName: ${lead.name}\nEmail: ${lead.email}\nIndustry: ${lead.industry}\nStage: ${lead.stage}\nSource: ${lead.source || 'N/A'}\n`; 
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/max-chat/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });
    const data = await res.json();
    return NextResponse.json({ aiScore: data.answer, recommendations: data.suggestions || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
