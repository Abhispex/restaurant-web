"use client";

type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export default function Toast({ message, type = "success" }: ToastProps) {
  return (
    <div
      className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-2 text-sm ${
        type === "success"
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
          : "border-rose-400/40 bg-rose-500/15 text-rose-200"
      }`}
    >
      {message}
    </div>
  );
}
