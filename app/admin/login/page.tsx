"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const ok = login(password);
          if (!ok) {
            setError("Invalid password");
            return;
          }
          setError("");
          router.replace("/admin/dashboard");
        }}
      >
        <p className="text-sm text-slate-400">Admin Portal</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Enter your admin password to continue.</p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
        />

        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

        <button type="submit" className="mt-4 w-full rounded-lg bg-sky-600 py-2 text-sm font-medium text-white hover:bg-sky-500">
          Login
        </button>
      </form>
    </div>
  );
}
