import { Candle, Collection } from "@/types/candle";

export const collections: Collection[] = [
  {
    id: 1,
    name: "Signature Collection",
    slug: "signature",
    description: "Warm, comforting classics – Seaside Serenity, Spiced Vanilla & Autumn Orchard",
    image: "https://images.unsplash.com/photo-1599446220151-7a4fbf6a9b6d?w=800&q=80",
  },
  {
    id: 2,
    name: "Noir Collection",
    slug: "noir",
    description: "Bold, mysterious evenings – Coffee Ember, Vintage Memories & Noir Rose",
    image: "https://images.unsplash.com/photo-1603905179785-5b5f26942314?w=800&q=80",
  },
  {
    id: 3,
    name: "Botanical Garden",
    slug: "botanical",
    description: "Fresh florals & nature – Sakura Dream, Lavender Whisper & Spring Morning",
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=800&q=80",
  },
  {
    id: 4,
    name: "Limited Edition",
    slug: "limited",
    description: "Exclusive seasonal blend – Cinnamon Brew, our signature fusion",
    image: "https://images.unsplash.com/photo-1602607434763-6b9f36c2bc58?w=800&q=80",
  },
];

export const candles: Candle[] = [
  {
    id: 1,
    name: "Sakura Dream",
    slug: "sakura-dream",
    price: 1299,
    onSale: false,
    tagline: "Japanese Cherry Blossom",
    description: "Delicate cherry blossom petals dancing in a spring breeze, with soft notes of almond and fresh green leaves. A gentle, romantic fragrance that captures the fleeting beauty of sakura season.",
    fragranceNotes: {
      top: ["Cherry Blossom", "Bergamot", "Green Tea"],
      heart: ["Japanese Cherry", "Peony", "Magnolia"],
      base: ["Soft Musk", "Sandalwood", "Almond"],
    },
    images: [
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
      "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
    ],
    collection: "Botanical Garden",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: true,
  },
  {
    id: 2,
    name: "Seaside Serenity",
    slug: "seaside-serenity",
    price: 1299,
    onSale: false,
    tagline: "Ocean Breeze",
    description: "Fresh ocean air meets coastal florals in this invigorating blend. Sea salt, driftwood, and a touch of coconut create a calming escape to your favorite beach destination.",
    fragranceNotes: {
      top: ["Sea Salt", "Citrus", "Ozone"],
      heart: ["Ocean Breeze", "Jasmine", "Water Lily"],
      base: ["Driftwood", "Coconut", "White Musk"],
    },
    images: [
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
    ],
    collection: "Signature Collection",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 3,
    name: "Spiced Vanilla",
    slug: "spiced-vanilla",
    price: 1199,
    regularPrice: 1499,
    onSale: true,
    tagline: "Cinnamon & Vanilla",
    description: "Warm cinnamon bark intertwines with rich Madagascar vanilla for a cozy, comforting embrace. Perfect for creating a welcoming atmosphere in any space.",
    fragranceNotes: {
      top: ["Cinnamon Bark", "Nutmeg", "Cardamom"],
      heart: ["Vanilla Bean", "Honey", "Clove"],
      base: ["Tonka Bean", "Amber", "Warm Musk"],
    },
    images: [
      "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
      "https://images.unsplash.com/photo-1543360152-4d2bd305a1f2?w=800",
    ],
    collection: "Signature Collection",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: true,
  },
  {
    id: 4,
    name: "Coffee Ember",
    slug: "coffee-ember",
    price: 1399,
    onSale: false,
    tagline: "Roasted Coffee",
    description: "Rich, freshly roasted coffee beans with hints of dark chocolate and caramel. A bold, awakening fragrance for coffee lovers who appreciate depth and warmth.",
    fragranceNotes: {
      top: ["Espresso", "Dark Chocolate", "Hazelnut"],
      heart: ["Roasted Coffee", "Caramel", "Cinnamon"],
      base: ["Vanilla", "Smoky Woods", "Brown Sugar"],
    },
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
    ],
    collection: "Noir Collection",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 5,
    name: "Autumn Orchard",
    slug: "autumn-orchard",
    price: 1299,
    onSale: false,
    tagline: "Apple Cinnamon",
    description: "Crisp autumn apples freshly picked from the orchard, warmed with cinnamon and a hint of maple. A nostalgic fragrance that captures golden fall afternoons.",
    fragranceNotes: {
      top: ["Red Apple", "Pear", "Citrus Zest"],
      heart: ["Cinnamon", "Apple Cider", "Clove"],
      base: ["Maple", "Vanilla", "Warm Woods"],
    },
    images: [
      "https://images.unsplash.com/photo-1543360152-4d2bd305a1f2?w=800",
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
    ],
    collection: "Signature Collection",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: false,
    bestseller: true,
  },
  {
    id: 6,
    name: "Lavender Whisper",
    slug: "lavender-whisper",
    price: 1299,
    onSale: false,
    tagline: "Fresh Lavender",
    description: "Provence lavender fields at sunset, with calming herbs and a soft cotton finish. An aromatherapy-inspired blend for ultimate relaxation and peaceful sleep.",
    fragranceNotes: {
      top: ["French Lavender", "Eucalyptus", "Mint"],
      heart: ["Lavender", "Chamomile", "Rose"],
      base: ["Soft Cotton", "White Musk", "Powder"],
    },
    images: [
      "https://images.unsplash.com/photo-1602607434763-6b9f36c2bc58?w=800",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
    ],
    collection: "Botanical Garden",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 7,
    name: "Vintage Memories",
    slug: "vintage-memories",
    price: 1499,
    onSale: false,
    tagline: "Nostalgic & Timeless",
    description: "A nostalgic journey through time with old books, antique wood, and soft leather. Subtle hints of rose and powder evoke cherished memories and quiet moments.",
    fragranceNotes: {
      top: ["Old Books", "Bergamot", "Green Tea"],
      heart: ["Rose", "Violet", "Iris"],
      base: ["Antique Wood", "Leather", "Powder"],
    },
    images: [
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800",
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
    ],
    collection: "Noir Collection",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: true,
    bestseller: false,
  },
  {
    id: 8,
    name: "Noir Rose",
    slug: "noir-rose",
    price: 1399,
    onSale: false,
    tagline: "Dark Rose",
    description: "Deep, mysterious dark roses with velvety petals and intoxicating allure. Black pepper and oud add sophistication to this seductive evening fragrance.",
    fragranceNotes: {
      top: ["Black Pepper", "Saffron", "Bergamot"],
      heart: ["Dark Rose", "Jasmine", "Geranium"],
      base: ["Oud", "Patchouli", "Dark Musk"],
    },
    images: [
      "https://images.unsplash.com/photo-1602528495627-2acdb54d5c4e?w=800",
      "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800",
    ],
    collection: "Noir Collection",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: false,
    bestseller: true,
  },
  {
    id: 9,
    name: "Spring Morning",
    slug: "spring-morning",
    price: 1299,
    onSale: false,
    tagline: "Fresh & Awakening",
    description: "Dewdrops on fresh petals, crisp morning air, and the first blooms of spring. A clean, refreshing fragrance that brings the garden indoors.",
    fragranceNotes: {
      top: ["Fresh Greens", "Citrus", "Dewdrops"],
      heart: ["Lily of the Valley", "White Flowers", "Peony"],
      base: ["Sheer Musk", "Light Woods", "Clean Cotton"],
    },
    images: [
      "https://images.unsplash.com/photo-1543360152-4d2bd305a1f2?w=800",
      "https://images.unsplash.com/photo-1602607434763-6b9f36c2bc58?w=800",
    ],
    collection: "Botanical Garden",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "instock",
    featured: false,
    bestseller: false,
  },
  {
    id: 10,
    name: "Cinnamon Brew",
    slug: "cinnamon-brew",
    price: 1499,
    onSale: false,
    tagline: "Apple Cinnamon & Roasted Coffee",
    description: "A unique fusion of warm cinnamon, fresh apples, and rich roasted coffee. This complex, cozy blend is perfect for autumn evenings and quiet mornings alike.",
    fragranceNotes: {
      top: ["Green Apple", "Cinnamon", "Orange Peel"],
      heart: ["Roasted Coffee", "Caramel", "Clove"],
      base: ["Brown Sugar", "Vanilla", "Toasted Woods"],
    },
    images: [
      "https://images.unsplash.com/photo-1608181831718-2501c9f0ed38?w=800",
      "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800",
    ],
    collection: "Limited Edition",
    size: "6 oz",
    weight: "170g",
    burnTime: "40+ hours",
    stockStatus: "limited",
    featured: true,
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
