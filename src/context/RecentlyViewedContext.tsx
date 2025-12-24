import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Candle } from "@/types/candle";

interface RecentlyViewedContextType {
  items: Candle[];
  addItem: (candle: Candle) => void;
  clearItems: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Candle[]>(() => {
    const saved = localStorage.getItem("recentlyViewed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(items));
  }, [items]);

  const addItem = (candle: Candle) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== candle.id);
      return [candle, ...filtered].slice(0, 8);
    });
  };

  const clearItems = () => setItems([]);

  return (
    <RecentlyViewedContext.Provider value={{ items, addItem, clearItems }}>
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
