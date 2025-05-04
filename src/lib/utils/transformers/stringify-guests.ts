import type { Guests } from "@/lib/types";

export function stringifyGuests(guests: Guests): Record<string, string> {
    const params: Record<string, string> = {};

    if (guests.adults > 0) {
        params.adults = guests.adults.toString();
    }

    if (guests.children > 0) {
        params.children = guests.children.toString();
    }

    return params;
}
