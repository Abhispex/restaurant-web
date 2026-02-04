type MenuItem = {
  name: string;
  description: string;
  price: string;
};

import { motion } from "framer-motion";

export default function MenuCard({ item }: { item: any }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 overflow-hidden"
    >
 <div className="relative h-40 w-full overflow-hidden">
    <img
      src={item.image}
      alt={item.name}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={(e) => {
         e.currentTarget.src = "/fallback-food.jpg";
      }}
    />
  </div>

  <div className="p-6">
    <h3 className="text-lg font-semibold">{item.name}</h3>
    <p className="text-sm text-gray-400 mt-1">{item.description}</p>

    <div className="mt-4 text-xl font-bold text-emerald-400">
      ₹{item.price}
    </div>
  </div>
</motion.div>
  );
}
