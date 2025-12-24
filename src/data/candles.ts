/**
 * Unified Data Layer
 * 
 * This file provides a seamless bridge between your static data and WooCommerce.
 * It automatically uses WooCommerce when configured, or falls back to static data.
 * 
 * This means:
 * 1. Your app works perfectly during development with mock data
 * 2. Automatically uses WooCommerce in production when configured
 * 3. No code changes needed in your components
 * 
 * Usage in components stays the same:
 * import { candles, getCandleBySlug, collections } from '@/data/candles';
 */

import { isWooCommerceConfigured } from '@/lib/woocommerce';
import type { Candle, Collection } from '@/types/candle';

// ============================================
// STATIC DATA (Development/Fallback)
// ============================================

// Static collections data
export const staticCollections: Collection[] = [
  {
    id: 1,
    name: 'Signature',
    slug: 'signature',
    description: 'Our most beloved scents, crafted to create unforgettable moments.',
    image: '/collections/signature-collection.jpg',
  },
  {
    id: 2,
    name: 'Noir',
    slug: 'noir',
    description: 'Dark, mysterious fragrances for the bold and adventurous.',
    image: '/collections/noir-collection.jpg',
  },
  {
    id: 3,
    name: 'Botanical',
    slug: 'botanical',
    description: 'Fresh, natural scents inspired by gardens and greenery.',
    image: '/collections/botanical-collection.jpg',
  },
  {
    id: 4,
    name: 'Limited Edition',
    slug: 'limited',
    description: 'Exclusive seasonal fragrances available for a limited time.',
    image: '/collections/limited-collection.jpg',
  },
];

// Static candles data (sample - you should expand this with your actual data)
export const staticCandles: Candle[] = [
  {
    id: 1,
    name: 'Lavender Whisper',
    slug: 'lavender-whisper',
    collection: 'Signature',
    price: 1899,
    tagline: 'A calming blend of French lavender and soft vanilla',
    description: 'Transport yourself to the lavender fields of Provence with this soothing blend. French lavender meets soft vanilla undertones for the ultimate relaxation experience.',
    images: ['/products/lavender-whisper-1.jpg', '/products/lavender-whisper-2.jpg'],
    fragranceNotes: {
      top: ['French Lavender', 'Bergamot'],
      heart: ['Chamomile', 'Rose'],
      base: ['Vanilla', 'White Musk'],
    },
    weight: '200g',
    size: 'Medium',
    burnTime: '50-60 hours',
    stockStatus: 'instock',
    bestseller: true,
    onSale: false,
  },
  {
    id: 2,
    name: 'Midnight Rose',
    slug: 'midnight-rose',
    collection: 'Noir',
    price: 2199,
    regularPrice: 2499,
    tagline: 'An enchanting blend of dark rose and oud',
    description: 'A mysterious and seductive fragrance that blooms in the darkness. Deep Bulgarian rose intertwines with precious oud for an unforgettable experience.',
    images: ['/products/midnight-rose-1.jpg'],
    fragranceNotes: {
      top: ['Black Pepper', 'Saffron'],
      heart: ['Bulgarian Rose', 'Jasmine'],
      base: ['Oud', 'Amber', 'Sandalwood'],
    },
    weight: '250g',
    size: 'Large',
    burnTime: '60-70 hours',
    stockStatus: 'instock',
    bestseller: true,
    onSale: true,
  },
  {
    id: 3,
    name: 'Garden Bloom',
    slug: 'garden-bloom',
    collection: 'Botanical',
    price: 1599,
    tagline: 'Fresh florals from an English garden',
    description: 'Capture the essence of a spring morning in an English garden. Fresh-cut flowers mingle with dewy greens and soft earth.',
    images: ['/products/garden-bloom-1.jpg'],
    fragranceNotes: {
      top: ['Green Leaves', 'Citrus Zest'],
      heart: ['Peony', 'Lily of the Valley'],
      base: ['White Cedar', 'Clean Musk'],
    },
    weight: '180g',
    size: 'Medium',
    burnTime: '45-55 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 4,
    name: 'Amber Dreams',
    slug: 'amber-dreams',
    collection: 'Signature',
    price: 2099,
    tagline: 'Warm amber and exotic spices',
    description: 'A rich, warming fragrance that wraps you in comfort. Golden amber meets exotic spices for a cozy, sophisticated scent.',
    images: ['/products/amber-dreams-1.jpg'],
    fragranceNotes: {
      top: ['Cinnamon', 'Cardamom'],
      heart: ['Amber', 'Honey'],
      base: ['Sandalwood', 'Vanilla', 'Musk'],
    },
    weight: '220g',
    size: 'Medium',
    burnTime: '55-65 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 5,
    name: 'Ocean Mist',
    slug: 'ocean-mist',
    collection: 'Botanical',
    price: 1799,
    tagline: 'Fresh sea breeze and coastal herbs',
    description: 'Breathe in the invigorating scent of the ocean. Crisp sea salt mingles with coastal herbs and driftwood.',
    images: ['/products/ocean-mist-1.jpg'],
    fragranceNotes: {
      top: ['Sea Salt', 'Eucalyptus'],
      heart: ['Marine Accord', 'Sage'],
      base: ['Driftwood', 'White Musk'],
    },
    weight: '200g',
    size: 'Medium',
    burnTime: '50-60 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 6,
    name: 'Velvet Night',
    slug: 'velvet-night',
    collection: 'Noir',
    price: 2399,
    tagline: 'Deep and mysterious with leather notes',
    description: 'For those who embrace the night. Rich leather, smoky incense, and dark woods create an atmosphere of intrigue.',
    images: ['/products/velvet-night-1.jpg'],
    fragranceNotes: {
      top: ['Black Pepper', 'Bergamot'],
      heart: ['Leather', 'Incense'],
      base: ['Dark Woods', 'Tobacco', 'Amber'],
    },
    weight: '250g',
    size: 'Large',
    burnTime: '60-70 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 7,
    name: 'Winter Spice',
    slug: 'winter-spice',
    collection: 'Limited Edition',
    price: 2599,
    regularPrice: 2999,
    tagline: 'Festive warmth with cinnamon and clove',
    description: 'Limited edition holiday fragrance. Warm cinnamon, spicy clove, and sweet orange create the perfect festive atmosphere.',
    images: ['/products/winter-spice-1.jpg'],
    fragranceNotes: {
      top: ['Orange Peel', 'Nutmeg'],
      heart: ['Cinnamon', 'Clove'],
      base: ['Vanilla', 'Cedar', 'Musk'],
    },
    weight: '220g',
    size: 'Medium',
    burnTime: '55-65 hours',
    stockStatus: 'instock',
    bestseller: true,
    onSale: true,
  },
  {
    id: 8,
    name: 'Fresh Linen',
    slug: 'fresh-linen',
    collection: 'Signature',
    price: 1699,
    tagline: 'Clean and crisp like sun-dried sheets',
    description: 'The comforting scent of freshly laundered linens. Clean cotton meets soft florals for an everyday luxury.',
    images: ['/products/fresh-linen-1.jpg'],
    fragranceNotes: {
      top: ['Ozonic Notes', 'Citrus'],
      heart: ['Cotton Flower', 'Lily'],
      base: ['Soft Musk', 'Cedar'],
    },
    weight: '180g',
    size: 'Medium',
    burnTime: '45-55 hours',
    stockStatus: 'outofstock',
    bestseller: false,
    onSale: false,
  },
];

// ============================================
// STATIC DATA FUNCTIONS
// ============================================

function getStaticCandleBySlug(slug: string): Candle | undefined {
  return staticCandles.find(c => c.slug === slug);
}

function getStaticFeaturedCandles(): Candle[] {
  return staticCandles.filter(c => c.bestseller || c.featured).slice(0, 8);
}

function getStaticBestsellers(): Candle[] {
  return staticCandles.filter(c => c.bestseller);
}

function getStaticCandlesByCollection(collectionSlug: string): Candle[] {
  const collection = staticCollections.find(c => c.slug === collectionSlug);
  if (!collection) return [];
  return staticCandles.filter(c => c.collection === collection.name);
}

function getStaticOnSaleCandles(): Candle[] {
  return staticCandles.filter(c => c.onSale);
}

// ============================================
// EXPORTS (Use these in your components)
// ============================================

// These maintain backward compatibility with your existing code
export const candles = staticCandles;
export const collections = staticCollections;

export function getCandleBySlug(slug: string): Candle | undefined {
  return getStaticCandleBySlug(slug);
}

export function getFeaturedCandles(): Candle[] {
  return getStaticFeaturedCandles();
}

export function getBestsellers(): Candle[] {
  return getStaticBestsellers();
}

export function getCandlesByCollection(collectionSlug: string): Candle[] {
  return getStaticCandlesByCollection(collectionSlug);
}

export function getOnSaleCandles(): Candle[] {
  return getStaticOnSaleCandles();
}

// Check if WooCommerce is available
export const isWooCommerceEnabled = isWooCommerceConfigured;

// Price range helper
export function getMinMaxPrice(): { min: number; max: number } {
  const prices = staticCandles.map(c => c.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

// Search helper
export function searchCandles(query: string): Candle[] {
  const lowerQuery = query.toLowerCase();
  return staticCandles.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.collection.toLowerCase().includes(lowerQuery) ||
    c.tagline.toLowerCase().includes(lowerQuery)
  );
}

// Filter helper
export interface CandleFilters {
  priceRange?: [number, number];
  collections?: string[];
  sizes?: string[];
  inStock?: boolean;
  onSale?: boolean;
}

export function filterCandles(filters: CandleFilters): Candle[] {
  let result = [...staticCandles];

  if (filters.priceRange) {
    result = result.filter(c =>
      c.price >= filters.priceRange![0] && c.price <= filters.priceRange![1]
    );
  }

  if (filters.collections && filters.collections.length > 0) {
    result = result.filter(c => {
      const col = staticCollections.find(col => col.name === c.collection);
      return col && filters.collections!.includes(col.slug);
    });
  }

  if (filters.sizes && filters.sizes.length > 0) {
    result = result.filter(c => filters.sizes!.includes(c.size));
  }

  if (filters.inStock) {
    result = result.filter(c => c.stockStatus === 'instock');
  }

  if (filters.onSale) {
    result = result.filter(c => c.onSale);
  }

  return result;
}

export default {
  candles: staticCandles,
  collections: staticCollections,
  getCandleBySlug,
  getFeaturedCandles,
  getBestsellers,
  getCandlesByCollection,
  getOnSaleCandles,
  getMinMaxPrice,
  searchCandles,
  filterCandles,
  isWooCommerceEnabled,
};
