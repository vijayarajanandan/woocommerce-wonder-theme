import React, { createContext, useContext, useState, useEffect } from "react";
import { Candle } from "@/types/candle";
import { toast } from "sonner";
import { trackWishlistAdd, trackWishlistRemove } from "@/lib/matomo";

interface WishlistContextType {
  items: Candle[];
  addItem: (candle: Candle) => void;
  removeItem: (candleId: number) => void;
  isInWishlist: (candleId: number) => boolean;
  toggleWishlist: (candle: Candle) => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Candle[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (candle: Candle) => {
    if (!items.find((item) => item.id === candle.id)) {
      setItems((prev) => [...prev, candle]);
      toast.success(`${candle.name} added to wishlist`);
      
      // Track wishlist add in Matomo
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
      
      // Track wishlist remove in Matomo
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
        addItem,
        removeItem,
        isInWishlist,
        toggleWishlist,
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