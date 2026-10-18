export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  user?: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  stock?: number;
}

export interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items?: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    product?: Product;
  }>;
}