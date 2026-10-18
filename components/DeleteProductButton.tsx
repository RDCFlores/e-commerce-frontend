'use client';

import { useTransition } from 'react';
import { deleteProductAction } from '@/actions/products';

interface DeleteProductButtonProps {
  id: number;
}

export default function DeleteProductButton({ id }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      startTransition(async () => {
        const result = await deleteProductAction(id);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
    >
      {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}