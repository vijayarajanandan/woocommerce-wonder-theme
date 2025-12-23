export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  regularPrice?: number;
  onSale: boolean;
  description: string;
  shortDescription: string;
  images: string[];
  categories: string[];
  tags: string[];
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  stockQuantity?: number;
  sku: string;
  featured: boolean;
  averageRating: number;
  reviewCount: number;
  attributes?: ProductAttribute[];
  variations?: ProductVariation[];
}

export interface ProductAttribute {
  name: string;
  options: string[];
}

export interface ProductVariation {
  id: number;
  attributes: Record<string, string>;
  price: number;
  regularPrice?: number;
  stockStatus: 'instock' | 'outofstock';
  image?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: ProductVariation;
  selectedAttributes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}
