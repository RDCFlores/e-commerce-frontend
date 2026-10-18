import { cookies } from 'next/headers';
import Link from 'next/link';
import DeleteProductButton from '@/components/DeleteProductButton';

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

async function getProducts() {
  const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const products = await getProducts();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
        
        {/* Solo visible para administradores */}
        {isAdmin && (
          <Link
            href="/products/create"
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700"
          >
            + Agregar Producto
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div>
              <img
                src={product.image_url || '/placeholder.png'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm my-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600">${product.price}</p>
            </div>

            <div className="mt-4 flex justify-between items-center pt-4 border-t">
              <Link
                href={`/products/${product.id}`}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Ver Detalle
              </Link>

              {/* Botones de gestión solo visibles para administradores */}
              {isAdmin && (
                <div className="flex gap-2">
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
        ))}
      </div>
    </div>
  );
}