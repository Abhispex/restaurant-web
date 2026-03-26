import { buildWhatsAppMessage } from "./whatsapp";

type OrderSummaryPayload = {
  user?: unknown;
  cart?: unknown;
  total?: number;
  totalAmount?: number;
  customer?: {
    name?: string;
    phone?: string;
    orderMode?: string;
    note?: string;
    numberOfPeople?: number;
    arrivalTime?: string;
    selectedTableId?: string;
    selectedSeats?: string[];
    address?: string;
    deliveryTime?: string;
    pickupTime?: string;
  };
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    total?: number;
  }>;
};

export async function generateAIOrderSummary(payload: OrderSummaryPayload) {
  const res = await fetch("/api/ai/order_summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (payload?.user && payload?.cart) {
      return {
      summary: buildWhatsAppMessage(
        payload.user as Parameters<typeof buildWhatsAppMessage>[0],
        payload.cart as Parameters<typeof buildWhatsAppMessage>[1],
        payload.total ?? payload.totalAmount ?? 0
      ),
      source: "fallback",
    };
    }

    const orderMode = payload?.customer?.orderMode ?? "Takeaway";
    const modeDetails =
      orderMode === "Dine-in"
        ? `Number of People: ${payload?.customer?.numberOfPeople ?? "-"}\nTime: ${payload?.customer?.arrivalTime || "-"}`
        : orderMode === "Delivery"
        ? `Address: ${payload?.customer?.address || "-"}\nTime: ${payload?.customer?.deliveryTime || "-"}`
        : `Time: ${payload?.customer?.pickupTime || "-"}`;

    const fallbackSummary = `
*New Order*

Name: ${payload?.customer?.name ?? "Guest"}
Phone: ${payload?.customer?.phone ?? "Not Provided"}
${modeDetails}
Note: ${payload?.customer?.note ?? "-"}

Items:
${(payload?.items ?? [])
  .map((item, idx: number) => `${idx + 1}. ${item.name} x${item.quantity} = Rs ${item.total ?? item.price * item.quantity}`)
  .join("\n")}

Total: Rs ${payload?.totalAmount ?? 0}

Please confirm availability.
`.trim();

    return {
      summary: fallbackSummary,
      source: "fallback",
    };
  }

  return res.json();
}
