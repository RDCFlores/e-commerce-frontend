'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function checkoutAction(cartItems: Array<{ product_id: number; quantity: number }>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { error: 'Debes iniciar sesión para realizar una compra' };
  }

  try {
    const res = await fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ 
          "payment_method_id": "pm_card_visa",
          "items": cartItems 
        }
      ),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || 'Error al procesar la orden' };
    }

    revalidatePath('/my-orders');

    return { success: true, redirectUrl: data.checkout_url || data.url || null, order: data };
  } catch (error) {
    return { error: 'Error de red al intentar procesar el pago' };
  }
}