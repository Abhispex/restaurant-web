"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./hooks/useAdminAuth";

export default function AdminIndexPage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAdminAuth();

  useEffect(() => {
    if (!isReady) return;
    router.replace(isAuthenticated ? "/admin/dashboard" : "/admin/login");
  }, [isAuthenticated, isReady, router]);

  return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Redirecting...</div>;
}
