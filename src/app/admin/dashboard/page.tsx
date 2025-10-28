'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PremiumAdminDashboard from '@/components/PremiumAdminDashboardV2';

// 🔐 Универсальный хук для проверки аутентификации администратора
function useAdminAuth() {
  const router = useRouter();
  const [authState, setAuthState] = React.useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  React.useEffect(() => {
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

export default function AdminDashboardPage() {
  const authState = useAdminAuth();

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Проверка доступа...</p>
      </div>
    );
  }

  if (authState === 'unauthorized') return null;

  return <PremiumAdminDashboard />;
}