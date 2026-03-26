"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MenuCard from "./components/MenuCard";
import MenuSkeleton from "./components/MenuSkeleton";
import { useCart } from "@/app/hooks/useCart";
import { useMenu } from "@/app/hooks/useMenu";

type DemoReview = {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
};

const demoReviews: DemoReview[] = [
  {
    id: 1,
    name: "Ayesha K",
    rating: 5,
    date: "2 weeks ago",
    comment: "Beautiful ambiance and very fast service. The grilled platter was excellent and portions were generous.",
  },
  {
    id: 2,
    name: "Rohan M",
    rating: 5,
    date: "1 month ago",
    comment: "Ordering from the site was simple, and everything arrived fresh and hot. Will order again.",
  },
  {
    id: 3,
    name: "Sara J",
    rating: 4,
    date: "3 weeks ago",
    comment: "Great flavors and friendly staff. Loved the presentation. Dessert options could be expanded.",
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${filled ? "fill-[#fbbc04]" : "fill-slate-600"}`}
            aria-hidden="true"
          >
            <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { cartCount, addToCart, decreaseQty, getItemQuantity } = useCart();
  const { menu, loading, categories, activeCategory, setActiveCategory } = useMenu();

  const hasAnyMenuData = categories.length > 1;
  const showEmptyCategory = !loading && hasAnyMenuData && menu.length === 0;
  const quickStats = useMemo(
    () => [
      { label: "Chef Specials", value: String(Math.max(menu.length, 12)) },
      { label: "Avg. Delivery", value: "25 min" },
      { label: "Top Rating", value: "4.8/5" },
    ],
    [menu.length]
  );

  if (loading) return <MenuSkeleton />;

  if (!hasAnyMenuData) {
    return (
      <main className="min-h-screen bg-[#0a0e14] text-white grid place-items-center px-6">
        <div className="max-w-xl text-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold tracking-wide">Menu Coming Soon</h1>
          <p className="mt-3 text-white/70">We are preparing a premium dining experience for you.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06090f] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(193,154,107,0.22),transparent_38%),radial-gradient(circle_at_85%_80%,rgba(17,102,102,0.18),transparent_40%),linear-gradient(180deg,#06090f_0%,#0c1320_100%)]" />

      <section className="relative min-h-[100svh] flex items-center px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <p className="inline-flex rounded-full border border-[#c19a6b]/40 bg-[#c19a6b]/12 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e9cfac]">
              Signature Kitchen
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              A premium dining experience that fits perfectly on every screen.
            </h1>
            <p className="max-w-2xl text-base text-white/70 sm:text-lg">
              Explore curated dishes, place your order in seconds, and track your selections from a refined cart
              experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-2xl bg-[#c19a6b] px-7 py-3 text-sm font-semibold text-black transition hover:brightness-110"
              >
                Explore Menu
              </button>
              <a
                href="tel:+971569314274"
                className="rounded-2xl border border-white/25 px-7 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Call for Reservation
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_20px_90px_rgba(0,0,0,0.35)]"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">Restaurant Highlights</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#f4d7b0]">{stat.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-white/65">Handcrafted menu. Fast ordering. Elevated visual experience.</p>
          </motion.div>
        </div>
      </section>

      <section id="menu" className="mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                activeCategory === cat
                  ? "border-[#c19a6b] bg-[#c19a6b] text-black"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="mb-10 text-center text-3xl font-semibold tracking-wide sm:text-4xl">Curated Menu</h2>

        {showEmptyCategory && (
          <p className="py-16 text-center text-white/60">No dishes available in this category.</p>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {menu.map((item) => (
              <MenuCard
                key={item.name}
                item={item}
                quantity={getItemQuantity(item.name)}
                onIncrement={addToCart}
                onDecrement={decreaseQty}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-28 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#fbbc04]">Google Reviews</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-wide sm:text-4xl">What Guests Are Saying</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-2xl font-semibold text-[#f4d7b0]">4.9 / 5</p>
            <div className="mt-2">
              <RatingStars rating={5} />
            </div>
            <p className="mt-1 text-xs text-white/60">{demoReviews.length} Reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {demoReviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#1a73e8] text-sm font-semibold text-white">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{review.name}</p>
                    <p className="text-xs text-white/55">{review.date}</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/15 bg-black/25 px-2 py-1 text-[11px] text-white/70">
                  Google
                </span>
              </div>

              <div className="mt-4">
                <RatingStars rating={review.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{review.comment}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {cartCount > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-[#c19a6b] px-5 py-3 text-black shadow-xl transition hover:brightness-110"
        >
          <span className="font-semibold">Cart</span>
          <span className="rounded-full bg-black px-2 py-0.5 text-xs font-semibold text-white">{cartCount}</span>
        </Link>
      )}
    </main>
  );
}
