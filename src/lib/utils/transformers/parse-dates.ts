import type { DateRange } from "@/lib/types";

export function parseDates(
    params: URLSearchParams,
): Partial<DateRange> | undefined {
    const fromStr = params.get("from");
    const toStr = params.get("to");

    if (!fromStr && !toStr) {
        return undefined;
    }

    return {
        from: fromStr ? new Date(fromStr) : undefined,
        to: toStr ? new Date(toStr) : undefined,
    };
}

export function parseDatesFromObject(
    obj: Record<string, string | undefined>,
): Partial<DateRange> {
    return {
        from: obj.from ? new Date(obj.from) : undefined,
        to: obj.to ? new Date(obj.to) : undefined,
    };
}
