import { NextApiRequest, NextApiResponse } from 'next';
import { msalInstance, REDIRECT_URI, SCOPES } from '../../../lib/entra-auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Callback] Starting auth callback');
    console.log('[Callback] Environment check:', {
      hasClientId: !!process.env.AZURE_AD_CLIENT_ID,
      hasTenantId: !!process.env.AZURE_AD_TENANT_ID,
      hasClientSecret: !!process.env.AZURE_AD_CLIENT_SECRET,
      redirectUri: REDIRECT_URI,
    });

    const code = req.query.code as string;

    if (!code) {
      console.log('[Callback] No code in callback');
      return res.redirect(`${REDIRECT_URI}/echo-breaker?error=no_code`);
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
      return res.redirect(`${REDIRECT_URI}/echo-breaker?error=no_account`);
    }

    // Get user info
    const { account } = response;
    const email = account.username;
    const name = account.name || email;
    console.log('[Callback] User info:', { email, name });

    // Create or update user in database
    console.log('[Callback] Saving user to database...');
    try {
      const dbInfo = await prisma.$queryRaw<
        Array<{ current_user: string; current_database: string; current_schema: string; search_path: string }>
      >`SELECT current_user, current_database(), current_schema(), current_setting('search_path') AS search_path`;
      console.log('[Callback] DB runtime info:', dbInfo?.[0]);
    } catch (dbInfoError: any) {
      console.error('[Callback] DB runtime info error:', dbInfoError?.message || dbInfoError);
    }
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
    res.setHeader('Set-Cookie', `entra_user_id=${user.id}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`);
    console.log('[Callback] Session cookie set');

    // Redirect back to Echo Breaker
    console.log('[Callback] Redirecting to Echo Breaker');
    res.redirect(`${REDIRECT_URI}/echo-breaker`);
  } catch (error: any) {
    console.error('[Callback] ERROR:', error);
    console.error('[Callback] Error message:', error?.message);
    console.error('[Callback] Error stack:', error?.stack);
    res.redirect(`${REDIRECT_URI}/echo-breaker?error=auth_failed`);
  }
}
