import { CabinId } from "@/features/cabins";
import { areIntervalsOverlapping } from "date-fns";
import { getUnavailableBookingsDates } from "@/features/bookings/services/get-unavailable-bookings-dates";

export async function assertBookingDateIsAvailable({
    cabinId,
    startDate,
    endDate,
    errorMessage = "The selected date range is already reserved.",
}: {
    cabinId: CabinId;
    startDate: Date;
    endDate: Date;
    errorMessage?: string;
}) {
    const monthToCheck = startDate;

    const unavailableRanges = await getUnavailableBookingsDates({
        cabinId,
        date: monthToCheck,
    });

    const requestedRange = { start: startDate, end: endDate };

    const conflict = unavailableRanges.some(range =>
        areIntervalsOverlapping(
            { start: range.from, end: range.to },
            requestedRange,
            { inclusive: true },
        ),
    );

    if (conflict) {
        throw new Error(errorMessage);
    }
}
