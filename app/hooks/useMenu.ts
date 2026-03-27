import { useEffect, useMemo, useState } from "react";
import type { MenuItem } from "@/app/types";

export function useMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");
    const fallbackUrl = "https://restaurant-api-jbw2.onrender.com";
    const urlsToTry = [baseUrl, fallbackUrl].filter((url, index, arr) => Boolean(url) && arr.indexOf(url) === index);

    async function loadMenu() {
      try {
        let data: MenuItem[] | null = null;

        for (const url of urlsToTry) {
          try {
            const res = await fetch(`${url}/menu`, {
              signal: controller.signal,
            });
            if (!res.ok) continue;
            data = (await res.json()) as MenuItem[];
            break;
          } catch (error: unknown) {
            if ((error as { name?: string }).name === "AbortError") {
              throw error;
            }
          }
        }

        if (!data) {
          throw new Error("Unable to load menu from configured API URLs.");
        }

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
