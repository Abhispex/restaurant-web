"use client";

import Link from "next/link";
import { useCart } from "@/app/hooks/useCart";

export default function CartPage() {
  const { cart, cartCount, cartTotal, increaseQty, decreaseQty } = useCart();

  if (cartCount === 0) {
    return (
      <main className="min-h-screen bg-[#06090f] px-6 py-14 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-semibold">Your Cart Is Empty</h1>
          <p className="mt-3 text-white/70">Add dishes from the menu to continue with your order.</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#c19a6b] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06090f] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#e9cfac]">Step 1 of 2</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Your Cart</h1>
          </div>
          <Link href="/" className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/85 hover:bg-white/10">
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-white/60">
                    Rs {item.price} x {item.quantity}
                  </p>
                </div>
                <p className="text-lg font-semibold text-[#f4d7b0]">Rs {item.price * item.quantity}</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.name)}
                  className="h-9 w-9 rounded-full bg-[#c19a6b] text-black transition hover:brightness-110"
                >
                  -
                </button>
                <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.name)}
                  className="h-9 w-9 rounded-full bg-[#c19a6b] text-black transition hover:brightness-110"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-white/80">Items</span>
            <span>{cartCount}</span>
          </div>
          <div className="mb-6 flex items-center justify-between text-xl">
            <span className="text-white/85">Total</span>
            <span className="font-semibold text-[#f4d7b0]">Rs {cartTotal}</span>
          </div>
          <Link
            href="/checkout"
            className="inline-flex w-full justify-center rounded-xl bg-[#c19a6b] px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Order Now
          </Link>
        </div>
      </div>
    </main>
  );
}
