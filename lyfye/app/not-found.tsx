import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container-custom py-32 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
