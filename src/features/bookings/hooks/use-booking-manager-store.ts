"use client";
import { differenceInCalendarDays } from "date-fns";
import { create } from "zustand";

type DateRange = { from?: Date; to?: Date };

type BookingManagerStoreState = {
    cabinPrice?: number;
    cabinDiscount?: number;
    breakfastPrice?: number;
    bookingCabinPrice?: number;
    bookingBreakfastPrice?: number;
    bookingTotalPrice?: number;
    selectedDates?: DateRange;
    isBreakfast?: boolean;
    numOfGuests: number;
    numOfNights?: number;
};

type BookingManagerStoreActions = {
    setCabinPrice: (price: number) => void;
    setCabinDiscount: (discount: number) => void;
    setBreakfastPrice: (price: number) => void;
    setNumOfGuests: (count: number) => void;
    setIsBreakfast: (enabled: boolean) => void;
    setSelectedDates: (dates?: DateRange) => void;
};

export const useBookingManagerStore = create<
    BookingManagerStoreState & BookingManagerStoreActions
>((set, get) => {
    function recalculatePrices() {
        const {
            cabinPrice,
            cabinDiscount,
            breakfastPrice,
            isBreakfast,
            numOfNights,
            numOfGuests,
        } = get();

        const bookingCabinPrice = calculateCabinPrice(
            cabinPrice,
            cabinDiscount,
            numOfNights,
        );

        const bookingBreakfastPrice = calculateBreakfastPrice(
            isBreakfast,
            breakfastPrice,
            numOfNights,
            numOfGuests,
        );

        const bookingTotalPrice = calculateTotalPrice(
            bookingCabinPrice,
            bookingBreakfastPrice,
        );

        set({ bookingCabinPrice, bookingBreakfastPrice, bookingTotalPrice });
    }

    return {
        cabinPrice: undefined,
        cabinDiscount: undefined,
        breakfastPrice: undefined,
        bookingCabinPrice: undefined,
        bookingBreakfastPrice: undefined,
        bookingTotalPrice: undefined,
        selectedDates: undefined,
        isBreakfast: undefined,
        numOfGuests: 1,
        numOfNights: undefined,

        setCabinPrice: price => {
            set({ cabinPrice: price });
            recalculatePrices();
        },

        setCabinDiscount: discount => {
            set({ cabinDiscount: discount });
            recalculatePrices();
        },

        setBreakfastPrice: price => {
            set({ breakfastPrice: price });
            recalculatePrices();
        },

        setNumOfGuests: count => {
            set({ numOfGuests: count });
            recalculatePrices();
        },

        setIsBreakfast: enabled => {
            set({ isBreakfast: enabled });
            recalculatePrices();
        },

        setSelectedDates: dates => {
            const numOfNights = calculateNumOfNights(dates);
            set({ selectedDates: dates, numOfNights });
            recalculatePrices();
        },
    };
});

function calculateNumOfNights(dates?: DateRange) {
    if (dates?.from && dates?.to) {
        return differenceInCalendarDays(dates.to, dates.from);
    }
    return undefined;
}

function calculateCabinPrice(
    price?: number,
    discount?: number,
    nights?: number,
) {
    return price && nights ? (price - (discount ?? 0)) * nights : undefined;
}

function calculateBreakfastPrice(
    isEnabled?: boolean,
    price?: number,
    nights?: number,
    guests?: number,
) {
    return isEnabled && price && nights && guests
        ? price * nights * guests
        : undefined;
}

function calculateTotalPrice(cabin?: number, breakfast?: number) {
    return cabin !== undefined ? cabin + (breakfast ?? 0) : undefined;
}
