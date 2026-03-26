import { useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem, MenuItem } from "@/app/types";

const CART_STORAGE_KEY = "restaurant_cart";

function parsePrice(value: string | number): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function sanitizeCart(input: unknown): CartItem[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => {
      const name = typeof item?.name === "string" ? item.name : "";
      const price = parsePrice(item?.price);
      const quantity = typeof item?.quantity === "number" ? item.quantity : 0;

      if (!name || price === null || quantity <= 0) return null;
      return { name, price, quantity };
    })
    .filter((item): item is CartItem => item !== null);
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return [];

    try {
      return sanitizeCart(JSON.parse(savedCart));
    } catch {
      console.error("Failed to parse saved cart.");
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: MenuItem) => {
    const parsedPrice = parsePrice(item?.price);
    if (!item?.name || parsedPrice === null) {
      console.error("Invalid menu item in addToCart:", item);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { name: item.name, price: parsedPrice, quantity: 1 }];
    });
  }, []);

  const increaseQty = useCallback((name: string) => {
    setCart((prev) => prev.map((item) => (item.name === name ? { ...item, quantity: item.quantity + 1 } : item)));
  }, []);

  const decreaseQty = useCallback((name: string) => {
    setCart((prev) =>
      prev.map((item) => (item.name === name ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const quantityMap = useMemo(() => {
    return cart.reduce<Record<string, number>>((acc, item) => {
      acc[item.name] = item.quantity;
      return acc;
    }, {});
  }, [cart]);

  const getItemQuantity = useCallback((name: string) => quantityMap[name] ?? 0, [quantityMap]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  return {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    increaseQty,
    decreaseQty,
    clearCart,
    getItemQuantity,
  };
}
