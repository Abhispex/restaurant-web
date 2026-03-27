"use client";

import { useEffect, useState } from "react";
import MenuForm from "../components/MenuForm";
import MenuList from "../components/MenuList";
import Toast from "../components/Toast";
import { useAdminMenu } from "../hooks/useAdminMenu";
import type { AdminMenuItem } from "../types";

export default function AdminMenuPage() {
  const { items, isReady, createItem, updateItem, deleteItem, toggleAvailability } = useAdminMenu();
  const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <section className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div>
        <h1 className="text-2xl font-semibold text-white">Menu Management</h1>
        <p className="mt-1 text-sm text-slate-400">Add, update, delete and toggle stock status for menu items.</p>
      </div>

      <MenuForm
        editingItem={editingItem}
        onCancelEdit={() => setEditingItem(null)}
        onSubmit={(input) => {
          if (editingItem) {
            updateItem(editingItem.id, input);
            setEditingItem(null);
            setToast({ message: "Menu item updated", type: "success" });
            return;
          }
          createItem(input);
          setToast({ message: "Menu item added", type: "success" });
        }}
      />

      {!isReady ? (
        <p className="text-slate-300">Loading menu items...</p>
      ) : (
        <MenuList
          items={items}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(id) => {
            deleteItem(id);
            setToast({ message: "Menu item deleted", type: "success" });
          }}
          onToggleStock={(id) => {
            toggleAvailability(id);
            setToast({ message: "Stock status updated", type: "success" });
          }}
        />
      )}
    </section>
  );
}
