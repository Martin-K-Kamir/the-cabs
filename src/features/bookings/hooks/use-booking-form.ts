"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { createBookingSchema } from "@/features/bookings/lib/schemas";
import type { CabinId } from "@/features/cabins/lib/types";
import { useBookingManagerStore } from "@/features/bookings/hooks/use-booking-manager-store";
import { useBookingDates } from "@/features/bookings/hooks/use-booking-dates";

export type UseBookingFormProps = {
    cabinId: CabinId;
    cabinPrice: number;
    cabinDiscount?: number;
    breakfastPrice: number;
    minNumOfNights: number;
    maxNumOfNights: number;
    minNumOfGuests: number;
    maxNumOfGuests: number;
};

export function useBookingForm({
    cabinId,
    cabinPrice,
    cabinDiscount = 0,
    breakfastPrice,
    minNumOfNights,
    maxNumOfNights,
    minNumOfGuests,
    maxNumOfGuests,
}: UseBookingFormProps) {
    const setSelectedDates = useBookingManagerStore(
        state => state.setSelectedDates,
    );
    const setIsBreakfast = useBookingManagerStore(
        state => state.setIsBreakfast,
    );
    const setNumOfGuests = useBookingManagerStore(
        state => state.setNumOfGuests,
    );
    const setCabinPrice = useBookingManagerStore(state => state.setCabinPrice);
    const setCabinDiscount = useBookingManagerStore(
        state => state.setCabinDiscount,
    );
    const setBreakfastPrice = useBookingManagerStore(
        state => state.setBreakfastPrice,
    );

    const form = useForm<z.infer<typeof createBookingSchema>>({
        resolver: zodResolver(createBookingSchema),
        defaultValues: {
            minNumOfNights,
            maxNumOfNights,
            minNumOfGuests,
            maxNumOfGuests,
            dates: {
                from: undefined,
                to: undefined,
            },
            guests: {
                adults: Math.min(minNumOfGuests, 1),
                children: 0,
            },
            isBreakfast: false,
            selectedDate: new Date(),
        },
    });

    const selectedDate = useWatch({
        control: form.control,
        name: "selectedDate",
    });
    const dates = useWatch({
        control: form.control,
        name: "dates",
    });
    const guests = useWatch({
        control: form.control,
        name: "guests",
    });
    const isBreakfast = useWatch({
        control: form.control,
        name: "isBreakfast",
    });

    const availableDatesQuery = useBookingDates({
        cabinId,
        date: selectedDate ?? new Date(),
    });

    useEffect(() => {
        setCabinPrice(cabinPrice);
        setCabinDiscount(cabinDiscount);
        setBreakfastPrice(breakfastPrice);
    }, [cabinPrice, cabinDiscount, breakfastPrice]);

    useEffect(() => {
        setSelectedDates(dates);
    }, [dates]);

    useEffect(() => {
        setIsBreakfast(isBreakfast ?? false);
    }, [isBreakfast]);

    useEffect(() => {
        setNumOfGuests(guests.adults + guests.children);
    }, [guests]);

    return {
        form,
        availableDatesQuery,
    };
}
