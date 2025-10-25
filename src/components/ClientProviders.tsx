"use client";

import { CartProvider } from "@/hooks/useCart";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ColorThemeInitializer from "@/components/ColorThemeInitializer";
import PWAInstallBanner from '@/components/PWAInstallBanner';
import Analytics from '@/components/Analytics';
import { Toaster } from 'react-hot-toast';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
