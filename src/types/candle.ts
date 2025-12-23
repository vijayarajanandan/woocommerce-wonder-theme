export interface Candle {
  id: number;
  name: string;
  slug: string;
  price: number;
  regularPrice?: number;
  onSale: boolean;
  tagline: string;
  description: string;
  fragranceNotes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  images: string[];
  collection: string;
  size: string;
  weight: string;
  burnTime: string;
  stockStatus: 'instock' | 'outofstock' | 'limited';
  featured: boolean;
  bestseller: boolean;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  candle: Candle;
  quantity: number;
}
