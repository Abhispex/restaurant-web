"use client";

import type { AdminMenuItem } from "../types";

type MenuListProps = {
  items: AdminMenuItem[];
  onEdit: (item: AdminMenuItem) => void;
  onDelete: (id: string) => void;
  onToggleStock: (id: string) => void;
};

export default function MenuList({ items, onEdit, onDelete, onToggleStock }: MenuListProps) {
  const formatRupees = (value: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

  if (items.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">No menu items added yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 bg-slate-900 px-4 py-3 text-xs uppercase tracking-wide text-slate-400 md:grid">
        <span>Item</span>
        <span>Category</span>
        <span>Price</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-slate-800 bg-slate-950/70">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 px-4 py-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] md:items-center">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
              <div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
              </div>
            </div>
            <span className="text-sm text-slate-300">{item.category}</span>
            <span className="text-sm text-slate-200">{formatRupees(item.price)}</span>
            <span
              className={`inline-flex w-fit rounded-full px-2 py-1 text-xs ${
                item.inStock ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {item.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onEdit(item)} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
                Edit
              </button>
              <button
                onClick={() => onToggleStock(item.id)}
                className="rounded-md bg-amber-500/20 px-2 py-1 text-xs text-amber-300 hover:bg-amber-500/30"
              >
                Toggle
              </button>
              <button onClick={() => onDelete(item.id)} className="rounded-md bg-rose-500/20 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/30">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
