import { NextApiRequest, NextApiResponse } from 'next';
import { getHubSpotToken } from '../../../lib/hubspot';
import { getServerSession } from 'next-auth/next';
// import { authOptions } from '../auth/[...nextauth]'; // Using Auth0 instead

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the current user session
    // TODO: Replace with proper Auth0 session handling
    // const session = await getServerSession(req, res, authOptions);
    const mockUser = { tenantId: 1 }; // Demo tenant
    
    // TODO: Implement proper session validation with Auth0
    // if (!session || !session.user) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    // For demo purposes, we'll use tenant ID 1 (Apex Enterprises)
    // In a real app, you'd get this from the session or user context
    const tenantId = 1;

    // Get the current HubSpot token
    const token = await getHubSpotToken(tenantId);

    return res.status(200).json({
      isConnected: !!token,
      token: token ? {
        id: token.id,
        provider: token.provider,
        expires_at: token.expires_at,
        created_at: token.created_at,
        updated_at: token.updated_at
      } : null
    });
  } catch (error) {
    console.error('Error checking HubSpot status:', error);
    return res.status(500).json({ error: 'Failed to check HubSpot connection status' });
  }
}
