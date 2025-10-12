import { useEffect } from 'react';

export function useErrorGuard(onError?: (error: Error) => void) {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      if (onError) onError(event.error);
      // Можно логировать ошибку
      console.error('Глобальная ошибка:', event.error);
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, [onError]);
}
