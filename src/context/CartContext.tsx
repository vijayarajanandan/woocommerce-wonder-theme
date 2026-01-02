import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Candle } from "@/types/candle";
import { trackCartUpdate } from "@/lib/matomo";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { candle: Candle; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { candleId: number } }
  | { type: "UPDATE_QUANTITY"; payload: { candleId: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

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
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (candle: Candle, quantity?: number) => void;
  removeItem: (candleId: number) => void;
  updateQuantity: (candleId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const savedCart = localStorage.getItem("scentora-cart");
    if (savedCart) {
      try {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      } catch (e) {
        console.error("Failed to load cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scentora-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (candle: Candle, quantity = 1) => {
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
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
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