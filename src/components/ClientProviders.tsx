"use client";

import { CartProvider } from "@/hooks/useCart";
import { LanguageProvider } from '@/hooks/useLanguage';
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ColorThemeInitializer from "@/components/ColorThemeInitializer";
import PWAInstallBanner from '@/components/PWAInstallBanner';
import Analytics from '@/components/Analytics';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Автоматический перехват ошибок загрузки чанков
  useEffect(() => {
    const handleChunkLoadError = (event: ErrorEvent) => {
      const message = event.message || '';
      const filename = event.filename || '';
      
      // Проверяем, является ли это ошибкой загрузки чанка
      if (
        message.includes('Loading chunk') ||
        message.includes('ChunkLoadError') ||
        filename.includes('_next/static/chunks/') ||
        message.includes('Failed to import')
      ) {
        console.warn('Обнаружена ошибка загрузки чанка, перезагружаем страницу...');
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || event.reason || '';
      
      if (
        reason.includes('Loading chunk') ||
        reason.includes('ChunkLoadError') ||
        reason.includes('Failed to import')
      ) {
        console.warn('Обнаружена ошибка загрузки чанка в Promise, перезагружаем страницу...');
        window.location.reload();
      }
    };

    // Обработчик для ошибок загрузки ресурсов (включая CSS и JS)
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'LINK' || target.tagName === 'SCRIPT')) {
        const src = (target as any).href || (target as any).src || '';
        if (src.includes('_next/static/')) {
          console.warn('Ошибка загрузки статического ресурса, перезагружаем...', src);
          // Небольшая задержка чтобы избежать бесконечных перезагрузок
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    };

    // Добавляем обработчики событий
    window.addEventListener('error', handleChunkLoadError);
    window.addEventListener('error', handleResourceError, true); // true для capture phase
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('error', handleChunkLoadError);
      window.removeEventListener('error', handleResourceError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  return (
    <LanguageProvider>
      <CartProvider>
        <ErrorBoundary>
          <ColorThemeInitializer />
          <div className="min-h-screen smooth-scroll">
            {children}
            <PWAInstallBanner />
            <Analytics />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--accent-call)',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </ErrorBoundary>
      </CartProvider>
    </LanguageProvider>
  );
}
