'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-custom py-32 text-center">
      <h1 className="text-6xl font-bold mb-4">Oops!</h1>
      <h2 className="text-2xl font-semibold mb-6">Something went wrong</h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
        We encountered an unexpected error. Please try again.
      </p>
      <Button variant="primary" size="lg" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
