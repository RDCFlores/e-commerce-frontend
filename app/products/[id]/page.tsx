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
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb / Navegación Superior */}
        <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span>&gt;</span>
          <Link href="/products" className="hover:text-blue-600 transition-colors">Catálogo</Link>
          <span>&gt;</span>
          <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Tarjeta Principal Blanca */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Columna Izquierda: Imagen del Producto */}
            <div className="lg:col-span-6 bg-slate-50/60 rounded-xl p-6 sm:p-8 flex items-center justify-center min-h-[380px] border border-slate-100">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-h-[360px] w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400 gap-2">
                  <span className="text-5xl">📦</span>
                  <span className="text-xs font-medium">Sin Imagen Disponible</span>
                </div>
              )}
            </div>

            {/* Columna Derecha: Información y Acciones */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              
              {/* Marca e Identificador (Opcional) */}
              <div>
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-md border border-blue-100 mb-2">
                  Oficial
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Estrellas de Reseñas */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400 text-sm">
                    ★ ★ ★ ★ ★
                  </div>
                  <span className="text-xs text-slate-400 font-medium">(5.0 Reseñas)</span>
                </div>

                {/* Precio */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">USD</span>
                </div>
              </div>

              {/* Banner de Stock en Sucursales / Estado (Estilo Logitech de la imagen) */}
              <div className="bg-slate-100/70 border border-slate-200/60 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  EN STOCK disponible para envío inmediato
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Garantía directa de tienda. Recíbelo en tu domicilio en 24 a 48 horas hábiles.
                </p>
              </div>

              {/* Descripción breve del producto */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Descripción del Producto
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {product.description || 'Sin descripción disponible para este producto.'}
                </p>
              </div>

              {/* Botón de Acción Principal (Agregar al Carrito) */}
              <div className="pt-2">
                <AddToCartButton product={product} />
              </div>

              {/* Tarjeta de Garantía y Envío */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center gap-4 text-xs text-slate-600">
                <div className="p-2.5 bg-white shadow-sm border border-slate-200 text-blue-600 rounded-lg text-lg">
                  🚚
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Envío Gratis y Seguro</p>
                  <p className="text-slate-500 mt-0.5">Seguimiento en tiempo real al completar la orden.</p>
                </div>
              </div>

              {/* Panel Administrativo (Solo visible para Admin) */}
              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
                      Acciones Administrativas
                    </h4>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
                      >
                        Editar Producto
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}