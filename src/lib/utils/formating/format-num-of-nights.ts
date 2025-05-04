import { differenceInCalendarDays } from "date-fns";

export function formatNumOfNights(
    from?: Date,
    to?: Date,
    fallbackMessage = "no nights",
) {
    if (from && to) {
        const nights = differenceInCalendarDays(to, from);

        return nights > 0
            ? `${nights} night${nights > 1 ? "s" : ""}`
            : fallbackMessage;
    }

    return fallbackMessage;
}
