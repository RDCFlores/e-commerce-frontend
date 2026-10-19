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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      
      <div className="bg-white border-b border-slate-200 py-10 px-4 text-center shadow-sm mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-wide">
          Catálogo de Productos
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          {' > '}
          <span className="text-blue-600 font-semibold">Catálogo</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8 gap-4">
          <div className="text-sm text-slate-500 font-medium">
            Se han encontrado <span className="text-slate-900 font-bold">{products.length}</span> productos disponibles
          </div>
          
          {isAdmin && (
            <Link
              href="/products/create"
              className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <span>+</span> Agregar Producto
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const price = Number(product.price) || 0;
            return (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>

                  <div className="relative w-full h-52 bg-slate-50 p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    <img
                      src={product.image_url || '/placeholder.png'}
                      alt={product.name}
                      className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border border-blue-500/20">
                      Oficial
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description || 'Sin descripción disponible para este producto.'}
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-blue-600">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">USD</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      Ver Detalle
                    </Link>

                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/products/${product.id}/edit`}
                          title="Editar producto"
                          className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors"
                        >
                          ✏️
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}