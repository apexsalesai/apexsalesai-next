import { NextRequest, NextResponse } from 'next/server';
import { msalInstance, REDIRECT_URI, SCOPES } from '@/lib/entra-auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('[Callback] Starting auth callback');
    console.log('[Callback] Environment check:', {
      hasClientId: !!process.env.AZURE_AD_CLIENT_ID,
      hasTenantId: !!process.env.AZURE_AD_TENANT_ID,
      hasClientSecret: !!process.env.AZURE_AD_CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
    });

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      console.log('[Callback] No code in callback');
      return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker?error=no_code`);
    }

    console.log('[Callback] Got authorization code');

    // Exchange code for tokens
    const tokenRequest = {
      code,
      scopes: SCOPES,
      redirectUri: `${REDIRECT_URI}/api/entra/callback`,
    };

    console.log('[Callback] Exchanging code for token...');
    const response = await msalInstance.acquireTokenByCode(tokenRequest);
    console.log('[Callback] Token exchange successful');

    if (!response || !response.account) {
      console.log('[Callback] No account in response');
      return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker?error=no_account`);
    }

    // Get user info
    const { account } = response;
    const email = account.username;
    const name = account.name || email;
    console.log('[Callback] User info:', { email, name });

    // Create or update user in database
    console.log('[Callback] Saving user to database...');
    const user = await prisma.echoBreakerUser.upsert({
      where: { email },
      update: {
        name,
        lastLoginAt: new Date(),
      },
      create: {
        email,
        name,
        provider: 'entra',
        lastLoginAt: new Date(),
      },
    });

    console.log('[Callback] User saved:', user.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('entra_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    console.log('[Callback] Session cookie set');

    // Redirect back to Echo Breaker
    console.log('[Callback] Redirecting to Echo Breaker');
    return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker`);
  } catch (error: any) {
    console.error('[Callback] ERROR:', error);
    console.error('[Callback] Error message:', error?.message);
    console.error('[Callback] Error stack:', error?.stack);
    return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker?error=auth_failed`);
  }
}
