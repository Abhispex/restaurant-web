"use client";

import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import { useAdminMenu } from "../hooks/useAdminMenu";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { stats, isReady, syncFromWebsite } = useAdminMenu();
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  if (!isReady) return <p className="text-slate-300">Loading dashboard...</p>;

  return (
    <section className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Quick overview of your menu and stock status.</p>
        <button
          type="button"
          onClick={async () => {
            setIsSyncing(true);
            try {
              await syncFromWebsite();
              setToast({ message: "Menu synced from website source", type: "success" });
            } catch {
              setToast({ message: "Failed to sync menu", type: "error" });
            } finally {
              setIsSyncing(false);
            }
          }}
          className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
        >
          {isSyncing ? "Syncing..." : "Sync Website Menu"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Items" value={stats.total} />
        <StatCard label="In Stock" value={stats.inStock} />
        <StatCard label="Out Of Stock" value={stats.outOfStock} />
        <StatCard label="Categories" value={stats.categories} />
      </div>
    </section>
  );
}
