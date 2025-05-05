import { CabinId } from "@/features/cabins";
import { areIntervalsOverlapping } from "date-fns";
import { getUnavailableBookingsDates } from "@/features/bookings/services/get-unavailable-bookings-dates";

export async function validateBookingDateAvailability({
    cabinId,
    startDate,
    endDate,
}: {
    cabinId: CabinId;
    startDate: Date;
    endDate: Date;
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

    return !conflict;
}
