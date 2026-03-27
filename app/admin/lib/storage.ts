"use client";

import type { AdminMenuItem } from "../types";

const ADMIN_AUTH_KEY = "restaurant_admin_authenticated";
const ADMIN_MENU_KEY = "restaurant_admin_menu_items";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";
}

export function getAdminAuthState() {
  if (!canUseStorage()) return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function setAdminAuthState(value: boolean) {
  if (!canUseStorage()) return;
  localStorage.setItem(ADMIN_AUTH_KEY, String(value));
}

export function getAdminMenuItems() {
  if (!canUseStorage()) return [] as AdminMenuItem[];

  const raw = localStorage.getItem(ADMIN_MENU_KEY);
  if (!raw) return [] as AdminMenuItem[];

  try {
    const parsed = JSON.parse(raw) as Partial<AdminMenuItem>[];
    if (!Array.isArray(parsed)) return [] as AdminMenuItem[];

    return parsed.map((item) => ({
      id: item.id ?? crypto.randomUUID(),
      name: item.name ?? "Untitled Item",
      description: item.description ?? "",
      price: typeof item.price === "number" && Number.isFinite(item.price) ? item.price : 0,
      imageUrl: item.imageUrl ?? "",
      category: item.category ?? "Uncategorized",
      inStock: item.inStock ?? true,
      createdAt: item.createdAt ?? new Date().toISOString(),
      updatedAt: item.updatedAt ?? new Date().toISOString(),
    }));
  } catch {
    return [] as AdminMenuItem[];
  }
}

export function setAdminMenuItems(items: AdminMenuItem[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(ADMIN_MENU_KEY, JSON.stringify(items));
}
