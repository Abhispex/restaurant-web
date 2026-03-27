"use client";

import { useEffect, useState } from "react";
import type { AdminMenuInput } from "../hooks/useAdminMenu";
import type { AdminMenuItem } from "../types";

type MenuFormProps = {
  editingItem: AdminMenuItem | null;
  onCancelEdit: () => void;
  onSubmit: (input: AdminMenuInput) => void;
};

const emptyForm: AdminMenuInput = {
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  category: "",
  inStock: true,
};

export default function MenuForm({ editingItem, onCancelEdit, onSubmit }: MenuFormProps) {
  const [form, setForm] = useState<AdminMenuInput>(emptyForm);

  useEffect(() => {
    if (!editingItem) {
      setForm(emptyForm);
      return;
    }
    setForm({
      name: editingItem.name,
      description: editingItem.description,
      price: editingItem.price,
      imageUrl: editingItem.imageUrl,
      category: editingItem.category,
      inStock: editingItem.inStock,
    });
  }, [editingItem]);

  return (
    <form
      className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.category.trim() || !form.imageUrl.trim() || form.price <= 0) return;
        onSubmit({
          name: form.name.trim(),
          description: form.description.trim(),
          price: form.price,
          imageUrl: form.imageUrl.trim(),
          category: form.category.trim(),
          inStock: form.inStock,
        });
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{editingItem ? "Edit Item" : "Add New Item"}</h2>
        {editingItem && (
          <button type="button" onClick={onCancelEdit} className="text-sm text-slate-300 hover:text-white">
            Cancel
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          placeholder="Item name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
        />
        <input
          type="number"
          min={1}
          step="0.01"
          placeholder="Price (Rs)"
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
        />
        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
        />
      </div>

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        rows={3}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
      />

      <label className="flex items-center gap-2 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={form.inStock}
          onChange={(e) => setForm((prev) => ({ ...prev, inStock: e.target.checked }))}
        />
        In stock
      </label>

      <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">
        {editingItem ? "Update Item" : "Add Item"}
      </button>
    </form>
  );
}
