import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
// import nodemailer or Resend here for email notification (optional)

export async function POST(req: NextRequest) {
  try {
    const { user, transcript, reason, timestamp } = await req.json();
    const escalationPath = path.join(process.cwd(), 'escalation-log.json');
    let escalationLog = [];
    try {
      const raw = await fs.readFile(escalationPath, 'utf8');
      escalationLog = JSON.parse(raw);
    } catch {}
    escalationLog.push({ user, transcript, reason, timestamp: timestamp || Date.now() });
    await fs.writeFile(escalationPath, JSON.stringify(escalationLog, null, 2));
    // TODO: Send email notification to support/sales here
    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to log escalation.' }, { status: 500 });
  }
}
