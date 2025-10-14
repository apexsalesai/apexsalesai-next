import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect content generation endpoints
 * Only authenticated users can access Max Content Engine
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect content generation API endpoints
  if (pathname.startsWith('/api/agent/generate-content') || 
      pathname.startsWith('/api/agent/publish-content') ||
      pathname.startsWith('/api/agent/schedule')) {
    
    // Check for API key in header
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.CONTENT_API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Valid API key required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/agent/generate-content',
    '/api/agent/publish-content',
    '/api/agent/schedule'
  ]
};
