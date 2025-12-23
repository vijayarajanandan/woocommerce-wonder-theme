import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Product, ProductVariation } from "@/types/product";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; variation?: ProductVariation; attributes?: Record<string, string> } }
  | { type: "REMOVE_ITEM"; payload: { productId: number; variationId?: number } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: number; quantity: number; variationId?: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, variation, attributes } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariation?.id === variation?.id
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { ...state, items: newItems, isOpen: true };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { product, quantity, selectedVariation: variation, selectedAttributes: attributes },
        ],
        isOpen: true,
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.product.id === action.payload.productId &&
              item.selectedVariation?.id === action.payload.variationId)
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, variationId } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId &&
                item.selectedVariation?.id === variationId)
          ),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId &&
          item.selectedVariation?.id === variationId
            ? { ...item, quantity }
            : item
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
  addItem: (product: Product, quantity?: number, variation?: ProductVariation, attributes?: Record<string, string>) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: items });
      } catch (e) {
        console.error("Failed to load cart from localStorage");
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (
    product: Product,
    quantity = 1,
    variation?: ProductVariation,
    attributes?: Record<string, string>
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, variation, attributes } });
  };

  const removeItem = (productId: number, variationId?: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, variationId } });
  };

  const updateQuantity = (productId: number, quantity: number, variationId?: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity, variationId } });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const openCart = () => dispatch({ type: "OPEN_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const subtotal = state.items.reduce((total, item) => {
    const price = item.selectedVariation?.price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);

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
