import "./globals.css";
export const metadata = {
  title: "MenuCraft — QR-меню для ресторанов",
  description: "Готовый к продакшену шаблон Next.js для QR-меню с админкой и мультиязычностью.",
  keywords: [
    'QR меню',
    'ресторан',
    'онлайн меню',
    'заказ еды',
    'MenuCraft',
    'cafe',
    'restaurant menu',
    'digital menu',
    'турецкая кухня',
    'туркменская кухня'
  ],
  authors: [{ name: 'MenuCraft Team' }],
  creator: 'MenuCraft',
  publisher: 'MenuCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'ru': '/ru',
      'tk': '/tk',
    },
  },
  openGraph: {
    title: 'MenuCraft — QR-меню для ресторанов',
    description: 'Готовый к продакшену шаблон Next.js для QR-меню с админкой и мультиязычностью.',
    url: 'http://localhost:3000',
    siteName: 'MenuCraft',
    images: [
      {
        url: '/panda_logo.jpg',
        width: 800,
        height: 600,
        alt: 'MenuCraft Logo',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MenuCraft — QR-меню для ресторанов',
    description: 'Готовый к продакшену шаблон Next.js для QR-меню с админкой и мультиязычностью.',
    images: ['/panda_logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};
import { CartProvider } from "@/hooks/useCart";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import FloatingCartButton from '@/components/FloatingCartButton';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import Analytics from '@/components/Analytics';
import { Toaster } from 'react-hot-toast';
import ColorThemeInitializer from '@/components/ColorThemeInitializer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="h-full bg-white dark:bg-black text-gray-900 dark:text-white mobile-app-feel safe-area-padding">
        <CartProvider>
          <ErrorBoundary>
            <ColorThemeInitializer />
            <div className="min-h-screen smooth-scroll">
              {children}
              <FloatingCartButton />
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
      </body>
    </html>
  );
}
