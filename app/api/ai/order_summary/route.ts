import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type OrderRequest = {
  customer?: {
    name?: string;
    phone?: string;
    note?: string;
    orderMode?: string;
    numberOfPeople?: number;
    arrivalTime?: string;
    selectedTableId?: string;
    selectedSeats?: string[];
    address?: string;
    deliveryTime?: string;
    pickupTime?: string;
  };
  items?: Array<{
    quantity: number;
    name: string;
  }>;
  totalAmount?: number;
};

export async function POST(req: NextRequest) {
  try {
    const order = (await req.json()) as OrderRequest;

    const itemsText = order.items?.length ? order.items.map((item) => `- ${item.quantity}x ${item.name}`).join("\n") : "No items";
    const orderMode = order.customer?.orderMode || "Takeaway";
    const modeDetails =
      orderMode === "Dine-in"
        ? `Number of People: ${order.customer?.numberOfPeople ?? "-"}\nTime: ${order.customer?.arrivalTime || "-"}`
        : orderMode === "Delivery"
        ? `Address: ${order.customer?.address || "-"}\nTime: ${order.customer?.deliveryTime || "-"}`
        : `Time: ${order.customer?.pickupTime || "-"}`;

    const prompt = `
You are a restaurant assistant.
Summarize this food order in a friendly, short format.
Do NOT calculate prices. Use given values only.
Use only these customer fields based on order mode:
- Dine-in: Name, Phone, Number of People, Time, Note
- Takeaway: Name, Phone, Time, Note
- Delivery: Name, Phone, Address, Time, Note
Do not include table, seats, or any other customer field.
Keep the message concise and include items and total.

Name: ${order.customer?.name || "Guest"}
Phone: ${order.customer?.phone || "Not Provided"}
Order Mode: ${orderMode}
${modeDetails}
Note: ${order.customer?.note || "-"}
Items: ${itemsText}
Total Amount: ${order.totalAmount ?? 0}

Return only the message text.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      temperature: 0.3,
    });

    const summary = response.output_text || "Order received. Please confirm availability.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI ORDER SUMMARY ERROR:", error);
    return NextResponse.json({ error: "AI summary failed" }, { status: 500 });
  }
}
