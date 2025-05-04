"use client";
import { addMonths } from "date-fns";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { CabinId } from "@/features/cabins/lib/types";
import { getClientUnvailableBookingsDates } from "../services/get-client-unvailable-bookings-dates";

type UseBookingDatesProps = {
    cabinId: CabinId;
    date: Date;
};

export function useBookingDates({ cabinId, date }: UseBookingDatesProps) {
    const queryClient = useQueryClient();
    const nextDate = addMonths(date, 1);
    const nextNextDate = addMonths(date, 2);
    const { data, isPending, isSuccess, error } = useQueries({
        queries: [
            {
                queryKey: [
                    "bookingDates",
                    cabinId,
                    date.getMonth(),
                    date.getFullYear(),
                ],
                queryFn: () =>
                    cabinId &&
                    getClientUnvailableBookingsDates({
                        cabinId,
                        date,
                    }),
                enabled: !!cabinId,
            },
            {
                queryKey: [
                    "bookingDates",
                    cabinId,
                    nextDate.getMonth(),
                    nextDate.getFullYear(),
                ],
                queryFn: () =>
                    cabinId &&
                    getClientUnvailableBookingsDates({
                        cabinId,
                        date: nextDate,
                    }),
                enabled: !!cabinId,
            },
        ],
        combine: results => {
            const [currentMonthData, nextMonthData] = results;
            return {
                data: [
                    ...(Array.isArray(currentMonthData.data)
                        ? currentMonthData.data
                        : []),
                    ...(Array.isArray(nextMonthData.data)
                        ? nextMonthData.data
                        : []),
                ],
                error: currentMonthData.error ?? nextMonthData.error,
                isPending:
                    currentMonthData.isPending || nextMonthData.isPending,
                isSuccess:
                    currentMonthData.isSuccess && nextMonthData.isSuccess,
            };
        },
    });
    if (cabinId) {
        queryClient.prefetchQuery({
            queryKey: [
                "bookingDates",
                cabinId,
                nextNextDate.getMonth(),
                nextNextDate.getFullYear(),
            ],
            queryFn: () =>
                getClientUnvailableBookingsDates({
                    cabinId,
                    date: nextNextDate,
                }),
        });
    }
    return {
        data,
        isPending,
        isSuccess,
        error,
    };
}
