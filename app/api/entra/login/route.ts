import { NextRequest, NextResponse } from 'next/server';
import { msalInstance, REDIRECT_URI, SCOPES } from '@/lib/entra-auth';

export async function GET(request: NextRequest) {
  try {
    const authCodeUrlParameters = {
      scopes: SCOPES,
      redirectUri: `${REDIRECT_URI}/api/entra/callback`,
    };

    // Get authorization URL
    const authUrl = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to initiate login' },
      { status: 500 }
    );
  }
}
