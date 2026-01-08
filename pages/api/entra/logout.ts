import { NextApiRequest, NextApiResponse } from 'next';
import { POST_LOGOUT_REDIRECT_URI } from '../../../lib/entra-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear session cookie
    res.setHeader('Set-Cookie', 'entra_user_id=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');

    // Redirect to Microsoft logout
    const logoutUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(POST_LOGOUT_REDIRECT_URI)}`;

    res.redirect(logoutUrl);
  } catch (error) {
    console.error('Error during logout:', error);
    res.redirect(POST_LOGOUT_REDIRECT_URI);
  }
}
