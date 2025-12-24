// Your existing Candle types - preserved exactly as-is

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Candle {
  id: number;
  name: string;
  slug: string;
  collection: string;
  price: number;
  regularPrice?: number;
  tagline: string;
  description: string;
  images: string[];
  fragranceNotes: FragranceNotes;
  weight: string;
  size: string;
  burnTime: string;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
  bestseller?: boolean;
  onSale?: boolean;
  featured?: boolean;
  sku?: string;
  categories?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  candle: Candle;
  quantity: number;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
}

// WishlistItem is just a Candle
export type WishlistItem = Candle;

// Recently viewed is also Candle[]
export type RecentlyViewedItem = Candle;
