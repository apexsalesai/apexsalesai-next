import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIX = '/admin';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = new URL(req.url);

  if (pathname.startsWith(PROTECTED_PREFIX)) {
    // Allow if header or query token matches
    const header = req.headers.get('x-admin-token');
    const token = header || searchParams.get('token');
    
    if (token !== process.env.ADMIN_ACCESS_TOKEN) {
      return new NextResponse('Unauthorized - Invalid or missing admin token', { 
        status: 401,
        headers: {
          'Content-Type': 'text/plain',
        }
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
