/**
 * Wishlist Context - WooCommerce Integrated
 * 
 * Features:
 * - Validates wishlist items against WooCommerce on load
 * - Removes stale/invalid products automatically
 * - Migrates old localStorage format
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Candle } from "@/types/candle";
import { toast } from "sonner";
import { trackWishlistAdd, trackWishlistRemove } from "@/lib/matomo";
import { getProduct, isWooCommerceConfigured } from "@/lib/woocommerce";
import { wcProductToCandle } from "@/lib/woocommerce-mapper";

// Storage version for migrations
const WISHLIST_VERSION = 2;
const WISHLIST_STORAGE_KEY = "scentora-wishlist-v2";

interface WishlistContextType {
  items: Candle[];
  isValidating: boolean;
  addItem: (candle: Candle) => void;
  removeItem: (candleId: number) => void;
  isInWishlist: (candleId: number) => boolean;
  toggleWishlist: (candle: Candle) => void;
  validateWishlist: () => Promise<void>;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Migrate old wishlist data
const migrateOldWishlist = (): void => {
  const oldWishlist = localStorage.getItem("wishlist");
  if (oldWishlist) {
    try {
      // Clear old wishlist - IDs are invalid
      localStorage.removeItem("wishlist");
      console.log("[Wishlist] Cleared old wishlist data with potentially invalid IDs");
    } catch {
      localStorage.removeItem("wishlist");
    }
  }
};

// Load wishlist from localStorage
const loadWishlistFromStorage = (): Candle[] => {
  migrateOldWishlist();
  
  const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.version === WISHLIST_VERSION && Array.isArray(parsed.items)) {
        return parsed.items;
      }
    } catch (e) {
      console.error("[Wishlist] Failed to load wishlist from storage:", e);
    }
  }
  return [];
};

// Save wishlist to localStorage
const saveWishlistToStorage = (items: Candle[]) => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify({
    version: WISHLIST_VERSION,
    items,
    updatedAt: Date.now(),
  }));
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Candle[]>(() => loadWishlistFromStorage());
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  // Save to localStorage when items change
  useEffect(() => {
    saveWishlistToStorage(items);
  }, [items]);

  // Validate wishlist against WooCommerce
  const validateWishlist = useCallback(async () => {
    if (!isWooCommerceConfigured() || items.length === 0) {
      return;
    }

    setIsValidating(true);
    const validatedItems: Candle[] = [];
    const removedItems: string[] = [];

    try {
      for (const item of items) {
        try {
          const wcProduct = await getProduct(item.id);
          const validatedCandle = wcProductToCandle(wcProduct);
          validatedItems.push(validatedCandle);
        } catch {
          console.warn(`[Wishlist] Product ID ${item.id} not found, removing from wishlist`);
          removedItems.push(item.name);
        }
      }

      if (removedItems.length > 0) {
        setItems(validatedItems);
        toast.info(`Some wishlist items are no longer available and were removed.`);
      } else if (validatedItems.length > 0) {
        // Update with fresh data
        setItems(validatedItems);
      }
    } catch (error) {
      console.error("[Wishlist] Validation failed:", error);
    } finally {
      setIsValidating(false);
      setHasValidated(true);
    }
  }, [items]);

  // Validate on initial load
  useEffect(() => {
    if (items.length > 0 && !hasValidated && !isValidating) {
      validateWishlist();
    }
  }, [items.length, hasValidated, isValidating, validateWishlist]);

  const addItem = (candle: Candle) => {
    // Validate ID
    if (candle.id < 10) {
      console.warn(`[Wishlist] Suspicious product ID ${candle.id}`);
      toast.error("Unable to add product. Please refresh the page and try again.");
      return;
    }

    if (!items.find((item) => item.id === candle.id)) {
      setItems((prev) => [...prev, candle]);
      toast.success(`${candle.name} added to wishlist`);
      trackWishlistAdd({
        id: candle.id,
        name: candle.name,
        price: candle.price,
      });
    }
  };

  const removeItem = (candleId: number) => {
    const candle = items.find((item) => item.id === candleId);
    setItems((prev) => prev.filter((item) => item.id !== candleId));
    if (candle) {
      toast.success(`${candle.name} removed from wishlist`);
      trackWishlistRemove({
        id: candle.id,
        name: candle.name,
      });
    }
  };

  const isInWishlist = (candleId: number) => {
    return items.some((item) => item.id === candleId);
  };

  const toggleWishlist = (candle: Candle) => {
    if (isInWishlist(candle.id)) {
      removeItem(candle.id);
    } else {
      addItem(candle);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isValidating,
        addItem,
        removeItem,
        isInWishlist,
        toggleWishlist,
        validateWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};