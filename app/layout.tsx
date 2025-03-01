import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/components/cart-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'СушиМи - Современная доставка суши и роллов',
  description: 'Премиальная доставка свежих суши и роллов в Иркутске. Изысканный вкус, стильная подача, быстрая доставка.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}