'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthState = 'loading' | 'authorized' | 'unauthorized';

export function useAdminAuth(): AuthState {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      setAuthState('authorized');
    } else {
      setAuthState('unauthorized');
      router.replace('/admin');
    }
  }, [router]);

  return authState;
}
