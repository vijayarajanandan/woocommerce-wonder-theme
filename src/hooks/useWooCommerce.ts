/**
 * React Query Hooks for WooCommerce
 * 
 * These hooks provide the same interface as your static data functions
 * but fetch from WooCommerce instead. Your components don't need to change!
 * 
 * Usage:
 * Replace: import { candles } from '@/data/candles'
 * With:    import { useProducts } from '@/hooks/useWooCommerce'
 *          const { data: candles, isLoading } = useProducts();
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  getFeaturedProducts,
  getProductsByCategory,
  getOnSaleProducts,
  searchProducts,
  getRelatedProducts,
  getCategories,
  getCategoryBySlug,
  createOrder,
  getOrder,
  getOrders,
  validateCoupon,
  getReviews,
  createReview,
  isWooCommerceConfigured,
} from '@/lib/woocommerce';
import {
  wcProductToCandle,
  wcProductsToCandles,
  wcCategoriesToCollections,
  wcCategoryToCollection,
} from '@/lib/woocommerce-mapper';
import type { Candle, Collection } from '@/types/candle';
import type { WCProductsQuery, WCAddress } from '@/types/woocommerce';

// Query keys for cache management
export const queryKeys = {
  products: ['products'] as const,
  product: (id: number) => ['product', id] as const,
  productBySlug: (slug: string) => ['product', 'slug', slug] as const,
  featuredProducts: ['products', 'featured'] as const,
  bestsellers: ['products', 'bestsellers'] as const,
  productsByCategory: (slug: string) => ['products', 'category', slug] as const,
  onSaleProducts: ['products', 'on-sale'] as const,
  searchProducts: (term: string) => ['products', 'search', term] as const,
  relatedProducts: (id: number) => ['products', 'related', id] as const,
  categories: ['categories'] as const,
  category: (slug: string) => ['category', slug] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['order', id] as const,
  reviews: (productId: number) => ['reviews', productId] as const,
  coupon: (code: string) => ['coupon', code] as const,
};

// ============================================
// PRODUCTS HOOKS
// ============================================

/**
 * Fetch all products (candles)
 */
export function useProducts(params?: WCProductsQuery) {
  return useQuery({
    queryKey: [...queryKeys.products, params],
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
export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id!),
    queryFn: async () => {
      const product = await getProduct(id!);
      return wcProductToCandle(product);
    },
    enabled: !!id && isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single product by slug
 */
export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.productBySlug(slug!),
    queryFn: async () => {
      const product = await getProductBySlug(slug!);
      return product ? wcProductToCandle(product) : null;
    },
    enabled: !!slug && isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [...queryKeys.featuredProducts, limit],
    queryFn: async () => {
      const products = await getFeaturedProducts(limit);
      return wcProductsToCandles(products);
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch bestsellers (tagged as bestseller or high sales + featured)
 */
export function useBestsellers(limit = 8) {
  return useQuery({
    queryKey: [...queryKeys.bestsellers, limit],
    queryFn: async () => {
      // First try to get products tagged as bestseller
      const { products } = await getProducts({
        tag: 'bestseller',
        per_page: limit,
        orderby: 'popularity',
        order: 'desc',
      });

      if (products.length > 0) {
        return wcProductsToCandles(products);
      }

      // Fallback: get most popular featured products
      const featured = await getFeaturedProducts(limit * 2);
      const sorted = featured.sort((a, b) => b.total_sales - a.total_sales);
      return wcProductsToCandles(sorted.slice(0, limit));
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(categorySlug: string | undefined, params?: Omit<WCProductsQuery, 'category'>) {
  return useQuery({
    queryKey: [...queryKeys.productsByCategory(categorySlug!), params],
    queryFn: async () => {
      const { products, total, totalPages } = await getProductsByCategory(categorySlug!, params);
      return {
        candles: wcProductsToCandles(products),
        total,
        totalPages,
      };
    },
    enabled: !!categorySlug && isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch products on sale
 */
export function useOnSaleProducts(limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.onSaleProducts, limit],
    queryFn: async () => {
      const products = await getOnSaleProducts(limit);
      return wcProductsToCandles(products);
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search products
 */
export function useSearchProducts(searchTerm: string, params?: Omit<WCProductsQuery, 'search'>) {
  return useQuery({
    queryKey: [...queryKeys.searchProducts(searchTerm), params],
    queryFn: async () => {
      const { products, total, totalPages } = await searchProducts(searchTerm, params);
      return {
        candles: wcProductsToCandles(products),
        total,
        totalPages,
      };
    },
    enabled: searchTerm.length > 2 && isWooCommerceConfigured(),
    staleTime: 30 * 1000, // 30 seconds for search results
  });
}

/**
 * Fetch related products
 */
export function useRelatedProducts(productId: number | undefined, limit = 4) {
  return useQuery({
    queryKey: [...queryKeys.relatedProducts(productId!), limit],
    queryFn: async () => {
      const products = await getRelatedProducts(productId!, limit);
      return wcProductsToCandles(products);
    },
    enabled: !!productId && isWooCommerceConfigured(),
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================
// CATEGORIES HOOKS
// ============================================

/**
 * Fetch all categories (collections)
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const categories = await getCategories();
      return wcCategoriesToCollections(categories);
    },
    enabled: isWooCommerceConfigured(),
    staleTime: 10 * 60 * 1000, // 10 minutes for categories
  });
}

/**
 * Fetch a single category by slug
 */
export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.category(slug!),
    queryFn: async () => {
      const category = await getCategoryBySlug(slug!);
      return category ? wcCategoryToCollection(category) : null;
    },
    enabled: !!slug && isWooCommerceConfigured(),
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================
// ORDERS HOOKS
// ============================================

interface CreateOrderParams {
  billing: WCAddress;
  shipping: WCAddress;
  lineItems: Array<{ productId: number; quantity: number }>;
  paymentMethod?: string;
  paymentMethodTitle?: string;
  customerNote?: string;
  couponCode?: string;
}

/**
 * Create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateOrderParams) => {
      const order = await createOrder({
        billing: params.billing,
        shipping: params.shipping,
        line_items: params.lineItems.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        payment_method: params.paymentMethod || 'cod',
        payment_method_title: params.paymentMethodTitle || 'Cash on Delivery',
        customer_note: params.customerNote,
        coupon_lines: params.couponCode ? [{ code: params.couponCode }] : undefined,
      });
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
}

/**
 * Fetch order by ID
 */
export function useOrder(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.order(id!),
    queryFn: () => getOrder(id!),
    enabled: !!id && isWooCommerceConfigured(),
  });
}

/**
 * Fetch user's orders
 */
export function useOrders(customerId?: number) {
  return useQuery({
    queryKey: [...queryKeys.orders, customerId],
    queryFn: () => getOrders(customerId ? { customer: customerId } : {}),
    enabled: isWooCommerceConfigured(),
  });
}

// ============================================
// COUPONS HOOKS
// ============================================

/**
 * Validate a coupon code
 */
export function useValidateCoupon(code: string | undefined) {
  return useQuery({
    queryKey: queryKeys.coupon(code!),
    queryFn: () => validateCoupon(code!),
    enabled: !!code && code.length > 2 && isWooCommerceConfigured(),
    staleTime: 60 * 1000, // 1 minute
    retry: false,
  });
}

// ============================================
// REVIEWS HOOKS
// ============================================

/**
 * Fetch product reviews
 */
export function useProductReviews(productId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews(productId!),
    queryFn: () => getReviews({ product: [productId!] }),
    enabled: !!productId && isWooCommerceConfigured(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Create a product review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      productId: number;
      review: string;
      reviewer: string;
      reviewerEmail: string;
      rating: number;
    }) => createReview({
      product_id: params.productId,
      review: params.review,
      reviewer: params.reviewer,
      reviewer_email: params.reviewerEmail,
      rating: params.rating,
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(variables.productId) });
    },
  });
}

// ============================================
// PREFETCH UTILITIES
// ============================================

/**
 * Prefetch product data for faster navigation
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();

  return async (slug: string) => {
    if (!isWooCommerceConfigured()) return;

    await queryClient.prefetchQuery({
      queryKey: queryKeys.productBySlug(slug),
      queryFn: async () => {
        const product = await getProductBySlug(slug);
        return product ? wcProductToCandle(product) : null;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get min/max price from products
 */
export function useProductPriceRange() {
  const { data } = useProducts({ per_page: 1, orderby: 'price', order: 'asc' });
  const { data: maxData } = useProducts({ per_page: 1, orderby: 'price', order: 'desc' });

  const minPrice = data?.candles[0]?.price || 0;
  const maxPrice = maxData?.candles[0]?.price || 10000;

  return { minPrice, maxPrice };
}
