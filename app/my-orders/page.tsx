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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Órdenes de Compra</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg border text-center">
          <p className="text-gray-600 mb-4">Aún no has realizado ninguna compra.</p>
          <Link
            href="/products"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <span className="text-sm font-semibold text-gray-500">Orden #{order.id}</span>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 uppercase">
                    {order.status || 'Completada'}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${Number(order.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Productos:</h4>
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-2 flex justify-between text-sm">
                        <span>
                          {item.product?.name || `Producto #${item.product_id}`} x {item.quantity}
                        </span>
                        <span className="font-medium text-gray-700">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}