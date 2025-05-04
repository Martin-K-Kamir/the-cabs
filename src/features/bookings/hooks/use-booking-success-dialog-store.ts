"use client";
import { create } from "zustand";
import { type BookingId } from "@/features/bookings";
import { type CabinPreviewLocation } from "@/features/cabins";

type BookingData = {
    id: BookingId;
    cabinName: string;
    cabinLocation: CabinPreviewLocation;
    startDate: Date | string;
    endDate: Date | string;
    totalPrice: number;
    numOfGuests: number;
    isBreakfast: boolean;
};

type OpenDialogAction =
    | { open: true; bookingData: BookingData }
    | { open: false };

type BookingSuccessDialogState = {
    open: boolean;
    bookingData: BookingData | null;
    setOpen: (action: OpenDialogAction) => void;
};

export const useBookingSuccessDialogStore = create<BookingSuccessDialogState>()(
    set => ({
        open: false,
        bookingData: null,
        setOpen: action => {
            if (action.open) {
                set({ open: true, bookingData: action.bookingData });
            } else {
                set({ open: false });
            }
        },
    }),
);
