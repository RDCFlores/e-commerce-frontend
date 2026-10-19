'use client';

import { useCart } from '@/context/CartContext';
import { checkoutAction } from '@/actions/order';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    const cartPayload = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    const result = await checkoutAction(cartPayload);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      clearCart();
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        toast.success('¡Orden creada exitosamente!');
        setTimeout(() => {
          window.location.href = '/my-orders';
        }, 1500);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🛒
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h1>
          <p className="text-slate-500 text-sm mb-6">
            Agrega algunos productos antes de proceder al pago.
          </p>
          <Link
            href="/products"
            className="inline-block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-white border-b border-slate-200 py-10 px-4 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-wide">
          Mi Carrito
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          {' > '}
          <Link href="/products" className="hover:text-blue-600 transition-colors">Tienda</Link>
          {' > '}
          <span className="text-blue-600 font-semibold">Carrito</span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
            <div className="hidden sm:grid grid-cols-12 bg-slate-100 py-3.5 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <span className="col-span-6">Producto</span>
              <span className="col-span-2 text-center">Precio</span>
              <span className="col-span-2 text-center">Cantidad</span>
              <span className="col-span-2 text-right">Acción</span>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => {
                const price = Number(item.product.price) || 0;
                return (
                  <div
                    key={item.product.id}
                    className="flex flex-col sm:grid sm:grid-cols-12 items-center p-4 sm:px-6 gap-4"
                  >

                    <div className="sm:col-span-6 flex items-center gap-4 w-full">
                      <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-200 overflow-hidden text-xl">
                        📦
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">${price.toFixed(2)} c/u</p>
                      </div>
                    </div>


                    <div className="sm:col-span-2 text-slate-600 text-sm font-semibold text-center">
                      ${price.toFixed(2)}
                    </div>

                    <div className="sm:col-span-2 flex justify-center">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 font-bold transition-colors text-sm"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-slate-800 bg-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 font-bold transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex justify-end w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        title="Eliminar producto"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                Resumen de Compra
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-blue-600 text-xl">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 transition-all duration-150"
              >
                {loading ? 'Procesando pago con Stripe...' : 'Pagar con Stripe'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}