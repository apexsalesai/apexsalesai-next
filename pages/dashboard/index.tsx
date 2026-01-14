import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Redirect to the Apex AI Revenue Operator Dashboard
export default function DashboardIndex() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the operator agent dashboard
    router.replace('/dashboard/operator-agent');
  }, [router]);
  
  // Return a loading state while redirecting
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading dashboard...</p>
    </div>
  );
}
