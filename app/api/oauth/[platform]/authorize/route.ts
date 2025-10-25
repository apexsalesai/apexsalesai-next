/**
 * OAuth Authorization Endpoint (Stub)
 * Redirects to platform OAuth or returns mock success
 */

import { NextRequest, NextResponse } from 'next/server';

const OAUTH_CONFIGS: Record<string, { authUrl: string; scope: string }> = {
  linkedin: {
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scope: 'w_member_social r_liteprofile',
  },
  x: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scope: 'tweet.read tweet.write users.read',
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    scope: 'user_profile,user_media',
  },
  wordpress: {
    authUrl: 'https://public-api.wordpress.com/oauth2/authorize',
    scope: 'global',
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;
  const config = OAUTH_CONFIGS[platform];

  if (!config) {
    // For "coming soon" platforms, redirect back with a message
    const redirectUrl = new URL('/studio/settings/connections', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    redirectUrl.searchParams.set('message', `${platform} integration coming soon!`);
    return NextResponse.redirect(redirectUrl);
  }

  // TODO: Implement real OAuth flow
  // For now, redirect back with mock success
  const redirectUrl = new URL('/studio/settings/connections', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  redirectUrl.searchParams.set('connected', platform);
  redirectUrl.searchParams.set('message', `${platform} connected successfully (mock)`);
  
  return NextResponse.redirect(redirectUrl);

  /* REAL IMPLEMENTATION (uncomment when ready):
  
  const state = crypto.randomUUID();
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`;
  
  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set('client_id', process.env[`${platform.toUpperCase()}_CLIENT_ID`]!);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', config.scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');

  // Store state in session/cookie for verification
  const response = NextResponse.redirect(authUrl);
  response.cookies.set(`oauth_state_${platform}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10 minutes
    sameSite: 'lax',
  });

  return response;
  */
}
