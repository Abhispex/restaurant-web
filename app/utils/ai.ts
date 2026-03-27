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