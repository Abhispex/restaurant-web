export type MenuItem = {
  name: string;
  description: string;
  price: string; // from API
  category: string;
  image: string;
};

export type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

export type OrderMode = "Takeaway" | "Dine-in" | "Delivery";

export type ArrivalTimeOption =
  | "12:00 PM"
  | "12:30 PM"
  | "01:00 PM"
  | "01:30 PM"
  | "06:00 PM"
  | "06:30 PM"
  | "07:00 PM"
  | "07:30 PM"
  | "08:00 PM"
  | "08:30 PM"
  | "09:00 PM";

export type ReservationTable = {
  id: string;
  label: string;
  seats: number;
  occupiedSeats: string[];
};

export type Userdetails = {
  name: string;
  phone: string;
  note?: string;
  orderMode?: OrderMode;
  numberOfPeople?: number;
  arrivalTime?: string;
  selectedTableId?: string;
  selectedSeats?: string[];
  address?: string;
  deliveryTime?: string;
  pickupTime?: string;
};
