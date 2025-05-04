import { format } from "date-fns";
import type { DateRange } from "@/lib/types";

export function stringifyDates(
    dates: Partial<DateRange>,
): Record<string, string> {
    const params: Record<string, string> = {};

    if (dates.from) {
        params.from = format(dates.from, "yyyy-MM-dd");
    }

    if (dates.to) {
        params.to = format(dates.to, "yyyy-MM-dd");
    }

    return params;
}
