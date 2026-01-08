import { useEffect, useState } from 'react';

interface EntraUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

interface EntraSession {
  user: EntraUser | null;
  loading: boolean;
}

export function useEntraSession() {
  const [session, setSession] = useState<EntraSession>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/entra/session');
      const data = await response.json();
      setSession({
        user: data.user,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      setSession({
        user: null,
        loading: false,
      });
    }
  };

  const signIn = () => {
    window.location.href = '/api/entra/login';
  };

  const signOut = () => {
    window.location.href = '/api/entra/logout';
  };

  return {
    session,
    signIn,
    signOut,
    refetch: fetchSession,
  };
}
