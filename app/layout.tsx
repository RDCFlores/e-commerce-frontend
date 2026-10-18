import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'E-Commerce App',
  description: 'Frontend Next.js consumiendo API Laravel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 antialiased min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="container mx-auto py-6">{children}</main>
        </CartProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}