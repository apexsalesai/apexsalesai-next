/**
 * Google OAuth Start Handler
 * 
 * Initiates the OAuth 2.0 flow for Google services (YouTube, etc.)
 * Redirects user to Google's authorization page.
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channel = searchParams.get('channel') || 'youtube';
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    const scopes = process.env.YOUTUBE_SCOPES;
    
    if (!clientId || !redirectUri || !scopes) {
      return NextResponse.json(
        { error: 'Missing Google OAuth configuration' },
        { status: 500 }
      );
    }
    
    // Generate state parameter for CSRF protection
    const state = Buffer.from(
      JSON.stringify({
        channel,
        timestamp: Date.now(),
        nonce: Math.random().toString(36).substring(7),
      })
    ).toString('base64');
    
    // Build Google OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('access_type', 'offline'); // Get refresh token
    authUrl.searchParams.set('prompt', 'consent'); // Force consent to get refresh token
    authUrl.searchParams.set('state', state);
    
    logger.info('Initiating Google OAuth flow', {
      context: 'oauth',
      metadata: { channel, redirectUri },
    });
    
    // Redirect to Google's authorization page
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    logger.error('Failed to initiate Google OAuth', error as Error, {
      context: 'oauth',
    });
    
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
