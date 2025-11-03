import "./globals.css";
export const metadata = {
  title: "Panda Burger — Бургерная быстрого питания",
  description: "Panda Burger — лучшие бургеры и стрит-фуд с доставкой. Сочные бургеры, картофель фри и напитки.",
  keywords: [
    'QR меню',
    'ресторан',
    'онлайн меню',
    'заказ еды',
    'Panda Burger',
    'бургер',
    'burger',
    'digital menu',
    'fast food',
    'street food'
  ],
  authors: [{ name: 'Panda Burger Team' }],
  creator: 'Panda Burger',
  publisher: 'Panda Burger',
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
      title: 'Panda Burger — QR-меню',
      description: 'Panda Burger — стильное тёмное QR-меню для кафе и ресторанов',
      url: 'http://localhost:3000',
      siteName: 'Panda Burger',
      images: [
        {
          url: '/panda_logo.png',
          width: 1200,
          height: 630,
          alt: 'Panda Burger',
        },
      ],
      locale: 'ru_RU',
      type: 'website',
    },
  twitter: {
    card: 'summary_large_image',
    title: 'Panda Burger — QR-меню для ресторанов',
    description: 'Готовый к продакшену шаблон Next.js для QR-меню Panda Burger с админкой и мультиязычностью.',
    images: ['/panda_logo.png'],
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
