import { useState } from 'react';

export type PublishChannel = 'blog' | 'email' | 'linkedin' | 'x';

interface PublishOptions {
  assetId: string;
  channel: PublishChannel;
  // Channel-specific options
  to?: string | string[]; // For email
  subject?: string; // For email
  text?: string; // For social (LinkedIn/X)
  title?: string; // For blog
  scheduledAt?: string; // For all channels
}

interface PublishResult {
  ok: boolean;
  scheduled?: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}

export function usePublish() {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const publish = async (options: PublishOptions): Promise<PublishResult> => {
    setPublishing(true);
    setError(null);
    setSuccess(null);

    try {
      const { channel, assetId, ...payload } = options;
      
      const response = await fetch(`/api/publish/${channel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, ...payload }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        const errorMsg = result.message || result.error || 'Publish failed';
        setError(errorMsg);
        return { ok: false, error: errorMsg };
      }

      const successMsg = result.message || `Published to ${channel} successfully`;
      setSuccess(successMsg);
      return { ok: true, ...result };

    } catch (err: any) {
      const errorMsg = err.message || 'Network error';
      setError(errorMsg);
      return { ok: false, error: errorMsg };
    } finally {
      setPublishing(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    publish,
    publishing,
    error,
    success,
    clearMessages,
  };
}
