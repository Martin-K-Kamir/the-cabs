import { type CabinId } from "@/features/cabins/lib/types";
import { type DateRange } from "@/lib/types";

type GetUnavailableBookingsDates = {
    cabinId: CabinId;
    date: Date;
};

export async function getClientUnvailableBookingsDates({
    cabinId,
    date,
}: GetUnavailableBookingsDates): Promise<DateRange[]> {
    if (typeof window === "undefined") {
        throw new Error(
            "getClientUnavailableBookingsDates must be called on the client",
        );
    }

    const params = new URLSearchParams({
        cabinId: cabinId.toString(),
        date: date.toISOString(),
    });

    const response = await fetch(
        `/api/bookings/unavailable-bookings-dates?${params}`,
    );

    if (!response.ok) {
        let message = "Failed to fetch bookings dates";
        try {
            const { error } = await response.json();
            if (error) message = error;
        } catch {}

        throw new Error(message);
    }

    return await response.json();
}
