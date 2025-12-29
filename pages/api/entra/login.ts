import { NextApiRequest, NextApiResponse } from 'next';
import { msalInstance, REDIRECT_URI, SCOPES } from '../../../lib/entra-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authCodeUrlParameters = {
      scopes: SCOPES,
      redirectUri: `${REDIRECT_URI}/api/entra/callback`,
    };

    // Get authorization URL
    const authUrl = await msalInstance.getAuthCodeUrl(authCodeUrlParameters);

    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to initiate login' });
  }
}
