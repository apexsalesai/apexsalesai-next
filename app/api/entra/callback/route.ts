import { NextRequest, NextResponse } from 'next/server';
import { msalInstance, REDIRECT_URI, SCOPES } from '@/lib/entra-auth';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker?error=no_code`);
    }

    // Exchange code for tokens
    const tokenRequest = {
      code,
      scopes: SCOPES,
      redirectUri: `${REDIRECT_URI}/api/entra/callback`,
    };

    const response = await msalInstance.acquireTokenByCode(tokenRequest);

    if (!response || !response.account) {
      return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker?error=no_account`);
    }

    // Get user info
    const { account } = response;
    const email = account.username;
    const name = account.name || email;

    // Create or update user in database
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

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('entra_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Redirect back to Echo Breaker
    return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker`);
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(`${REDIRECT_URI}/echo-breaker?error=auth_failed`);
  }
}
