import "./globals.css";

export const metadata = {
  title: "Panda Burger | Сочные бургеры премиум класса с доставкой",
  description: "Panda Burger — авторские бургеры премиум качества, картофель фри, fresh напитки и быстрая доставка. Закажите онлайн через QR-меню!",
  keywords: [
    'Panda Burger',
    'бургер',
    'burger',
    'доставка еды',
    'fast food',
    'QR меню',
    'заказ онлайн',
    'премиум бургеры',
    'авторские бургеры',
    'картофель фри',
    'напитки'
  ],
  authors: [{ name: 'Panda Burger' }],
  creator: 'Panda Burger',
  publisher: 'Panda Burger',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pandaburger.cloud'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Panda Burger | Сочные бургеры премиум класса',
    description: 'Авторские бургеры премиум качества, картофель фри, fresh напитки. Быстрая доставка. Закажите онлайн!',
    url: 'https://pandaburger.cloud',
    siteName: 'Panda Burger',
    images: [
      {
        url: '/panda_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Panda Burger - Авторские бургеры премиум класса',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda Burger | Сочные бургеры премиум класса',
    description: 'Авторские бургеры премиум качества, картофель фри, fresh напитки. Быстрая доставка.',
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#212121',
  width: 'device-width',
  initialScale: 1,
};

import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        {/* Force cache refresh for static assets */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="h-full mobile-app-feel safe-area-padding" style={{background: 'var(--panda-bg, var(--bg-primary))', color: 'var(--panda-text, var(--text-primary))'}}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
