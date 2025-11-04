/**
 * OAuth Success Page
 * 
 * Displays OAuth tokens after successful authorization.
 * User can copy these to .env.local for channel configuration.
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';

export default function OAuthSuccessPage() {
  const searchParams = useSearchParams();
  const channel = searchParams.get('channel') || 'unknown';
  const accessToken = searchParams.get('access_token') || '';
  const refreshToken = searchParams.get('refresh_token') || '';
  const expiresIn = searchParams.get('expires_in') || '';

  const [copiedAccess, setCopiedAccess] = useState(false);
  const [copiedRefresh, setCopiedRefresh] = useState(false);

  const copyToClipboard = async (text: string, type: 'access' | 'refresh') => {
    await navigator.clipboard.writeText(text);
    if (type === 'access') {
      setCopiedAccess(true);
      setTimeout(() => setCopiedAccess(false), 2000);
    } else {
      setCopiedRefresh(true);
      setTimeout(() => setCopiedRefresh(false), 2000);
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 flex items-center gap-3">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
        <div>
          <h1 className="text-3xl font-bold">OAuth Authorization Successful!</h1>
          <p className="text-muted-foreground">
            {channel.charAt(0).toUpperCase() + channel.slice(1)} has been connected
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Access Token</CardTitle>
          <CardDescription>
            Copy this token to your .env.local file as YOUTUBE_ACCESS_TOKEN
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted p-3 text-sm break-all">
              {accessToken}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(accessToken, 'access')}
            >
              {copiedAccess ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Expires in: {Math.floor(Number(expiresIn) / 3600)} hours
          </p>
        </CardContent>
      </Card>

      {refreshToken && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Refresh Token</CardTitle>
            <CardDescription>
              Copy this token to your .env.local file as YOUTUBE_REFRESH_TOKEN
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted p-3 text-sm break-all">
                {refreshToken}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(refreshToken, 'refresh')}
              >
                {copiedRefresh ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Use this to refresh the access token when it expires
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Update Environment Variables</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add these to your .env.local file:
            </p>
            <pre className="rounded bg-muted p-3 text-sm overflow-x-auto">
{`YOUTUBE_ENABLED=true
YOUTUBE_ACCESS_TOKEN="${accessToken}"
${refreshToken ? `YOUTUBE_REFRESH_TOKEN="${refreshToken}"` : ''}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Restart Your Application</h3>
            <p className="text-sm text-muted-foreground">
              Run <code className="rounded bg-muted px-1">npm run dev</code> to apply the changes
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Test the Connection</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Verify your YouTube channel is connected:
            </p>
            <Button variant="outline" asChild>
              <a href="/api/channels/status?channel=youtube" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Test YouTube Connection
              </a>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button asChild>
              <a href="/studio">
                Go to Studio
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Security Note</h3>
        <p className="text-sm text-yellow-800">
          These tokens grant access to your YouTube account. Keep them secure and never commit them to version control.
          Store them only in your .env.local file (which should be in .gitignore).
        </p>
      </div>
    </div>
  );
}
