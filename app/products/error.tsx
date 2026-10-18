'use client';

import { useEffect } from 'react';

export default function ErrorProducts({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error al cargar productos:', error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
      <h2 className="text-xl font-bold text-red-700 mb-2">¡Algo salió mal!</h2>
      <p className="text-gray-600 mb-4">No se pudieron cargar los productos desde la API.</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
  );
}