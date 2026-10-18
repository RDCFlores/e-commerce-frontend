'use client';

import { useActionState } from 'react';
import { createProductAction } from '@/actions/products';
import Link from 'next/link';

export default function CreateProductPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      return await createProductAction(formData);
    },
    null
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded-lg shadow-sm my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agregar Producto</h1>
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          &larr; Volver
        </Link>
      </div>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            rows={3}
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
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              defaultValue={10}
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
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}