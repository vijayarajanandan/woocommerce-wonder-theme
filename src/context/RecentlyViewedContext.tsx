/**
 * Recently Viewed Context - WooCommerce Integrated
 * 
 * Features:
 * - Validates recently viewed items against WooCommerce
 * - Removes stale/invalid products automatically
 * - Migrates old localStorage format
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Candle } from "@/types/candle";
import { getProduct, isWooCommerceConfigured } from "@/lib/woocommerce";
import { wcProductToCandle } from "@/lib/woocommerce-mapper";

// Storage version for migrations
const RECENTLY_VIEWED_VERSION = 2;
const RECENTLY_VIEWED_STORAGE_KEY = "scentora-recently-viewed-v2";
const MAX_ITEMS = 8;

interface RecentlyViewedContextType {
  items: Candle[];
  isValidating: boolean;
  addItem: (candle: Candle) => void;
  clearItems: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

// Migrate old recently viewed data
const migrateOldRecentlyViewed = (): void => {
  const oldData = localStorage.getItem("recentlyViewed");
  if (oldData) {
    try {
      localStorage.removeItem("recentlyViewed");
      console.log("[RecentlyViewed] Cleared old data with potentially invalid IDs");
    } catch {
      localStorage.removeItem("recentlyViewed");
    }
  }
};

// Load from localStorage
const loadFromStorage = (): Candle[] => {
  migrateOldRecentlyViewed();
  
  const saved = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.version === RECENTLY_VIEWED_VERSION && Array.isArray(parsed.items)) {
        return parsed.items;
      }
    } catch (e) {
      console.error("[RecentlyViewed] Failed to load from storage:", e);
    }
  }
  return [];
};

// Save to localStorage
const saveToStorage = (items: Candle[]) => {
  localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify({
    version: RECENTLY_VIEWED_VERSION,
    items,
    updatedAt: Date.now(),
  }));
};

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Candle[]>(() => loadFromStorage());
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  // Save to localStorage when items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  // Validate items against WooCommerce
  const validateItems = useCallback(async () => {
    if (!isWooCommerceConfigured() || items.length === 0) {
      return;
    }

    setIsValidating(true);
    const validatedItems: Candle[] = [];

    try {
      for (const item of items) {
        try {
          const wcProduct = await getProduct(item.id);
          const validatedCandle = wcProductToCandle(wcProduct);
          validatedItems.push(validatedCandle);
        } catch {
          console.warn(`[RecentlyViewed] Product ID ${item.id} not found, removing`);
        }
      }

      if (validatedItems.length !== items.length) {
        setItems(validatedItems);
      }
    } catch (error) {
      console.error("[RecentlyViewed] Validation failed:", error);
    } finally {
      setIsValidating(false);
      setHasValidated(true);
    }
  }, [items]);

  // Validate on initial load
  useEffect(() => {
    if (items.length > 0 && !hasValidated && !isValidating) {
      validateItems();
    }
  }, [items.length, hasValidated, isValidating, validateItems]);

  const addItem = (candle: Candle) => {
    // Validate ID - WooCommerce IDs are typically > 10
    if (candle.id < 10) {
      console.warn(`[RecentlyViewed] Suspicious product ID ${candle.id}, not adding`);
      return;
    }

    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== candle.id);
      return [candle, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const clearItems = () => setItems([]);

  return (
    <RecentlyViewedContext.Provider value={{ items, isValidating, addItem, clearItems }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  }
  return context;
};