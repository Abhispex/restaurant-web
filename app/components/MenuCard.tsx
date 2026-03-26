import { motion } from "framer-motion";
import Image from "next/image";
import type { MenuItem } from "../types";

type MenuCardProps = {
  item: MenuItem;
  quantity: number;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (itemName: string) => void;
};

export default function MenuCard({ item, quantity, onIncrement, onDecrement }: MenuCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs text-white/85">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold tracking-wide">{item.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/65">{item.description}</p>

        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="text-xl font-semibold text-[#ffd3a6]">Rs {item.price}</p>

          {quantity > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-2 py-1">
              <button
                onClick={() => onDecrement(item.name)}
                aria-label={`Decrease ${item.name} quantity`}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                -
              </button>
              <motion.span key={quantity} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-6 text-center font-semibold">
                {quantity}
              </motion.span>
              <button
                onClick={() => onIncrement(item)}
                aria-label={`Increase ${item.name} quantity`}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#c19a6b] text-black transition hover:brightness-110"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onIncrement(item)}
              className="rounded-full bg-[#c19a6b] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
