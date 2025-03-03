import './globals.css';
// Импорт стилей Swiper глобально
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/components/cart-provider';
import MainLayout from '@/components/layouts/MainLayout';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'СушиМи - Доставка суши и роллов',
  description: 'Самые вкусные и свежие суши и роллы с доставкой',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <MainLayout>{children}</MainLayout>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}