/**
 * WooCommerce React Query Hooks
 * 
 * Provides typed React Query hooks for all WooCommerce API operations.
 * Uses the woocommerce.ts client and woocommerce-mapper.ts for type conversion.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  getProduct,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  getCategories,
  getCategoryBySlug,
  createOrder,
  getOrder,
  validateCoupon,
  isWooCommerceConfigured,
  searchProducts,
} from "@/lib/woocommerce";
import {
  wcProductToCandle,
  wcProductsToCandles,
  wcCategoriesToCollections,
} from "@/lib/woocommerce-mapper";
import type { Candle, Collection } from "@/types/candle";
import type { WCProductsQuery, WCAddress, WCOrder, WCCoupon } from "@/types/woocommerce";

// ============================================
// QUERY KEYS
// ============================================

export const wcQueryKeys = {
  products: {
    all: ["wc-products"] as const,
    list: (params: WCProductsQuery) => ["wc-products", "list", params] as const,
    detail: (id: number) => ["wc-products", "detail", id] as const,
    bySlug: (slug: string) => ["wc-products", "slug", slug] as const,
    featured: (limit: number) => ["wc-products", "featured", limit] as const,
    bestsellers: (limit: number) => ["wc-products", "bestsellers", limit] as const,
    related: (id: number, limit: number) => ["wc-products", "related", id, limit] as const,
    search: (term: string, limit: number) => ["wc-products", "search", term, limit] as const,
  },
  categories: {
    all: ["wc-categories"] as const,
    detail: (id: number) => ["wc-categories", "detail", id] as const,
    bySlug: (slug: string) => ["wc-categories", "slug", slug] as const,
  },
  orders: {
    detail: (id: number) => ["wc-orders", "detail", id] as const,
  },
  coupons: {
    validate: (code: string) => ["wc-coupons", "validate", code] as const,
  },
};

// ============================================
// PRODUCT HOOKS
// ============================================

/**
 * Fetch all products with optional filters
 */
export function useProducts(params: WCProductsQuery = {}) {
  return useQuery({
    queryKey: wcQueryKeys.products.list(params),
    queryFn: async () => {
      const { products, total, totalPages } = await getProducts(params);
      return {
        candles: wcProductsToCandles(products),
        total,
        totalPages,
      };
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single product by ID
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: wcQueryKeys.products.detail(id),
    queryFn: async () => {
      const product = await getProduct(id);
      return wcProductToCandle(product);
    },
    enabled: isWooCommerceConfigured() && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single product by slug
 */
export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: wcQueryKeys.products.bySlug(slug || ""),
    queryFn: async (): Promise<Candle | null> => {
      if (!slug) return null;
      const product = await getProductBySlug(slug);
      return product ? wcProductToCandle(product) : null;
    },
    enabled: isWooCommerceConfigured() && Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: wcQueryKeys.products.featured(limit),
    queryFn: async () => {
      const products = await getFeaturedProducts(limit);
      return wcProductsToCandles(products);
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch bestseller products
 * Bestsellers are products tagged with 'bestseller' or have high sales + featured
 */
export function useBestsellerProducts(limit = 8) {
  return useQuery({
    queryKey: wcQueryKeys.products.bestsellers(limit),
    queryFn: async () => {
      // First try to get products tagged as bestseller
      const { products } = await getProducts({
        per_page: limit,
        tag: 'bestseller',
        orderby: 'popularity',
        order: 'desc',
      });

      // If no tagged products, fall back to most popular featured products
      if (products.length === 0) {
        const { products: popularProducts } = await getProducts({
          per_page: limit,
          orderby: 'popularity',
          order: 'desc',
        });
        return wcProductsToCandles(popularProducts);
      }

      return wcProductsToCandles(products);
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch related products for a given product
 */
export function useRelatedProducts(productId: number | undefined, limit = 4) {
  return useQuery({
    queryKey: wcQueryKeys.products.related(productId || 0, limit),
    queryFn: async () => {
      if (!productId) return [];
      const products = await getRelatedProducts(productId, limit);
      return wcProductsToCandles(products);
    },
    enabled: isWooCommerceConfigured() && Boolean(productId),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search products by term
 */
export function useSearchProducts(searchTerm: string, limit = 10) {
  return useQuery({
    queryKey: wcQueryKeys.products.search(searchTerm, limit),
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      const { products } = await searchProducts(searchTerm, { per_page: limit });
      return wcProductsToCandles(products);
    },
    enabled: isWooCommerceConfigured() && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}

// ============================================
// CATEGORY HOOKS
// ============================================

/**
 * Fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: wcQueryKeys.categories.all,
    queryFn: async () => {
      const categories = await getCategories({ hide_empty: true });
      return wcCategoriesToCollections(categories);
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch a category by slug
 */
export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: wcQueryKeys.categories.bySlug(slug || ""),
    queryFn: async (): Promise<Collection | null> => {
      if (!slug) return null;
      const category = await getCategoryBySlug(slug);
      if (!category) return null;
      return wcCategoriesToCollections([category])[0];
    },
    enabled: isWooCommerceConfigured() && Boolean(slug),
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================
// ORDER HOOKS
// ============================================

/**
 * Parameters for creating a WooCommerce order
 * 
 * The line_items include fallback fields (price, name, sku, etc.) that are used
 * by the PHP backend when WooCommerce product lookup fails. This ensures correct
 * pricing even if the product ID doesn't exist in WooCommerce.
 */
interface CreateOrderParams {
  billing: WCAddress;
  shipping: WCAddress;
  line_items: Array<{
    product_id: number;
    quantity: number;
    // Fallback fields - used when WooCommerce product lookup fails
    price?: number;
    name?: string;
    sku?: string;
    image?: string;
    collection?: string;
    size?: string;
  }>;
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  customer_note?: string;
  coupon_lines?: Array<{ code: string }>;
  shipping_cost?: number;
}

/**
 * Create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderParams) => {
      return createOrder(orderData);
    },
    onSuccess: () => {
      // Invalidate products to refresh stock levels
      queryClient.invalidateQueries({ queryKey: wcQueryKeys.products.all });
    },
  });
}

/**
 * Fetch order by ID
 */
export function useOrder(id: number) {
  return useQuery({
    queryKey: wcQueryKeys.orders.detail(id),
    queryFn: async () => {
      return getOrder(id);
    },
    enabled: isWooCommerceConfigured() && id > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// ============================================
// COUPON HOOKS
// ============================================

/**
 * Validate a coupon code
 */
export function useValidateCoupon() {
  return useMutation({
    mutationFn: async (code: string) => {
      return validateCoupon(code);
    },
  });
}

// ============================================
// PREFETCH UTILITIES
// ============================================

/**
 * Prefetch products for faster navigation
 */
export function usePrefetchProducts(queryClient: ReturnType<typeof useQueryClient>) {
  return (params: WCProductsQuery = {}) => {
    queryClient.prefetchQuery({
      queryKey: wcQueryKeys.products.list(params),
      queryFn: async () => {
        const { products, total, totalPages } = await getProducts(params);
        return {
          candles: wcProductsToCandles(products),
          total,
          totalPages,
        };
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Prefetch a single product by slug
 */
export function usePrefetchProductBySlug(queryClient: ReturnType<typeof useQueryClient>) {
  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: wcQueryKeys.products.bySlug(slug),
      queryFn: async () => {
        const product = await getProductBySlug(slug);
        return product ? wcProductToCandle(product) : null;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

// ============================================
// EXPORT ALL HOOKS
// ============================================

export default {
  // Products
  useProducts,
  useProduct,
  useProductBySlug,
  useFeaturedProducts,
  useBestsellerProducts,
  useRelatedProducts,
  useSearchProducts,
  // Categories
  useCategories,
  useCategoryBySlug,
  // Orders
  useCreateOrder,
  useOrder,
  // Coupons
  useValidateCoupon,
  // Utils
  usePrefetchProducts,
  usePrefetchProductBySlug,
  // Keys
  wcQueryKeys,
};