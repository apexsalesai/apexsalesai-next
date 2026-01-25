import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { messageIdx, feedback, user, timestamp } = await req.json();
    const feedbackPath = path.join(process.cwd(), 'feedback-log.json');
    let feedbackLog = [];
    try {
      const raw = await fs.readFile(feedbackPath, 'utf8');
      feedbackLog = JSON.parse(raw);
    } catch {}
    feedbackLog.push({ messageIdx, feedback, user, timestamp: timestamp || Date.now() });
    await fs.writeFile(feedbackPath, JSON.stringify(feedbackLog, null, 2));
    return NextResponse.json({ status: 'ok' });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to log feedback.' }, { status: 500 });
  }
}
