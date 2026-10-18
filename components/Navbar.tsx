'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { logoutAction } from '@/actions/auth';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/products" className="text-xl font-bold tracking-wide">
        E-Commerce
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/products" className="hover:text-gray-300">
          Catálogo
        </Link>
        <Link href="/my-orders" className="hover:text-gray-300">
          Mis Órdenes
        </Link>
        <Link href="/checkout" className="relative hover:text-gray-300">
          🛒 Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {totalItems}
            </span>
          )}
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition-colors"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </nav>
  );
}