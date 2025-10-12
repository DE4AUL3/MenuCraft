import "./globals.css";
export const metadata = {
  title: "MenuCraft — QR-меню для ресторанов",
  description: "Готовый к продакшену шаблон Next.js для QR-меню с админкой и мультиязычностью.",
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
            <div className="min-h-screen smooth-scroll">
              {children}
              <FloatingCartButton />
              <PWAInstallBanner />
            </div>
          </ErrorBoundary>
        </CartProvider>
      </body>
    </html>
  );
}
