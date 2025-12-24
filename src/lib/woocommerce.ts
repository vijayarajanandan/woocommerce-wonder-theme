/**
 * WooCommerce REST API Client
 * 
 * This client handles authentication and provides type-safe methods
 * for interacting with your WooCommerce store.
 * 
 * Setup:
 * 1. Add these to your .env file:
 *    VITE_WC_URL=https://backend.thescentora.com
 *    VITE_WC_CONSUMER_KEY=ck_xxxxxxxxxxxx
 *    VITE_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxx
 */

import type {
  WCProduct,
  WCProductCategory,
  WCOrder,
  WCCustomer,
  WCReview,
  WCProductsQuery,
  WCOrdersQuery,
  WCAddress,
} from '@/types/woocommerce';

// Environment variables
const WC_URL = import.meta.env.VITE_WC_URL || '';
const WC_CONSUMER_KEY = import.meta.env.VITE_WC_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET || '';

// Base API endpoint
const API_BASE = `${WC_URL}/wp-json/wc/v3`;

// Check if WooCommerce is configured
export const isWooCommerceConfigured = (): boolean => {
  return Boolean(WC_URL && WC_CONSUMER_KEY && WC_CONSUMER_SECRET);
};

// Create Basic Auth header
const getAuthHeader = (): string => {
  const credentials = btoa(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`);
  return `Basic ${credentials}`;
};

// Generic fetch function with error handling
async function wcFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; headers: Headers }> {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('WooCommerce API Error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
      url,
    });
    throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { data, headers: response.headers };
}

// Build query string from params object
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// ============================================
// PRODUCTS API
// ============================================

export async function getProducts(
  params: WCProductsQuery = {}
): Promise<{ products: WCProduct[]; total: number; totalPages: number }> {
  const query = buildQueryString({ per_page: 100, ...params });
  const { data, headers } = await wcFetch<WCProduct[]>(`/products${query}`);
  
  return {
    products: data,
    total: parseInt(headers.get('x-wp-total') || '0', 10),
    totalPages: parseInt(headers.get('x-wp-totalpages') || '1', 10),
  };
}

export async function getProduct(id: number): Promise<WCProduct> {
  const { data } = await wcFetch<WCProduct>(`/products/${id}`);
  return data;
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const { products } = await getProducts({ slug, per_page: 1 });
  return products[0] || null;
}

export async function getFeaturedProducts(limit = 8): Promise<WCProduct[]> {
  const { products } = await getProducts({ featured: true, per_page: limit });
  return products;
}

export async function getProductsByCategory(
  categorySlug: string,
  params: Omit<WCProductsQuery, 'category'> = {}
): Promise<{ products: WCProduct[]; total: number; totalPages: number }> {
  return getProducts({ ...params, category: categorySlug });
}

export async function getOnSaleProducts(limit = 20): Promise<WCProduct[]> {
  const { products } = await getProducts({ on_sale: true, per_page: limit });
  return products;
}

export async function searchProducts(
  searchTerm: string,
  params: Omit<WCProductsQuery, 'search'> = {}
): Promise<{ products: WCProduct[]; total: number; totalPages: number }> {
  return getProducts({ ...params, search: searchTerm });
}

export async function getRelatedProducts(productId: number, limit = 4): Promise<WCProduct[]> {
  const product = await getProduct(productId);
  if (!product.related_ids.length) return [];
  
  const { products } = await getProducts({
    include: product.related_ids.slice(0, limit),
  });
  return products;
}

// ============================================
// CATEGORIES API
// ============================================

export async function getCategories(
  params: { per_page?: number; parent?: number; hide_empty?: boolean } = {}
): Promise<WCProductCategory[]> {
  const query = buildQueryString({ per_page: 100, hide_empty: true, ...params });
  const { data } = await wcFetch<WCProductCategory[]>(`/products/categories${query}`);
  return data;
}

export async function getCategory(id: number): Promise<WCProductCategory> {
  const { data } = await wcFetch<WCProductCategory>(`/products/categories/${id}`);
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<WCProductCategory | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) || null;
}

// ============================================
// ORDERS API
// ============================================

export async function createOrder(orderData: {
  billing: WCAddress;
  shipping: WCAddress;
  line_items: Array<{ product_id: number; quantity: number }>;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  customer_note?: string;
  coupon_lines?: Array<{ code: string }>;
}): Promise<WCOrder> {
  const { data } = await wcFetch<WCOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
  return data;
}

export async function getOrder(id: number): Promise<WCOrder> {
  const { data } = await wcFetch<WCOrder>(`/orders/${id}`);
  return data;
}

export async function getOrders(params: WCOrdersQuery = {}): Promise<WCOrder[]> {
  const query = buildQueryString({ per_page: 100, ...params });
  const { data } = await wcFetch<WCOrder[]>(`/orders${query}`);
  return data;
}

export async function updateOrder(
  id: number,
  updates: Partial<WCOrder>
): Promise<WCOrder> {
  const { data } = await wcFetch<WCOrder>(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data;
}

// ============================================
// CUSTOMERS API
// ============================================

export async function createCustomer(customerData: {
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  password?: string;
  billing?: Partial<WCAddress>;
  shipping?: Partial<WCAddress>;
}): Promise<WCCustomer> {
  const { data } = await wcFetch<WCCustomer>('/customers', {
    method: 'POST',
    body: JSON.stringify(customerData),
  });
  return data;
}

export async function getCustomer(id: number): Promise<WCCustomer> {
  const { data } = await wcFetch<WCCustomer>(`/customers/${id}`);
  return data;
}

export async function updateCustomer(
  id: number,
  updates: Partial<WCCustomer>
): Promise<WCCustomer> {
  const { data } = await wcFetch<WCCustomer>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data;
}

// ============================================
// REVIEWS API
// ============================================

export async function getReviews(
  params: { product?: number[]; per_page?: number; page?: number } = {}
): Promise<WCReview[]> {
  const query = buildQueryString({ per_page: 100, ...params });
  const { data } = await wcFetch<WCReview[]>(`/products/reviews${query}`);
  return data;
}

export async function createReview(reviewData: {
  product_id: number;
  review: string;
  reviewer: string;
  reviewer_email: string;
  rating: number;
}): Promise<WCReview> {
  const { data } = await wcFetch<WCReview>('/products/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
  return data;
}

// ============================================
// COUPONS API
// ============================================

export interface WCCoupon {
  id: number;
  code: string;
  amount: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
  description: string;
  date_expires: string | null;
  usage_count: number;
  individual_use: boolean;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit: number | null;
  usage_limit_per_user: number | null;
  limit_usage_to_x_items: number | null;
  free_shipping: boolean;
  product_categories: number[];
  excluded_product_categories: number[];
  exclude_sale_items: boolean;
  minimum_amount: string;
  maximum_amount: string;
}

export async function validateCoupon(code: string): Promise<WCCoupon | null> {
  try {
    const query = buildQueryString({ code });
    const { data } = await wcFetch<WCCoupon[]>(`/coupons${query}`);
    return data[0] || null;
  } catch {
    return null;
  }
}

// ============================================
// SHIPPING API
// ============================================

export interface WCShippingZone {
  id: number;
  name: string;
  order: number;
}

export interface WCShippingMethod {
  instance_id: number;
  title: string;
  order: number;
  enabled: boolean;
  method_id: string;
  method_title: string;
  method_description: string;
  settings: Record<string, { value: string }>;
}

export async function getShippingZones(): Promise<WCShippingZone[]> {
  const { data } = await wcFetch<WCShippingZone[]>('/shipping/zones');
  return data;
}

export async function getShippingMethods(zoneId: number): Promise<WCShippingMethod[]> {
  const { data } = await wcFetch<WCShippingMethod[]>(`/shipping/zones/${zoneId}/methods`);
  return data;
}

// ============================================
// PAYMENT GATEWAYS API
// ============================================

export interface WCPaymentGateway {
  id: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  method_title: string;
  method_description: string;
  settings: Record<string, { value: string }>;
}

export async function getPaymentGateways(): Promise<WCPaymentGateway[]> {
  const { data } = await wcFetch<WCPaymentGateway[]>('/payment_gateways');
  return data.filter(g => g.enabled);
}

// ============================================
// UTILITY EXPORTS
// ============================================

export const woocommerce = {
  isConfigured: isWooCommerceConfigured,
  products: {
    getAll: getProducts,
    get: getProduct,
    getBySlug: getProductBySlug,
    getFeatured: getFeaturedProducts,
    getByCategory: getProductsByCategory,
    getOnSale: getOnSaleProducts,
    search: searchProducts,
    getRelated: getRelatedProducts,
  },
  categories: {
    getAll: getCategories,
    get: getCategory,
    getBySlug: getCategoryBySlug,
  },
  orders: {
    create: createOrder,
    get: getOrder,
    getAll: getOrders,
    update: updateOrder,
  },
  customers: {
    create: createCustomer,
    get: getCustomer,
    update: updateCustomer,
  },
  reviews: {
    getAll: getReviews,
    create: createReview,
  },
  coupons: {
    validate: validateCoupon,
  },
  shipping: {
    getZones: getShippingZones,
    getMethods: getShippingMethods,
  },
  payment: {
    getGateways: getPaymentGateways,
  },
};

export default woocommerce;
