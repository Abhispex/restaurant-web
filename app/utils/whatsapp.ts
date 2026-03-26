import type { User } from "@/app/hooks/useUser";
import type { CartItem } from "@/app/types";

export function buildWhatsAppMessage(user: User, cart: CartItem[], total: number): string {
  const itemsText = cart.map((item, i) => `${i + 1}. ${item.name} x${item.quantity} = Rs ${item.price * item.quantity}`).join("\n");

  const modeDetails =
    user.orderMode === "Dine-in"
      ? `Number of People: ${user.numberOfPeople || "-"}\nTime: ${user.arrivalTime || "-"}`
      : user.orderMode === "Delivery"
      ? `Address: ${user.address || "-"}\nTime: ${user.deliveryTime || "-"}`
      : `Time: ${user.pickupTime || "-"}`;
  const deliveryLocationPrompt =
    user.orderMode === "Delivery" ? "\n\nPlease share your current location on WhatsApp for delivery." : "";

  return `
*New Order*

Name: ${user.name || "Guest"}
Phone: ${user.phone || "Not Provided"}
${modeDetails}
Note: ${user.note || "-"}

Items:
${itemsText}

Total: Rs ${total}
${deliveryLocationPrompt}
`.trim();
}

export function openWhatsAppOrder(message: string) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!phoneNumber) return;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
}
