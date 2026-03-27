"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { useAdminAuth } from "./hooks/useAdminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady } = useAdminAuth();
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated && !isLoginRoute) router.replace("/admin/login");
    if (isAuthenticated && isLoginRoute) router.replace("/admin/dashboard");
  }, [isAuthenticated, isLoginRoute, isReady, router]);

  if (!isReady) return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Loading admin...</div>;
  if (!isAuthenticated && !isLoginRoute) return null;
  if (isAuthenticated && isLoginRoute) return null;

  if (isLoginRoute) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 md:flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
