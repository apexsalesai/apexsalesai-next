import { NextApiRequest, NextApiResponse } from 'next';
import { deleteHubSpotToken } from '../../../lib/hubspot';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the current user session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // For demo purposes, we'll use tenant ID 1 (Apex Enterprises)
    // In a real app, you'd get this from the session or user context
    const tenantId = 1;

    // Delete the HubSpot token
    await deleteHubSpotToken(tenantId);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error disconnecting HubSpot:', error);
    return res.status(500).json({ error: 'Failed to disconnect from HubSpot' });
  }
}
