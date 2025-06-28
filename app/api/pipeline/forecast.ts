import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Helper to get tenantId from session
async function getTenantId(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error('Unauthorized');
  // @ts-ignore
  return session.user.tenantId;
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = await getTenantId(req);
    // Fetch all active leads for tenant
    const leads = await prisma.lead.findMany({ where: { tenantId } });
    // Compose prompt for pipeline forecasting
    const prompt = `You are Max, an expert AI revenue operator. Given the following leads, forecast the total expected revenue, predicted close rate, and highlight any pipeline risks.\n\nLeads:\n${leads.map(l => `Name: ${l.name}, Stage: ${l.stage}, Confidence: ${l.confidence_score}, Value: $${l.deal_value || 0}`).join('\n')}\n\nRespond with:\n- Forecasted Revenue: <amount>\n- Predicted Close Rate: <percent>%\n- Pipeline Risks: <short summary>\n- Key Insights: <bulleted list>`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/max-chat/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    });
    const data = await res.json();
    return NextResponse.json({ forecast: data.answer });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
