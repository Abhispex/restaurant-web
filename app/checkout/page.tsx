"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/app/hooks/useCart";
import { useUser } from "@/app/hooks/useUser";
import type { OrderMode } from "@/app/types";
import { isValidPhone } from "@/app/utils/validator";
import { buildWhatsAppMessage } from "@/app/utils/whatsapp";

const orderModes: OrderMode[] = ["Dine-in", "Takeaway", "Delivery"];
/*payment methords*/
const paymentOptions = [
  { id: "upi", label: "UPI Payment" },
  { id: "card", label: "Debit/Credit Card" },
  { id: "cash", label: "Cash On Delivery" },
] as const;

type PaymentOption = (typeof paymentOptions)[number]["id"];

type FormErrors = {
  phone?: string;
  address?: string;
  arrivalTime?: string;
};

const subscribeToHydration = () => () => {};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, clearCart } = useCart();
  const { user, updateUser, setOrderMode } = useUser();

  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>("upi");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isSubmittingRef = useRef(false);
  const isMounted = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[#06090f] px-6 py-10 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/70">Loading checkout...</p>
        </div>
      </main>
    );
  }

  if (cartCount === 0) {
    return (
      <main className="min-h-screen bg-[#06090f] px-6 py-14 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-semibold">No Items To Checkout</h1>
          <p className="mt-3 text-white/70">Your cart is empty. Add dishes before completing an order.</p>
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

  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod)?.label ?? "UPI (Demo)";

  const handleCompleteOrder = () => {
    if (isPlacingOrder || isSubmittingRef.current || cart.length === 0) return;
    isSubmittingRef.current = true;
    setIsPlacingOrder(true);

    const newErrors: FormErrors = {};
    if (!user.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(user.phone)) {
      newErrors.phone = "Kindly enter a valid 10-digit mobile number";
    }
    if (user.orderMode === "Delivery" && !user.address.trim()) {
      newErrors.address = "Address is required for delivery";
    }
    if (user.orderMode === "Dine-in" && !user.arrivalTime.trim()) {
      newErrors.arrivalTime = "Arrival time is required for dine-in";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsPlacingOrder(false);
      isSubmittingRef.current = false;
      return;
    }

    setErrors({});

    const enrichedNote = [user.note?.trim(), `Payment Method: ${selectedPayment}`].filter(Boolean).join(" | ");
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!phoneNumber) {
      setIsPlacingOrder(false);
      isSubmittingRef.current = false;
      return;
    }

    const message = encodeURIComponent(
      buildWhatsAppMessage(
        {
          ...user,
          note: enrichedNote,
        },
        cart,
        cartTotal
      )
    );

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");

    setTimeout(() => {
      clearCart();
      setIsPlacingOrder(false);
      isSubmittingRef.current = false;
      router.push("/");
    }, 500);
  };

  return (
    <main className="min-h-screen bg-[#06090f] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.35fr_0.8fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#e9cfac]">Step 2 of 2</p>
              <h1 className="mt-2 text-3xl font-semibold">Order Details</h1>
            </div>
            <Link href="/cart" className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/85 hover:bg-white/10">
              Back to Cart
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-white/70">Order Type</p>
              <div className="grid grid-cols-3 gap-2">
                {orderModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOrderMode(mode)}
                    className={`rounded-xl border px-2 py-2 text-xs font-semibold transition sm:text-sm ${
                      user.orderMode === mode
                        ? "border-[#c19a6b] bg-[#c19a6b] text-black"
                        : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Your name"
              value={user.name}
              onChange={(e) => updateUser("name", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={user.phone}
              onChange={(e) => {
                updateUser("phone", e.target.value);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
            />
            {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}

            {user.orderMode === "Dine-in" && (
              <>
                <input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Number of people"
                  value={user.numberOfPeople}
                  onChange={(e) => updateUser("numberOfPeople", Number(e.target.value) || 1)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
                />
                <input
                  type="time"
                  value={user.arrivalTime}
                  onChange={(e) => {
                    updateUser("arrivalTime", e.target.value);
                    setErrors((prev) => ({ ...prev, arrivalTime: undefined }));
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
                />
                {errors.arrivalTime && <p className="text-sm text-red-400">{errors.arrivalTime}</p>}
              </>
            )}

            {user.orderMode === "Delivery" && (
              <>
                <input
                  type="text"
                  placeholder="Delivery address"
                  value={user.address}
                  onChange={(e) => {
                    updateUser("address", e.target.value);
                    setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
                />
                {errors.address && <p className="text-sm text-red-400">{errors.address}</p>}
                <input
                  type="time"
                  value={user.deliveryTime}
                  onChange={(e) => updateUser("deliveryTime", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
                />
              </>
            )}

            {user.orderMode === "Takeaway" && (
              <input
                type="time"
                value={user.pickupTime}
                onChange={(e) => updateUser("pickupTime", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
              />
            )}

            <textarea
              placeholder="Order note (optional)"
              value={user.note}
              onChange={(e) => updateUser("note", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 outline-none placeholder:text-white/40 focus:border-[#c19a6b]"
            />
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Payment (Demo)</h2>
          <div className="mt-4 space-y-2">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentMethod(option.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  paymentMethod === option.id
                    ? "border-[#c19a6b] bg-[#c19a6b]/20 text-[#f4d7b0]"
                    : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
              <span>Items</span>
              <span>{cartCount}</span>
            </div>
            <div className="mb-4 space-y-1 text-sm text-white/75">
              {cart.map((item) => (
                <div key={`checkout-item-${item.name}`} className="flex items-center justify-between gap-3">
                  <span className="truncate">{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mb-5 flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="font-semibold text-[#f4d7b0]">Rs {cartTotal}</span>
            </div>
            <button
              onClick={handleCompleteOrder}
              disabled={!user.phone || isPlacingOrder}
              className={`w-full rounded-xl py-3 font-semibold transition ${
                !user.phone || isPlacingOrder
                  ? "cursor-not-allowed bg-gray-500/40 text-white/40"
                  : "bg-[#c19a6b] text-black hover:brightness-110"
              }`}
            >
              {isPlacingOrder ? "Completing..." : "Complete Order"}
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
