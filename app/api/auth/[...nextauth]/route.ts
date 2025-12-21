// DISABLED: This route has been replaced by Microsoft Entra ID authentication
// See /api/entra/* for the new authentication routes
// This file is kept to prevent build errors but does nothing

export async function GET() {
  return new Response('Authentication moved to /api/entra', { status: 410 });
}

export async function POST() {
  return new Response('Authentication moved to /api/entra', { status: 410 });
}
