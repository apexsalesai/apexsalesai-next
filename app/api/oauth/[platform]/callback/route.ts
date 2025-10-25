/**
 * OAuth Callback Endpoint (Stub)
 * Handles OAuth callback and exchanges code for token
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;
  const { searchParams } = new URL(req.url);
  
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const redirectUrl = new URL('/studio/settings/connections', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

  // Handle OAuth errors
  if (error) {
    redirectUrl.searchParams.set('error', `OAuth error: ${error}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    redirectUrl.searchParams.set('error', 'Missing OAuth parameters');
    return NextResponse.redirect(redirectUrl);
  }

  // TODO: Verify state matches stored value
  // TODO: Exchange code for access token
  // TODO: Store encrypted token in database

  /* REAL IMPLEMENTATION (uncomment when ready):
  
  // Verify state
  const storedState = req.cookies.get(`oauth_state_${platform}`)?.value;
  if (state !== storedState) {
    redirectUrl.searchParams.set('error', 'Invalid OAuth state');
    return NextResponse.redirect(redirectUrl);
  }

  // Exchange code for token
  const tokenResponse = await fetch(`https://api.${platform}.com/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`,
      client_id: process.env[`${platform.toUpperCase()}_CLIENT_ID`],
      client_secret: process.env[`${platform.toUpperCase()}_CLIENT_SECRET`],
    }),
  });

  const tokens = await tokenResponse.json();

  // Encrypt and store tokens
  const encryptedAccessToken = await encrypt(tokens.access_token);
  const encryptedRefreshToken = tokens.refresh_token ? await encrypt(tokens.refresh_token) : null;

  await prisma.oAuthToken.create({
    data: {
      userId: 'demo-user', // Replace with actual user ID from session
      platform,
      accessTokenEnc: encryptedAccessToken,
      refreshTokenEnc: encryptedRefreshToken,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });

  // Clear state cookie
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete(`oauth_state_${platform}`);
  return response;
  */

  // Mock success for now
  redirectUrl.searchParams.set('connected', platform);
  redirectUrl.searchParams.set('message', `${platform} connected successfully!`);
  return NextResponse.redirect(redirectUrl);
}
