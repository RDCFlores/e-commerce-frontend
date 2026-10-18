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
       // window.location.href = '/my-orders';
       toast.success('¡Orden creada exitosamente!');
        setTimeout(() => {
       window.location.href ='/my-orders';
      }, 1500);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
       
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">Agrega algunos productos antes de proceder al pago.</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <div className="divide-y">
          {cart.map((item) => (
            <div key={item.product.id} className="py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-gray-500">${Number(item.product.price).toFixed(2)} c/u</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-gray-800 w-24 text-right">
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span className="text-green-600">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Procesando pago con Stripe...' : 'Pagar con Stripe'}
      </button>
    </div>
  );
}