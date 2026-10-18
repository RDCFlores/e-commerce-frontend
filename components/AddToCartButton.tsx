'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3 font-semibold rounded-md transition-colors ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {added ? '✓ ¡Agregado al Carrito!' : 'Agregar al Carrito'}
    </button>
  );
}