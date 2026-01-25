import { handleAuth } from '@auth0/nextjs-auth0';

// Only initialize Auth0 if credentials are provided
// This prevents build-time errors when env vars aren't set
export default function handler(req, res) {
  // Check if Auth0 is configured
  if (!process.env.AUTH0_SECRET || !process.env.AUTH0_BASE_URL || !process.env.AUTH0_ISSUER_BASE_URL || !process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET) {
    return res.status(501).json({ 
      error: 'Auth0 not configured',
      message: 'Please set AUTH0 environment variables'
    });
  }
  
  return handleAuth()(req, res);
}
