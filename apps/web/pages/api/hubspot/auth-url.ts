import { NextApiRequest, NextApiResponse } from 'next';
import { getHubSpotAuthUrl } from '../../../lib/hubspot';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authUrl = getHubSpotAuthUrl();
    return res.status(200).json({ authUrl });
  } catch (error) {
    console.error('Error generating HubSpot auth URL:', error);
    return res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
}
