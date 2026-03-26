import { useState } from "react";
import type { OrderMode } from "@/app/types";

export type User = {
  name: string;
  phone: string;
  note?: string;
  orderMode: OrderMode;
  numberOfPeople: number;
  arrivalTime: string;
  selectedTableId: string;
  selectedSeats: string[];
  address: string;
  deliveryTime: string;
  pickupTime: string;
  reservationConfirmed: boolean;
};

const EMPTY_USER: User = {
  name: "",
  phone: "",
  note: "",
  orderMode: "Takeaway",
  numberOfPeople: 2,
  arrivalTime: "",
  selectedTableId: "",
  selectedSeats: [],
  address: "",
  deliveryTime: "",
  pickupTime: "",
  reservationConfirmed: false,
};

export function useUser() {
  const [user, setUser] = useState<User>(EMPTY_USER);

  const updateUser = <K extends keyof User>(field: K, value: User[K]) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const resetUser = () => {
    setUser(EMPTY_USER);
  };

  const setOrderMode = (mode: OrderMode) => {
    setUser((prev) => ({
      ...prev,
      orderMode: mode,
      reservationConfirmed: mode === "Dine-in" ? prev.reservationConfirmed : false,
      selectedTableId: mode === "Dine-in" ? prev.selectedTableId : "",
      selectedSeats: mode === "Dine-in" ? prev.selectedSeats : [],
    }));
  };

  return {
    user,
    updateUser,
    setOrderMode,
    resetUser,
  };
}
