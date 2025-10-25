import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Redirect to the new Phase 2 Studio workspace
export default function DashboardIndex() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new studio workspace
    router.replace('/studio');
  }, [router]);
  
  // Return a loading state while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading studio...</p>
    </div>
  );
}
