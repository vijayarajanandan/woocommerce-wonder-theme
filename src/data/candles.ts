/**
 * Candle Products Data
 * Using the actual generated product images
 */

import type { Candle, Collection } from '@/types/candle';

// Import product images
import lavenderWhisper1 from '@/assets/products/lavender-whisper-1-enhanced.jpg';
import lavenderWhisper2 from '@/assets/products/lavender-whisper-2-enhanced.jpg';
import midnightJasmine1 from '@/assets/products/midnight-jasmine-1-enhanced.jpg';
import midnightJasmine2 from '@/assets/products/midnight-jasmine-2-enhanced.jpg';
import oceanBreeze1 from '@/assets/products/ocean-breeze-1-enhanced.jpg';
import oceanBreeze2 from '@/assets/products/ocean-breeze-2-enhanced.jpg';
import vanillaSunrise1 from '@/assets/products/vanilla-sunrise-1-enhanced.jpg';
import vanillaSunrise2 from '@/assets/products/vanilla-sunrise-2-enhanced.jpg';
import forestPine1 from '@/assets/products/forest-pine-1-enhanced.jpg';
import forestPine2 from '@/assets/products/forest-pine-2-enhanced.jpg';
import sakuraDream1 from '@/assets/products/sakura-dream-1-enhanced.jpg';
import sakuraDream2 from '@/assets/products/sakura-dream-2-enhanced.jpg';
import autumnSpice1 from '@/assets/products/autumn-spice-1-enhanced.jpg';
import autumnSpice2 from '@/assets/products/autumn-spice-2-enhanced.jpg';
import coffeeEmber1 from '@/assets/products/coffee-ember-1-enhanced.jpg';
import coffeeEmber2 from '@/assets/products/coffee-ember-2-enhanced.jpg';
import seasideSerenity1 from '@/assets/products/seaside-serenity-1-enhanced.jpg';
import seasideSerenity2 from '@/assets/products/seaside-serenity-2-enhanced.jpg';
import springMorning1 from '@/assets/products/spring-morning-1-enhanced.jpg';
import springMorning2 from '@/assets/products/spring-morning-2-enhanced.jpg';

// Import collection images
import signatureCollection from '@/assets/collections/signature-collection.jpg';
import noirCollection from '@/assets/collections/noir-collection.jpg';
import botanicalCollection from '@/assets/collections/botanical-collection.jpg';
import limitedCollection from '@/assets/collections/limited-collection.jpg';

// Collections
export const collections: Collection[] = [
  {
    id: 1,
    name: 'Signature',
    slug: 'signature',
    description: 'Our most beloved scents, crafted to create unforgettable moments.',
    image: signatureCollection,
  },
  {
    id: 2,
    name: 'Noir',
    slug: 'noir',
    description: 'Dark, mysterious fragrances for the bold and adventurous.',
    image: noirCollection,
  },
  {
    id: 3,
    name: 'Botanical',
    slug: 'botanical',
    description: 'Fresh, natural scents inspired by gardens and greenery.',
    image: botanicalCollection,
  },
  {
    id: 4,
    name: 'Limited Edition',
    slug: 'limited',
    description: 'Exclusive seasonal fragrances available for a limited time.',
    image: limitedCollection,
  },
];

// Candles
export const candles: Candle[] = [
  {
    id: 1,
    name: 'Lavender Whisper',
    slug: 'lavender-whisper',
    collection: 'Signature',
    price: 1899,
    tagline: 'A calming blend of French lavender and soft vanilla',
    description: 'Transport yourself to the lavender fields of Provence with this soothing blend. French lavender meets soft vanilla undertones for the ultimate relaxation experience.',
    images: [lavenderWhisper1, lavenderWhisper2],
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
    name: 'Midnight Jasmine',
    slug: 'midnight-jasmine',
    collection: 'Noir',
    price: 2199,
    regularPrice: 2499,
    tagline: 'An enchanting blend of night-blooming jasmine',
    description: 'A mysterious and seductive fragrance that blooms in the darkness. Deep jasmine intertwines with precious oud for an unforgettable experience.',
    images: [midnightJasmine1, midnightJasmine2],
    fragranceNotes: {
      top: ['Black Pepper', 'Saffron'],
      heart: ['Night Jasmine', 'Tuberose'],
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
    name: 'Ocean Breeze',
    slug: 'ocean-breeze',
    collection: 'Botanical',
    price: 1799,
    tagline: 'Fresh sea breeze and coastal herbs',
    description: 'Breathe in the invigorating scent of the ocean. Crisp sea salt mingles with coastal herbs and driftwood.',
    images: [oceanBreeze1, oceanBreeze2],
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
    id: 4,
    name: 'Vanilla Sunrise',
    slug: 'vanilla-sunrise',
    collection: 'Signature',
    price: 2099,
    tagline: 'Warm vanilla with hints of golden amber',
    description: 'A rich, warming fragrance that wraps you in comfort. Golden amber meets Madagascar vanilla for a cozy, sophisticated scent.',
    images: [vanillaSunrise1, vanillaSunrise2],
    fragranceNotes: {
      top: ['Bergamot', 'Orange Zest'],
      heart: ['Madagascar Vanilla', 'Honey'],
      base: ['Golden Amber', 'Sandalwood', 'Musk'],
    },
    weight: '220g',
    size: 'Medium',
    burnTime: '55-65 hours',
    stockStatus: 'instock',
    bestseller: true,
    onSale: false,
  },
  {
    id: 5,
    name: 'Forest Pine',
    slug: 'forest-pine',
    collection: 'Botanical',
    price: 1899,
    tagline: 'Fresh evergreen with earthy undertones',
    description: 'Step into a serene forest with this invigorating blend. Fresh pine needles meet earthy moss and cedar.',
    images: [forestPine1, forestPine2],
    fragranceNotes: {
      top: ['Pine Needles', 'Eucalyptus'],
      heart: ['Cedar', 'Juniper'],
      base: ['Moss', 'Vetiver', 'Musk'],
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
    name: 'Sakura Dream',
    slug: 'sakura-dream',
    collection: 'Limited Edition',
    price: 2399,
    regularPrice: 2699,
    tagline: 'Delicate cherry blossom and soft musk',
    description: 'Capture the fleeting beauty of spring in Japan. Delicate cherry blossoms float on a base of soft musk and rice paper.',
    images: [sakuraDream1, sakuraDream2],
    fragranceNotes: {
      top: ['Cherry Blossom', 'Pear'],
      heart: ['Rose', 'Peony'],
      base: ['White Musk', 'Rice Paper', 'Sandalwood'],
    },
    weight: '250g',
    size: 'Large',
    burnTime: '60-70 hours',
    stockStatus: 'instock',
    bestseller: true,
    onSale: true,
  },
  {
    id: 7,
    name: 'Autumn Spice',
    slug: 'autumn-spice',
    collection: 'Limited Edition',
    price: 2199,
    tagline: 'Warm cinnamon and spiced apple',
    description: 'Embrace the cozy warmth of autumn. Cinnamon, clove, and spiced apple create the perfect fall atmosphere.',
    images: [autumnSpice1, autumnSpice2],
    fragranceNotes: {
      top: ['Cinnamon', 'Apple'],
      heart: ['Clove', 'Nutmeg'],
      base: ['Vanilla', 'Caramel', 'Cedar'],
    },
    weight: '220g',
    size: 'Medium',
    burnTime: '55-65 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 8,
    name: 'Coffee Ember',
    slug: 'coffee-ember',
    collection: 'Noir',
    price: 2299,
    tagline: 'Rich espresso with smoky undertones',
    description: 'For those who embrace bold experiences. Rich coffee meets smoky vetiver and dark chocolate.',
    images: [coffeeEmber1, coffeeEmber2],
    fragranceNotes: {
      top: ['Espresso', 'Cardamom'],
      heart: ['Dark Chocolate', 'Tobacco'],
      base: ['Vetiver', 'Leather', 'Amber'],
    },
    weight: '250g',
    size: 'Large',
    burnTime: '60-70 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 9,
    name: 'Seaside Serenity',
    slug: 'seaside-serenity',
    collection: 'Botanical',
    price: 1699,
    tagline: 'Calm coastal waters and beach florals',
    description: 'Find your peace by the sea. Light florals blend with ocean mist and sun-warmed sand.',
    images: [seasideSerenity1, seasideSerenity2],
    fragranceNotes: {
      top: ['Sea Mist', 'Citrus'],
      heart: ['Beach Rose', 'Lily'],
      base: ['Driftwood', 'White Sand', 'Soft Musk'],
    },
    weight: '180g',
    size: 'Medium',
    burnTime: '45-55 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
  {
    id: 10,
    name: 'Spring Morning',
    slug: 'spring-morning',
    collection: 'Signature',
    price: 1799,
    tagline: 'Fresh dewdrops and blooming gardens',
    description: 'Wake up to the freshness of a spring garden. Dewy florals meet crisp green notes.',
    images: [springMorning1, springMorning2],
    fragranceNotes: {
      top: ['Green Leaves', 'Citrus Zest'],
      heart: ['Lily of the Valley', 'Peony'],
      base: ['White Cedar', 'Clean Musk'],
    },
    weight: '200g',
    size: 'Medium',
    burnTime: '50-60 hours',
    stockStatus: 'instock',
    bestseller: false,
    onSale: false,
  },
];

// Alias for backward compatibility
export const staticCandles = candles;
export const staticCollections = collections;

// Helper functions
export function getCandleBySlug(slug: string): Candle | undefined {
  return candles.find(c => c.slug === slug);
}

export function getFeaturedCandles(): Candle[] {
  return candles.filter(c => c.bestseller || c.featured).slice(0, 8);
}

export function getBestsellers(): Candle[] {
  return candles.filter(c => c.bestseller);
}

export function getCandlesByCollection(collectionSlug: string): Candle[] {
  const collection = collections.find(c => c.slug === collectionSlug);
  if (!collection) return [];
  return candles.filter(c => c.collection === collection.name);
}

export function getOnSaleCandles(): Candle[] {
  return candles.filter(c => c.onSale);
}

export function getMinMaxPrice(): { min: number; max: number } {
  const prices = candles.map(c => c.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function searchCandles(query: string): Candle[] {
  const lowerQuery = query.toLowerCase();
  return candles.filter(c =>
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery) ||
    c.collection.toLowerCase().includes(lowerQuery) ||
    c.tagline.toLowerCase().includes(lowerQuery)
  );
}

export interface CandleFilters {
  priceRange?: [number, number];
  collections?: string[];
  sizes?: string[];
  inStock?: boolean;
  onSale?: boolean;
}

export function filterCandles(filters: CandleFilters): Candle[] {
  let result = [...candles];

  if (filters.priceRange) {
    result = result.filter(c =>
      c.price >= filters.priceRange![0] && c.price <= filters.priceRange![1]
    );
  }

  if (filters.collections && filters.collections.length > 0) {
    result = result.filter(c => {
      const col = collections.find(col => col.name === c.collection);
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
  candles,
  collections,
  getCandleBySlug,
  getFeaturedCandles,
  getBestsellers,
  getCandlesByCollection,
  getOnSaleCandles,
  getMinMaxPrice,
  searchCandles,
  filterCandles,
};
