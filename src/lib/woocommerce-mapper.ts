/**
 * WooCommerce to Candle Type Mapper
 * 
 * This file converts WooCommerce API responses to your app's Candle type.
 * Your UI components don't need to change at all - they continue using 
 * the same Candle interface.
 * 
 * WooCommerce Custom Fields Setup:
 * To fully support your Candle type, add these meta fields to WooCommerce products:
 * - _tagline: Product tagline
 * - _burn_time: e.g., "50-60 hours"
 * - _fragrance_top: Comma-separated top notes
 * - _fragrance_heart: Comma-separated heart notes
 * - _fragrance_base: Comma-separated base notes
 * 
 * You can add these using ACF (Advanced Custom Fields) or directly in WooCommerce.
 */

import type { WCProduct, WCProductCategory } from '@/types/woocommerce';
import type { Candle, Collection, FragranceNotes } from '@/types/candle';

// Helper to get meta field value
function getMeta(product: WCProduct, key: string): string {
  const meta = product.meta_data?.find(m => m.key === key);
  return typeof meta?.value === 'string' ? meta.value : '';
}

// Helper to parse comma-separated string to array
function parseNotes(value: string): string[] {
  if (!value) return [];
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

// Extract collection/category name from WC product
function getCollection(product: WCProduct): string {
  // Use the first category as the collection
  return product.categories?.[0]?.name || 'Uncategorized';
}

// Parse fragrance notes from meta fields or short description
function parseFragranceNotes(product: WCProduct): FragranceNotes {
  // First try meta fields
  const topMeta = getMeta(product, '_fragrance_top') || getMeta(product, 'fragrance_top');
  const heartMeta = getMeta(product, '_fragrance_heart') || getMeta(product, 'fragrance_heart');
  const baseMeta = getMeta(product, '_fragrance_base') || getMeta(product, 'fragrance_base');

  if (topMeta || heartMeta || baseMeta) {
    return {
      top: parseNotes(topMeta),
      heart: parseNotes(heartMeta),
      base: parseNotes(baseMeta),
    };
  }

  // Fallback: try to parse from short description
  // Expected format: "Top: Note1, Note2 | Heart: Note3 | Base: Note4, Note5"
  const desc = product.short_description || '';
  const notes: FragranceNotes = { top: [], heart: [], base: [] };

  const topMatch = desc.match(/top:?\s*([^|]+)/i);
  const heartMatch = desc.match(/heart:?\s*([^|]+)/i);
  const baseMatch = desc.match(/base:?\s*([^|]+)/i);

  if (topMatch) notes.top = parseNotes(topMatch[1]);
  if (heartMatch) notes.heart = parseNotes(heartMatch[1]);
  if (baseMatch) notes.base = parseNotes(baseMatch[1]);

  // If nothing found, provide defaults
  if (!notes.top.length && !notes.heart.length && !notes.base.length) {
    notes.top = ['Fresh'];
    notes.heart = ['Floral'];
    notes.base = ['Woody'];
  }

  return notes;
}

// Get size label from weight or dimensions
function getSize(product: WCProduct): string {
  const sizeMeta = getMeta(product, '_size') || getMeta(product, 'size');
  if (sizeMeta) return sizeMeta;

  // Try to determine from weight
  const weightNum = parseFloat(product.weight || '0');
  if (weightNum > 0) {
    if (weightNum <= 150) return 'Small';
    if (weightNum <= 250) return 'Medium';
    return 'Large';
  }

  return 'Standard';
}

// Get weight display string
function getWeight(product: WCProduct): string {
  const weightMeta = getMeta(product, '_display_weight') || getMeta(product, 'display_weight');
  if (weightMeta) return weightMeta;

  if (product.weight) {
    return `${product.weight}g`;
  }

  return '200g';
}

// Get burn time from meta or estimate from weight
function getBurnTime(product: WCProduct): string {
  const burnMeta = getMeta(product, '_burn_time') || getMeta(product, 'burn_time');
  if (burnMeta) return burnMeta;

  // Estimate: roughly 5-7 hours per ounce (28g)
  const weightNum = parseFloat(product.weight || '200');
  const minHours = Math.round(weightNum / 28 * 5);
  const maxHours = Math.round(weightNum / 28 * 7);
  return `${minHours}-${maxHours} hours`;
}

// Check if product is a bestseller
function isBestseller(product: WCProduct): boolean {
  // Check meta field
  const bestsellerMeta = getMeta(product, '_bestseller') || getMeta(product, 'bestseller');
  if (bestsellerMeta === 'yes' || bestsellerMeta === '1' || bestsellerMeta === 'true') {
    return true;
  }

  // Check tags
  if (product.tags?.some(t => t.slug === 'bestseller' || t.name.toLowerCase() === 'bestseller')) {
    return true;
  }

  // Check if featured and has high sales
  if (product.featured && product.total_sales > 10) {
    return true;
  }

  return false;
}

// Strip HTML tags from description
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Convert a WooCommerce product to a Candle object
 */
export function wcProductToCandle(product: WCProduct): Candle {
  const price = parseFloat(product.price || '0');
  const regularPrice = product.regular_price ? parseFloat(product.regular_price) : undefined;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    collection: getCollection(product),
    price: price,
    regularPrice: product.on_sale && regularPrice ? regularPrice : undefined,
    tagline: getMeta(product, '_tagline') || getMeta(product, 'tagline') || stripHtml(product.short_description || '').slice(0, 100) || '',
    description: stripHtml(product.description || product.short_description || ''),
    images: product.images?.map(img => img.src) || [],
    fragranceNotes: parseFragranceNotes(product),
    weight: getWeight(product),
    size: getSize(product),
    burnTime: getBurnTime(product),
    stockStatus: product.stock_status,
    bestseller: isBestseller(product),
    onSale: product.on_sale,
    featured: product.featured,
    sku: product.sku,
    categories: product.categories?.map(c => c.name) || [],
    rating: parseFloat(product.average_rating || '0'),
    reviewCount: product.rating_count || 0,
  };
}

/**
 * Convert multiple WooCommerce products to Candles
 */
export function wcProductsToCandles(products: WCProduct[]): Candle[] {
  return products.map(wcProductToCandle);
}

/**
 * Convert a WooCommerce category to a Collection object
 */
export function wcCategoryToCollection(category: WCProductCategory): Collection {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: stripHtml(category.description || ''),
    image: category.image?.src || '/placeholder-collection.jpg',
    productCount: category.count,
  };
}

/**
 * Convert multiple WooCommerce categories to Collections
 */
export function wcCategoriesToCollections(categories: WCProductCategory[]): Collection[] {
  return categories.map(wcCategoryToCollection);
}

/**
 * Convert a Candle back to WooCommerce product format (for creating/updating)
 */
export function candleToWCProduct(candle: Partial<Candle>): Partial<WCProduct> {
  const meta_data: Array<{ key: string; value: string }> = [];

  if (candle.tagline) {
    meta_data.push({ key: '_tagline', value: candle.tagline });
  }
  if (candle.burnTime) {
    meta_data.push({ key: '_burn_time', value: candle.burnTime });
  }
  if (candle.fragranceNotes) {
    meta_data.push({ key: '_fragrance_top', value: candle.fragranceNotes.top.join(', ') });
    meta_data.push({ key: '_fragrance_heart', value: candle.fragranceNotes.heart.join(', ') });
    meta_data.push({ key: '_fragrance_base', value: candle.fragranceNotes.base.join(', ') });
  }
  if (candle.bestseller) {
    meta_data.push({ key: '_bestseller', value: 'yes' });
  }
  if (candle.size) {
    meta_data.push({ key: '_size', value: candle.size });
  }
  if (candle.weight) {
    meta_data.push({ key: '_display_weight', value: candle.weight });
  }

  return {
    name: candle.name,
    slug: candle.slug,
    regular_price: candle.regularPrice?.toString(),
    sale_price: candle.onSale ? candle.price?.toString() : undefined,
    description: candle.description,
    short_description: candle.tagline,
    stock_status: candle.stockStatus,
    featured: candle.featured,
    sku: candle.sku,
    meta_data: meta_data as any,
  };
}

export default {
  productToCandle: wcProductToCandle,
  productsToCandles: wcProductsToCandles,
  categoryToCollection: wcCategoryToCollection,
  categoriesToCollections: wcCategoriesToCollections,
  candleToProduct: candleToWCProduct,
};
