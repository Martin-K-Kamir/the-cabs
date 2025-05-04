import { format } from "date-fns";

type Options = Partial<{
    fallback: string;
    hideSameMonth: boolean;
    fromPrefix: string;
    toPrefix: string;
    fromSeparator: string;
    toSeparator: string;
    separator: string;
}>;

export function formatCompactDateRange(
    from?: Date,
    to?: Date,
    options?: Options,
) {
    const {
        fallback = "No Dates",
        fromPrefix = "from: ",
        toPrefix = "to: ",
        separator = " - ",
        fromSeparator = "",
        toSeparator = "",
        hideSameMonth = false,
    } = options || {};

    if (!from && !to) {
        return fallback;
    }

    if (from && !to) {
        return `${fromPrefix}${format(from, "MMM d")}${fromSeparator}`;
    }

    if (!from && to) {
        return `${toSeparator}${toPrefix}${format(to, "MMM d")}`;
    }

    if (from && to) {
        const fromMonth = format(from, "MMM");
        const toMonth = format(to, "MMM");

        if (fromMonth === toMonth && hideSameMonth) {
            return `${format(from, "MMM d")}${separator}${format(to, "d")}`;
        } else {
            return `${format(from, "MMM d")}${separator}${format(to, "MMM d")}`;
        }
    }

    return fallback;
}
