import { Candle, Collection } from "@/types/candle";

// Enhanced product images
import sakuraDream1 from "@/assets/products/sakura-dream-1-enhanced.jpg";
import sakuraDream2 from "@/assets/products/sakura-dream-2-enhanced.jpg";
import seasideSerenity1 from "@/assets/products/seaside-serenity-1-enhanced.jpg";
import seasideSerenity2 from "@/assets/products/seaside-serenity-2-enhanced.jpg";
import springMorning1 from "@/assets/products/spring-morning-1-enhanced.jpg";
import springMorning2 from "@/assets/products/spring-morning-2-enhanced.jpg";
import lavenderWhisper1 from "@/assets/products/lavender-whisper-1-enhanced.jpg";
import lavenderWhisper2 from "@/assets/products/lavender-whisper-2-enhanced.jpg";
import coffeeEmber1 from "@/assets/products/coffee-ember-1-enhanced.jpg";
import coffeeEmber2 from "@/assets/products/coffee-ember-2-enhanced.jpg";
import midnightJasmine1 from "@/assets/products/midnight-jasmine-1-enhanced.jpg";
import midnightJasmine2 from "@/assets/products/midnight-jasmine-2-enhanced.jpg";
import forestPine1 from "@/assets/products/forest-pine-1-enhanced.jpg";
import forestPine2 from "@/assets/products/forest-pine-2-enhanced.jpg";
import vanillaSunrise1 from "@/assets/products/vanilla-sunrise-1-enhanced.jpg";
import vanillaSunrise2 from "@/assets/products/vanilla-sunrise-2-enhanced.jpg";
import oceanBreeze1 from "@/assets/products/ocean-breeze-1-enhanced.jpg";
import oceanBreeze2 from "@/assets/products/ocean-breeze-2-enhanced.jpg";
import autumnSpice1 from "@/assets/products/autumn-spice-1-enhanced.jpg";
import autumnSpice2 from "@/assets/products/autumn-spice-2-enhanced.jpg";

export const collections: Collection[] = [
  {
    id: 1,
    name: "Signature Collection",
    slug: "signature",
    description: "Warm, comforting classics – Seaside Serenity, Spiced Vanilla & Autumn Orchard",
    image: seasideSerenity1,
  },
  {
    id: 2,
    name: "Noir Collection",
    slug: "noir",
    description: "Bold, mysterious evenings – Coffee Ember, Vintage Memories & Noir Rose",
    image: coffeeEmber1,
  },
  {
    id: 3,
    name: "Botanical Garden",
    slug: "botanical",
    description: "Fresh florals & nature – Sakura Dream, Lavender Whisper & Spring Morning",
    image: sakuraDream1,
  },
  {
    id: 4,
    name: "Limited Edition",
    slug: "limited",
    description: "Exclusive seasonal blend – Cinnamon Brew, our signature fusion",
    image: autumnSpice1,
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
    images: [sakuraDream1, sakuraDream2],
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
    images: [seasideSerenity1, seasideSerenity2],
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
    images: [forestPine1, forestPine2],
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
    images: [coffeeEmber1, coffeeEmber2],
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
    images: [vanillaSunrise1, vanillaSunrise2],
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
    images: [lavenderWhisper1, lavenderWhisper2],
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
    images: [midnightJasmine1, midnightJasmine2],
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
    images: [oceanBreeze1, oceanBreeze2],
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
    images: [springMorning1, springMorning2],
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
    images: [autumnSpice1, autumnSpice2],
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
