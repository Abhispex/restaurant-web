"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "../hooks/useAdminAuth";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Offers", href: "/admin/offers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-full border-b border-slate-800 bg-slate-950 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between px-5 py-4 md:block md:px-6 md:py-7">
        <p className="text-lg font-semibold text-white">Restaurant Admin</p>
        <button
          type="button"
          onClick={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800 md:mt-5"
        >
          Logout
        </button>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:block md:space-y-2 md:px-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                active ? "bg-sky-500/20 text-sky-300" : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
