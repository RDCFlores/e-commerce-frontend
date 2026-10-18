'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

async function isAdmin(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return false;
    const user = await res.json();
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function createProductAction(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: 'Acceso denegado: Se requieren permisos de administrador' };
  }

  const token = await getToken();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const image_url = formData.get('image_url') as string;

  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, price, stock, image_url }),
  });

  const data = await res.json();
  if (!res.ok) return { error: data.message || 'Error al crear producto' };

  revalidatePath('/products');
  redirect('/products');
}

export async function updateProductAction(id: number, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: 'Acceso denegado: Se requieren permisos de administrador' };
  }

  const token = await getToken();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const image_url = formData.get('image_url') as string;

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, price, stock, image_url }),
  });

  const data = await res.json();
  if (!res.ok) return { error: data.message || 'Error al actualizar producto' };

  revalidatePath('/products');
  revalidatePath(`/products/${id}`);
  redirect('/products');
}

export async function deleteProductAction(id: number) {
  if (!(await isAdmin())) {
    return { error: 'Acceso denegado: Se requieren permisos de administrador' };
  }

  const token = await getToken();
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) return { error: 'Error al eliminar el producto' };

  revalidatePath('/products');
  return { success: true };
}