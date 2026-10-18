'use client';

import { useActionState } from 'react';
import { updateProductAction } from '@/actions/products';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
}

export default function EditProductForm({ product }: { product: Product }) {
  const updateActionWithId = updateProductAction.bind(null, product.id);

  const [state, formAction, pending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      return await updateActionWithId(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          defaultValue={product.name}
          required
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product.description}
          required
          className="w-full mt-1 p-2 border rounded-md"
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            defaultValue={product.price}
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            defaultValue={product.stock ?? 10}
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
        <input
          type="url"
          name="image_url"
          defaultValue={product.image_url || ''}
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Actualizar Producto'}
        </button>
        <Link
          href="/products"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-center"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}