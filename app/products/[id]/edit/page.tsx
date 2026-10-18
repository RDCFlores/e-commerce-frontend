import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded-lg shadow-sm my-8">
      <h1 className="text-2xl font-bold mb-6">Editar Producto #{product.id}</h1>
      <EditProductForm product={product} />
    </div>
  );
}