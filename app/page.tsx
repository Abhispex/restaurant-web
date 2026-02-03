"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuCard from "./components/MenuCard";


export default function Home() {
  type MenuItem = {
  name: string;
  description: string;
  price: string;
  category: string;
};

const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`)
      .then((res) => res.json())
      .then((data) => {
        setMenu(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
        setLoading(false);
      });
  }, []);

  const filteredMenu =
  selectedCategory === "All"
    ? menu
    : menu.filter(
        (item) => item.category === selectedCategory
      );

  return (
    <main className="min-h-screen px-6">
     <div className="min-h-screen px-6 bg-gradient-to-b from-black via-slate-900 to-black">

      {/* HERO */}
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass max-w-3xl text-center p-10 rounded-2xl"
        >
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
            The Future of Dining
          </h1>

          <p className="mt-6 text-white/70 text-lg">
            Smart websites. AI-powered calls. Zero missed customers.
          </p>

          <div className="mt-10 flex gap-4 justify-center">
            <button
  onClick={() => {
    document.getElementById("menu")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:scale-105 transition"
>
  View Menu
</button>
         <button
  onClick={() => window.location.href = "tel:+9710569314274"}
  className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
>
  Call Now
</button>

          </div>
        </motion.div>
        </div>
      </div>

      {/* MENU */}
      <section id = "menu" className="max-w-6xl mx-auto py-20">
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
  {["All", "Rice", "Curry", "Grill"].map((cat) => (
    <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      className={`px-5 py-2 rounded-full border transition
        ${
          selectedCategory === cat
            ? "bg-white text-black"
            : "border-white/30 text-white hover:bg-white/10"
        }`}
    >
      {cat}
    </button>
  ))}
</div>
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Popular Dishes
        </h2>

        {loading ? (
          <p className="text-center text-white/60">Loading menu...</p>
        ) : (

 <motion.div
  layout
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
>
  {filteredMenu.map((item, index) => (
    <motion.div
      key={`${item.name}-${item.category}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <MenuCard item={item} />
    </motion.div>
  ))}
</motion.div>

        )}
      </section>
    </main>
  );
}
