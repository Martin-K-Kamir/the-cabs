import { supabase } from "@/services/supabase";
import {
    type CabinPreviewLocation,
    type CabinPreview,
} from "@/features/cabins";
import {
    getAvailableCabins,
    getBookedCabins,
    getCabinLocationIds,
} from "@/features/cabins/services";
import { calcNextAvailableDate } from "@/features/cabins/lib/utils";
import { parseDatesFromObject, parseGuestsFromObject } from "@/lib/utils";

type QueryParams = Record<string, string | undefined>;

function normalizeToStartOfDay(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}

export async function getAllCabinsPreview(
    queryParams: QueryParams,
): Promise<CabinPreview[]> {
    const locationIds = await getCabinLocationIds(queryParams.location);
    if (queryParams.location && locationIds.length === 0) return [];

    const query = buildQuery(locationIds, queryParams);
    const dateRange = parseDatesFromObject(queryParams);
    const { data: cabins, error } = await getAvailableCabins(query, dateRange);

    if (error) throw new Error(error.message);

    const now = dateRange?.from
        ? normalizeToStartOfDay(new Date(dateRange.from))
        : normalizeToStartOfDay(new Date());
    const bookedCabins = await getBookedCabins(cabins, now);

    return cabins.map(({ locations, id, ...props }) => {
        const bookings = bookedCabins[id] ?? [];
        const nextAvailableDate = calcNextAvailableDate(bookings, now);

        return {
            ...props,
            id,
            location: locations as unknown as CabinPreviewLocation,
            nextAvailableDate,
        };
    });
}

export function buildQuery(locationIds?: number[], queryParams?: QueryParams) {
    let query = supabase
        .from("cabins")
        .select(
            "id, createdAt, name, price, discount, maxNumOfGuests, images, locationId, locations(city, country)",
        )
        .order("createdAt", { ascending: false });

    if (locationIds?.length) {
        query = query.in("locationId", locationIds);
    }

    if (!queryParams) return query;

    const guests = parseGuestsFromObject(queryParams);
    if (guests.adults > 0 || guests.children > 0) {
        query = query.gte("maxNumOfGuests", guests.adults + guests.children);
    }

    return query;
}
