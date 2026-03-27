"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MenuItem } from "@/app/types";
import { getAdminMenuItems, setAdminMenuItems } from "../lib/storage";
import type { AdminMenuItem } from "../types";

export type AdminMenuInput = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
};

function parsePrice(value: string | number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getApiUrls() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");
  const fallbackUrl = "https://restaurant-api-jbw2.onrender.com";
  return [baseUrl, fallbackUrl].filter((url, index, arr) => Boolean(url) && arr.indexOf(url) === index);
}

async function fetchWebsiteMenu(signal: AbortSignal): Promise<AdminMenuItem[]> {
  for (const url of getApiUrls()) {
    try {
      const res = await fetch(`${url}/menu`, { signal });
      if (!res.ok) continue;
      const data = (await res.json()) as MenuItem[];
      const now = new Date().toISOString();
      return data.map((item, index) => ({
        id: `${item.name}-${index}`.toLowerCase().replace(/\s+/g, "-"),
        name: item.name ?? "Untitled Item",
        description: item.description ?? "",
        price: parsePrice(item.price),
        imageUrl: item.image ?? "",
        category: item.category ?? "Uncategorized",
        inStock: true,
        createdAt: now,
        updatedAt: now,
      }));
    } catch (error: unknown) {
      if ((error as { name?: string }).name === "AbortError") throw error;
    }
  }
  return [];
}

export function useAdminMenu() {
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function init() {
      try {
        const localItems = getAdminMenuItems();
        if (localItems.length > 0) {
          setItems(localItems);
          return;
        }
        const websiteItems = await fetchWebsiteMenu(controller.signal);
        setItems(websiteItems);
        setAdminMenuItems(websiteItems);
      } finally {
        setIsReady(true);
      }
    }

    init();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    setAdminMenuItems(items);
  }, [items, isReady]);

  const createItem = useCallback((input: AdminMenuInput) => {
    const now = new Date().toISOString();
    setItems((prev) => [
      { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now },
      ...prev,
    ]);
  }, []);

  const updateItem = useCallback((id: string, input: AdminMenuInput) => {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...input, updatedAt: now } : item)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock, updatedAt: now } : item))
    );
  }, []);

  const syncFromWebsite = useCallback(async () => {
    const websiteItems = await fetchWebsiteMenu(new AbortController().signal);
    setItems(websiteItems);
    setAdminMenuItems(websiteItems);
  }, []);

  const stats = useMemo(
    () => ({
      total: items.length,
      inStock: items.filter((item) => item.inStock).length,
      outOfStock: items.filter((item) => !item.inStock).length,
      categories: new Set(items.map((item) => item.category)).size,
    }),
    [items]
  );

  return { items, isReady, stats, createItem, updateItem, deleteItem, toggleAvailability, syncFromWebsite };
}
