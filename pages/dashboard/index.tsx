import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Redirect to the Simple Dashboard (operator-agent has runtime errors)
export default function DashboardIndex() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the simple dashboard
    router.replace('/dashboard/simple');
  }, [router]);
  
  // Return a loading state while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading dashboard...</p>
    </div>
  );
}
