import { Product } from '@/types';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import AddToCartButton from '../../../components/AddToCartButton';
import DeleteProductButton from '../../../components/DeleteProductButton';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error al cargar el producto');

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;


  const [product, user] = await Promise.all([
    getProduct(id),
    getCurrentUser(),
  ]);

  if (!product) {
    notFound();
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/products" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border rounded-lg p-6 shadow-sm">
        <div className="h-72 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full object-cover rounded-md" />
          ) : (
            'Sin Imagen'
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-green-600 mb-4">${Number(product.price).toFixed(2)}</p>
            <p className="text-gray-700">{product.description}</p>
          </div>
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>
        </div>

        {/* Solo renderiza las acciones administrativas si el usuario tiene rol 'admin' */}
        {isAdmin && (
          <div className="flex gap-2 mt-4 md:col-span-2 pt-4 border-t">
            <Link
              href={`/products/${product.id}/edit`}
              className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded hover:bg-amber-600"
            >
              Editar
            </Link>
            <DeleteProductButton id={product.id} />
          </div>
        )}
      </div>
    </div>
  );
}