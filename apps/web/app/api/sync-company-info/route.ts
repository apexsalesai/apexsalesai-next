import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// This endpoint fetches company info from a remote source (e.g., your public About page), parses it, and updates company-info.json.
// You can schedule this endpoint to be hit periodically, or trigger it manually from the admin dashboard.

const REMOTE_COMPANY_INFO_URL = process.env.REMOTE_COMPANY_INFO_URL || '';

async function fetchRemoteCompanyInfo() {
  if (!REMOTE_COMPANY_INFO_URL) throw new Error('REMOTE_COMPANY_INFO_URL not set');
  const res = await fetch(REMOTE_COMPANY_INFO_URL);
  if (!res.ok) throw new Error('Failed to fetch remote company info');
  return await res.json(); // Assumes remote endpoint returns JSON in correct format
}

export async function POST(req: NextRequest) {
  try {
    const companyInfo = await fetchRemoteCompanyInfo();
    const infoPath = path.join(process.cwd(), 'company-info.json');
    await fs.writeFile(infoPath, JSON.stringify(companyInfo, null, 2));
    return NextResponse.json({ status: 'ok', updated: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // For manual triggering/testing
  return POST(req);
}
