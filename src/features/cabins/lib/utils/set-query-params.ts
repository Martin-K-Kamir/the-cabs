import { stringifyDates, stringifyGuests } from "@/lib/utils";
import type { DateRange, Guests } from "@/lib/types";

export function setLocationQueryParam(
    params: URLSearchParams,
    location?: string,
) {
    if (location) {
        params.set("location", location);
    } else {
        params.delete("location");
    }

    return params;
}

export function setDatesQueryParam(
    params: URLSearchParams,
    dates?: Partial<DateRange> | undefined,
) {
    if (dates) {
        const dateParams = stringifyDates(dates);
        Object.entries(dateParams).forEach(([key, value]) => {
            params.set(key, value);
        });
    } else {
        params.delete("from");
        params.delete("to");
    }

    return params;
}

export function setGuestsQueryParam(params: URLSearchParams, guests?: Guests) {
    if (guests) {
        const guestParams = stringifyGuests(guests);
        Object.entries(guestParams).forEach(([key, value]) => {
            params.set(key, value);
        });

        if (guests.adults === 0) {
            params.delete("adults");
        }
        if (guests.children === 0) {
            params.delete("children");
        }
    }

    return params;
}

export function setCabinsListKeyQueryParam(params: URLSearchParams) {
    const queryParamKeys = Array.from(params.keys());

    if (queryParamKeys.length === 0) {
        return params;
    }

    if (
        queryParamKeys.length === 1 &&
        queryParamKeys[0] === "cabins-list-key"
    ) {
        params.delete("cabins-list-key");
    } else {
        params.set("cabins-list-key", Math.random().toString(36).slice(2, 7));
    }

    return params;
}
