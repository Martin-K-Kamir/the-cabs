import type { Guests } from "@/lib/types";

export function parseGuests(params: URLSearchParams): Guests {
    return {
        adults: Number.parseInt(params.get("adults") ?? "0", 10),
        children: Number.parseInt(params.get("children") ?? "0", 10),
    };
}

export function parseGuestsFromObject(
    obj: Record<string, string | undefined>,
): Guests {
    return {
        adults: parseInt(obj.adults ?? "0", 10),
        children: parseInt(obj.children ?? "0", 10),
    };
}
