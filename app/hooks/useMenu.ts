import { useEffect, useMemo, useState } from "react";
import type { MenuItem } from "@/app/types";

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

    async function loadMenu() {
      try {
        const res = await fetch(`${baseUrl}/menu`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: MenuItem[] = await res.json();
        setMenu(data);
      } catch (err: unknown) {
        if ((err as { name?: string }).name !== "AbortError") {
          console.error("Failed to fetch menu:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(menu.map((item) => item.category));
    return ["All", ...Array.from(unique)];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    if (activeCategory === "All") return menu;
    return menu.filter((item) => item.category === activeCategory);
  }, [menu, activeCategory]);

  return {
    menu: filteredMenu,
    loading,
    categories,
    activeCategory,
    setActiveCategory,
  };
}
