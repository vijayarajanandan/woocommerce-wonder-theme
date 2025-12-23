import { Candle, Collection } from "@/types/candle";

export const collections: Collection[] = [
  {
    id: 1,
    name: "Signature Collection",
    slug: "signature",
    description: "Our timeless classics, crafted to perfection",
    image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
  },
  {
    id: 2,
    name: "Noir Collection",
    slug: "noir",
    description: "Deep, mysterious fragrances for the evening",
    image: "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
  },
  {
    id: 3,
    name: "Botanical Garden",
    slug: "botanical",
    description: "Fresh florals and garden-inspired scents",
    image: "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
  },
  {
    id: 4,
    name: "Limited Edition",
    slug: "limited",
    description: "Exclusive seasonal releases",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
  },
];

export const candles: Candle[] = [
  {
    id: 1,
    name: "Midnight Oud",
    slug: "midnight-oud",
    price: 85,
    onSale: false,
    tagline: "A journey through Arabian nights",
    description: "An opulent blend of rare oud wood, smoky incense, and warm amber. This sophisticated fragrance evokes the mystery of moonlit desert palaces, where ancient traditions meet modern luxury.",
    fragranceNotes: {
      top: ["Bergamot", "Saffron", "Pink Pepper"],
      heart: ["Oud Wood", "Rose Absolute", "Incense"],
      base: ["Amber", "Sandalwood", "Musk"],
    },
    images: [
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
    ],
    collection: "Noir Collection",
    size: "Large",
    weight: "300g",
    burnTime: "60+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: true,
  },
  {
    id: 2,
    name: "White Tea & Sage",
    slug: "white-tea-sage",
    price: 72,
    onSale: false,
    tagline: "Serene simplicity",
    description: "A calming composition of delicate white tea leaves and aromatic sage, balanced with hints of crisp linen. Perfect for creating a tranquil sanctuary in your home.",
    fragranceNotes: {
      top: ["White Tea", "Bergamot", "Green Apple"],
      heart: ["Sage", "Jasmine", "Lily of the Valley"],
      base: ["Soft Musk", "Cedar", "White Amber"],
    },
    images: [
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
      "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
    ],
    collection: "Signature Collection",
    size: "Medium",
    weight: "220g",
    burnTime: "45+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 3,
    name: "Velvet Rose",
    slug: "velvet-rose",
    price: 78,
    regularPrice: 95,
    onSale: true,
    tagline: "Romance in full bloom",
    description: "Luxurious Bulgarian rose petals wrapped in velvety cashmere and warm vanilla. A romantic and sophisticated scent that transforms any space into a garden of eternal beauty.",
    fragranceNotes: {
      top: ["Rose Petals", "Pink Pepper", "Raspberry"],
      heart: ["Bulgarian Rose", "Peony", "Cashmere Wood"],
      base: ["Vanilla", "Musk", "Amber"],
    },
    images: [
      "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
      "https://images.unsplash.com/photo-1543360152-4d2bd305a1f2?w=800",
    ],
    collection: "Botanical Garden",
    size: "Large",
    weight: "300g",
    burnTime: "60+ hours",
    stockStatus: "limited",
    featured: true,
    bestseller: true,
  },
  {
    id: 4,
    name: "Smoky Leather",
    slug: "smoky-leather",
    price: 92,
    onSale: false,
    tagline: "Bold sophistication",
    description: "Rich Italian leather meets smoky birch tar and aged whiskey. An unapologetically bold fragrance for those who appreciate the finer things in life.",
    fragranceNotes: {
      top: ["Whiskey", "Tobacco", "Black Pepper"],
      heart: ["Leather", "Birch Tar", "Oud"],
      base: ["Vetiver", "Dark Musk", "Benzoin"],
    },
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
    ],
    collection: "Noir Collection",
    size: "Large",
    weight: "300g",
    burnTime: "60+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 5,
    name: "Fig & Cassis",
    slug: "fig-cassis",
    price: 68,
    onSale: false,
    tagline: "Mediterranean escape",
    description: "Sweet Mediterranean figs intertwined with tart blackcurrant and sun-warmed green leaves. A refreshing yet complex scent that captures lazy summer afternoons.",
    fragranceNotes: {
      top: ["Blackcurrant", "Green Fig", "Citrus"],
      heart: ["Fig Leaf", "Violet", "Ivy"],
      base: ["Cedarwood", "Moss", "Light Musk"],
    },
    images: [
      "https://images.unsplash.com/photo-1543360152-4d2bd305a1f2?w=800",
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
    ],
    collection: "Botanical Garden",
    size: "Medium",
    weight: "220g",
    burnTime: "45+ hours",
    stockStatus: "instock",
    featured: false,
    bestseller: true,
  },
  {
    id: 6,
    name: "Amber Noir",
    slug: "amber-noir",
    price: 88,
    onSale: false,
    tagline: "Timeless elegance",
    description: "Precious amber resin warmed with exotic spices and wrapped in rich vanilla. A deeply sensual fragrance that creates an atmosphere of intimate luxury.",
    fragranceNotes: {
      top: ["Cardamom", "Pink Pepper", "Mandarin"],
      heart: ["Amber", "Cinnamon", "Rose"],
      base: ["Vanilla", "Tonka Bean", "Benzoin"],
    },
    images: [
      "https://images.unsplash.com/photo-1602607434763-6b9f36c2bc58?w=800",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
    ],
    collection: "Signature Collection",
    size: "Large",
    weight: "300g",
    burnTime: "60+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 7,
    name: "Winter Solstice",
    slug: "winter-solstice",
    price: 95,
    onSale: false,
    tagline: "Limited seasonal release",
    description: "A magical blend of frosted pine, warm spices, and crackling firewood. This exclusive seasonal candle captures the enchantment of winter's longest night.",
    fragranceNotes: {
      top: ["Frosted Pine", "Eucalyptus", "Juniper Berry"],
      heart: ["Cinnamon", "Clove", "Nutmeg"],
      base: ["Firewood", "Amber", "Vanilla"],
    },
    images: [
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800",
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
    ],
    collection: "Limited Edition",
    size: "Large",
    weight: "350g",
    burnTime: "70+ hours",
    stockStatus: "limited",
    featured: true,
    bestseller: false,
  },
  {
    id: 8,
    name: "Jasmine Dreams",
    slug: "jasmine-dreams",
    price: 72,
    onSale: false,
    tagline: "Intoxicating florals",
    description: "Night-blooming jasmine captured at peak intensity, softened with creamy sandalwood and a whisper of vanilla. An intoxicating fragrance for evening relaxation.",
    fragranceNotes: {
      top: ["Neroli", "Green Notes", "Pear"],
      heart: ["Jasmine Sambac", "Ylang Ylang", "Tuberose"],
      base: ["Sandalwood", "Vanilla", "White Musk"],
    },
    images: [
      "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
    ],
    collection: "Botanical Garden",
    size: "Medium",
    weight: "220g",
    burnTime: "45+ hours",
    stockStatus: "instock",
    featured: false,
    bestseller: false,
  },
];

export const getFeaturedCandles = (): Candle[] => {
  return candles.filter((c) => c.featured);
};

export const getBestsellers = (): Candle[] => {
  return candles.filter((c) => c.bestseller);
};

export const getCandleBySlug = (slug: string): Candle | undefined => {
  return candles.find((c) => c.slug === slug);
};

export const getCandlesByCollection = (collectionSlug: string): Candle[] => {
  const collection = collections.find((c) => c.slug === collectionSlug);
  if (!collection) return [];
  return candles.filter((c) => c.collection === collection.name);
};

export const getSaleCandles = (): Candle[] => {
  return candles.filter((c) => c.onSale);
};
