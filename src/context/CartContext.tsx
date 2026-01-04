/**
 * Cart Context - WooCommerce Integrated
 * 
 * Features:
 * - Validates cart items against WooCommerce on load
 * - Removes stale/invalid products automatically
 * - Updates prices if they changed in WooCommerce
 * - Stores WooCommerce product IDs (not static IDs)
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { CartItem, Candle } from "@/types/candle";
import { trackCartUpdate } from "@/lib/matomo";
import { getProduct, isWooCommerceConfigured } from "@/lib/woocommerce";
import { wcProductToCandle } from "@/lib/woocommerce-mapper";
import { toast } from "sonner";

// Cart version for localStorage migrations
const CART_VERSION = 2;
const CART_STORAGE_KEY = "scentora-cart-v2";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isValidating: boolean;
  lastValidated: number | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { candle: Candle; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { candleId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { candleId: number; quantity: number } }
  | { type: "UPDATE_ITEM"; payload: { candleId: number; candle: Candle } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_VALIDATING"; payload: boolean }
  | { type: "SET_LAST_VALIDATED"; payload: number };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { candle, quantity } = action.payload;
      const existingIndex = state.items.findIndex((item) => item.candle.id === candle.id);

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { ...state, items: newItems, isOpen: true };
      }

      return {
        ...state,
        items: [...state.items, { candle, quantity }],
        isOpen: true,
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.candle.id !== action.payload.candleId),
      };

    case "UPDATE_QUANTITY": {
      const { candleId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.candle.id !== candleId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.candle.id === candleId ? { ...item, quantity } : item
        ),
      };
    }

    case "UPDATE_ITEM": {
      const { candleId, candle } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.candle.id === candleId ? { ...item, candle } : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "LOAD_CART":
      return { ...state, items: action.payload };
    case "SET_VALIDATING":
      return { ...state, isValidating: action.payload };
    case "SET_LAST_VALIDATED":
      return { ...state, lastValidated: action.payload };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isValidating: boolean;
  addItem: (candle: Candle, quantity?: number) => void;
  removeItem: (candleId: number) => void;
  updateQuantity: (candleId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  validateCart: () => Promise<boolean>;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to track cart in Matomo
const trackCart = (items: CartItem[]) => {
  const cartTotal = items.reduce((total, item) => total + item.candle.price * item.quantity, 0);
  trackCartUpdate(
    items.map((item) => ({
      id: item.candle.id,
      name: item.candle.name,
      category: item.candle.collection || 'Candles',
      price: item.candle.price,
      quantity: item.quantity,
    })),
    cartTotal
  );
};

// Migrate old cart data
const migrateOldCart = (): CartItem[] => {
  // Check for old cart format
  const oldCart = localStorage.getItem("scentora-cart");
  if (oldCart) {
    try {
      const parsed = JSON.parse(oldCart);
      // Clear old cart - it has wrong IDs
      localStorage.removeItem("scentora-cart");
      console.log("[Cart] Cleared old cart data with potentially invalid IDs");
      
      // Don't migrate - old IDs are invalid
      // User will need to re-add products from WooCommerce
      return [];
    } catch {
      localStorage.removeItem("scentora-cart");
    }
  }
  return [];
};

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  // First, check for and migrate old cart
  migrateOldCart();
  
  // Load new cart format
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart) {
    try {
      const parsed = JSON.parse(savedCart);
      if (parsed.version === CART_VERSION && Array.isArray(parsed.items)) {
        return parsed.items;
      }
    } catch (e) {
      console.error("[Cart] Failed to load cart from storage:", e);
    }
  }
  return [];
};

// Save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
    version: CART_VERSION,
    items,
    updatedAt: Date.now(),
  }));
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isValidating: false,
    lastValidated: null,
  });
  
  const hasLoadedRef = useRef(false);

  // Load cart on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      dispatch({ type: "LOAD_CART", payload: savedItems });
    }
  }, []);

  // Save cart when items change
  useEffect(() => {
    if (hasLoadedRef.current) {
      saveCartToStorage(state.items);
    }
  }, [state.items]);

  // Validate cart against WooCommerce
  const validateCart = useCallback(async (): Promise<boolean> => {
    if (!isWooCommerceConfigured()) {
      console.warn("[Cart] WooCommerce not configured, skipping validation");
      return false;
    }

    if (state.items.length === 0) {
      return true;
    }

    dispatch({ type: "SET_VALIDATING", payload: true });
    
    let hasChanges = false;
    let hasRemovals = false;
    const validatedItems: CartItem[] = [];
    const removedItems: string[] = [];
    const priceChanges: string[] = [];

    try {
      // Validate each item against WooCommerce
      for (const item of state.items) {
        try {
          const wcProduct = await getProduct(item.candle.id);
          const validatedCandle = wcProductToCandle(wcProduct);
          
          // Check if product is still in stock
          if (wcProduct.stock_status !== 'instock') {
            removedItems.push(item.candle.name);
            hasRemovals = true;
            continue;
          }
          
          // Check for price changes
          if (validatedCandle.price !== item.candle.price) {
            priceChanges.push(`${item.candle.name}: ₹${item.candle.price} → ₹${validatedCandle.price}`);
            hasChanges = true;
          }
          
          validatedItems.push({
            ...item,
            candle: validatedCandle,
          });
          
        } catch (error) {
          // Product not found in WooCommerce - remove from cart
          console.warn(`[Cart] Product ID ${item.candle.id} not found in WooCommerce, removing from cart`);
          removedItems.push(item.candle.name);
          hasRemovals = true;
        }
      }

      // Update cart with validated items
      if (hasChanges || hasRemovals) {
        dispatch({ type: "LOAD_CART", payload: validatedItems });
        
        // Notify user of changes
        if (removedItems.length > 0) {
          toast.error(`Removed unavailable items: ${removedItems.join(", ")}`);
        }
        if (priceChanges.length > 0) {
          toast.info(`Prices updated: ${priceChanges.join("; ")}`);
        }
      }

      dispatch({ type: "SET_LAST_VALIDATED", payload: Date.now() });
      return validatedItems.length > 0;
      
    } catch (error) {
      console.error("[Cart] Validation failed:", error);
      return false;
    } finally {
      dispatch({ type: "SET_VALIDATING", payload: false });
    }
  }, [state.items]);

  // Validate cart on initial load (if items exist and haven't been validated recently)
  useEffect(() => {
    const shouldValidate = 
      state.items.length > 0 && 
      !state.isValidating &&
      (!state.lastValidated || Date.now() - state.lastValidated > 5 * 60 * 1000); // 5 min cache
    
    if (shouldValidate) {
      validateCart();
    }
  }, [state.items.length, state.lastValidated, state.isValidating, validateCart]);

  const addItem = (candle: Candle, quantity = 1) => {
    // Validate that the candle has a proper WooCommerce ID (not static ID like 1, 2, 3...)
    // WooCommerce IDs are typically larger numbers
    if (candle.id < 10) {
      console.warn(`[Cart] Suspicious product ID ${candle.id} - may be static data. Product: ${candle.name}`);
      toast.error("Unable to add product. Please refresh the page and try again.");
      return;
    }
    
    dispatch({ type: "ADD_ITEM", payload: { candle, quantity } });
    
    // Track updated cart
    const existingItem = state.items.find((item) => item.candle.id === candle.id);
    const newItems = existingItem
      ? state.items.map((item) =>
          item.candle.id === candle.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...state.items, { candle, quantity }];
    trackCart(newItems);
  };

  const removeItem = (candleId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { candleId } });
    const newItems = state.items.filter((item) => item.candle.id !== candleId);
    trackCart(newItems);
  };

  const updateQuantity = (candleId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { candleId, quantity } });
    const newItems =
      quantity <= 0
        ? state.items.filter((item) => item.candle.id !== candleId)
        : state.items.map((item) =>
            item.candle.id === candleId ? { ...item, quantity } : item
          );
    trackCart(newItems);
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const subtotal = state.items.reduce((total, item) => total + item.candle.price * item.quantity, 0);
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        isValidating: state.isValidating,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        validateCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};