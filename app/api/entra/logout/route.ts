import { NextRequest, NextResponse } from 'next/server';
import { POST_LOGOUT_REDIRECT_URI } from '@/lib/entra-auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.delete('entra_user_id');

    // Redirect to Microsoft logout
    const logoutUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(POST_LOGOUT_REDIRECT_URI)}`;

    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.redirect(POST_LOGOUT_REDIRECT_URI);
  }
}
