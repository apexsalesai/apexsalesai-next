/**
 * Google OAuth Callback Handler
 * 
 * Handles the OAuth 2.0 callback from Google after user authorization.
 * Exchanges authorization code for access and refresh tokens.
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const stateParam = searchParams.get('state');

    // Handle OAuth errors
    if (error) {
      logger.error('Google OAuth error', new Error(error), {
        context: 'oauth',
      });
      
      return NextResponse.redirect(
        new URL(`/studio?error=oauth_failed&reason=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    // Decode and validate state
    let state: { channel: string; timestamp: number; nonce: string };
    try {
      state = JSON.parse(Buffer.from(stateParam || '', 'base64').toString());
      
      // Check if state is too old (5 minutes)
      if (Date.now() - state.timestamp > 5 * 60 * 1000) {
        throw new Error('State expired');
      }
    } catch (err) {
      logger.error('Invalid OAuth state', err as Error, {
        context: 'oauth',
      });
      
      return NextResponse.redirect(
        new URL('/studio?error=invalid_state', request.url)
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Google OAuth configuration' },
        { status: 500 }
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      logger.error('Failed to exchange authorization code', new Error(errorData), {
        context: 'oauth',
      });
      
      return NextResponse.redirect(
        new URL('/studio?error=token_exchange_failed', request.url)
      );
    }

    const tokens: TokenResponse = await tokenResponse.json();

    logger.info('Successfully obtained Google OAuth tokens', {
      context: 'oauth',
      metadata: {
        channel: state.channel,
        hasRefreshToken: !!tokens.refresh_token,
        expiresIn: tokens.expires_in,
      },
    });

    // TODO: Store tokens securely
    // For now, we'll display them for manual configuration
    // In production, you'd want to:
    // 1. Encrypt the tokens
    // 2. Store in database with user association
    // 3. Implement token refresh logic

    const successUrl = new URL('/studio/oauth-success', request.url);
    successUrl.searchParams.set('channel', state.channel);
    successUrl.searchParams.set('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      successUrl.searchParams.set('refresh_token', tokens.refresh_token);
    }
    successUrl.searchParams.set('expires_in', tokens.expires_in.toString());

    return NextResponse.redirect(successUrl);
  } catch (error) {
    logger.error('OAuth callback error', error as Error, {
      context: 'oauth',
    });

    return NextResponse.redirect(
      new URL('/studio?error=oauth_callback_failed', request.url)
    );
  }
}
