import { useRouter } from 'next/router';
import { useEffect } from 'react';

// This is a simple index file that redirects to the operator-agent-fixed dashboard
export default function DashboardIndex() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the operator-agent-fixed dashboard
    router.replace('/dashboard/operator-agent-fixed');
  }, [router]);
  
  // Return a loading state while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading dashboard...</p>
    </div>
  );
}
