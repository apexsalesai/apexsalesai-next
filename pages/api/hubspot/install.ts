import { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForToken } from '../../../lib/hubspot';
import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]'; // Using Auth0 instead

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the current user session
    // TODO: Replace with proper Auth0 session handling
    // const session = await getServerSession(req, res, authOptions);
    const mockUser = { tenantId: 1 }; // Demo tenant
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // For demo purposes, we'll use tenant ID 1 (Apex Enterprises)
    // In a real app, you'd get this from the session or user context
    const tenantId = 1;
    
    // Get the user ID from the session
    // For demo purposes, we'll use user ID 1 if not available
    const userId = session.user.id || 1;

    // Exchange the code for a token
    const tokenData = await exchangeCodeForToken(code, tenantId, userId);

    return res.status(200).json(tokenData);
  } catch (error) {
    console.error('Error installing HubSpot:', error);
    return res.status(500).json({ error: 'Failed to complete HubSpot installation' });
  }
}
