import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Order } from '@/types';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getMyOrders(): Promise<Order[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
 
  if (!token) {
    redirect('/login');
  }

  const res = await fetch(`${API_URL}/my-orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 401) {
      redirect('/login');
    }
    throw new Error('Error al obtener el historial de órdenes');
  }

  return res.json();
}

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      
      <div className="bg-white border-b border-slate-200 py-10 px-4 text-center shadow-sm mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-wide">
          Mis Órdenes de Compra
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          {' > '}
          <span className="text-blue-600 font-semibold">Mis Órdenes</span>
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              📦
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Aún no tienes compras</h2>
            <p className="text-slate-500 text-sm mb-6">Explora nuestro catálogo y realiza tu primera orden.</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const totalAmount = Number(order.total_amount) || 0;
              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">Orden #{order.id}</span>
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase">
                          {order.status || 'Completada'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Fecha:{' '}
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Pagado</span>
                      <span className="text-xl font-extrabold text-blue-600">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Productos Adquiridos:
                      </h4>
                      <ul className="divide-y divide-slate-100 bg-slate-50/60 rounded-xl p-4 border border-slate-100">
                        {order.items.map((item) => {
                          const itemPrice = Number(item.price) || 0;
                          return (
                            <li key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-sm">
                              <span className="font-medium text-slate-700">
                                {item.product?.name || `Producto #${item.product_id}`} 
                                <span className="text-slate-400 text-xs ml-2">x {item.quantity}</span>
                              </span>
                              <span className="font-bold text-slate-900">
                                ${(itemPrice * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}