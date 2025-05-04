import { supabase } from "@/services/supabase";
import {
    type CabinPreviewLocation,
    type CabinPreview,
} from "@/features/cabins";

type QueryParams = {
    location?: string;
    dates?: string;
    guests?: string;
};

// export async function getAllCabinsPreview({
//     location,
//     guests,
//     dates,
// }: QueryParams): Promise<CabinPreview[]> {
//     let locationIds: number[] | undefined;

//     if (location) {
//         const { data: locationData, error: locationError } = await supabase
//             .from("locations")
//             .select("id")
//             .ilike("country", `%${location}%`);

//         if (locationError) throw new Error(locationError.message);
//         locationIds = locationData?.map(l => l.id) ?? [];
//     }

//     if (locationIds?.length === 0) {
//         return [];
//     }

//     let query = supabase
//         .from("cabins")
//         .select(
//             "id, createdAt, name, price, discount, maxNumOfGuests, images, locationId, locations(city, country)",
//         )
//         .order("createdAt", { ascending: true });

//     if (locationIds?.length) {
//         query = query.in("locationId", locationIds);
//     }

//     if (guests) {
//         const parsedGuests = JSON.parse(guests) as Record<string, string>;
//         const guestsNumber = Object.values(parsedGuests).reduce(
//             (acc, value) => {
//                 const parsedValue = parseInt(value, 10);
//                 return acc + (isNaN(parsedValue) ? 0 : parsedValue);
//             },
//             0,
//         );

//         if (!isNaN(guestsNumber)) {
//             query = query.gte("maxNumOfGuests", guestsNumber);
//         }
//     }

//     if (dates) {
//         const parsedDates = JSON.parse(dates) as { from: string; to?: string };

//         const from = parsedDates.from;
//         const to = parsedDates.to;

//         if (from || to) {
//             let bookingsQuery = supabase
//                 .from("bookings")
//                 .select("cabinId")
//                 .in("status", ["confirmed", "checked-in", "pending"]);

//             if (from && to) {
//                 bookingsQuery = bookingsQuery.or(
//                     `and(startDate.lte.${to},endDate.gte.${from})`,
//                 );
//             } else if (from) {
//                 bookingsQuery = bookingsQuery
//                     .lte("startDate", from)
//                     .gte("endDate", from);
//             }

//             const { data: conflictingBookings, error: bookingsError } =
//                 await bookingsQuery;

//             if (bookingsError) throw new Error(bookingsError.message);

//             const unavailableCabinIds =
//                 conflictingBookings?.map(b => b.cabinId) ?? [];

//             if (unavailableCabinIds.length > 0) {
//                 query = query.filter(
//                     "id",
//                     "not.in",
//                     `(${unavailableCabinIds.join(",")})`,
//                 );
//             }
//         }
//     }

//     const { data, error } = await query;

//     if (error) throw new Error(error.message);

//     return data.map(({ locations, ...props }) => ({
//         ...props,
//         location: locations as any as CabinPreviewLocation,
//         nextAvailableDate: {
//             from: new Date(),
//             to: new Date(),
//         },
//     }));
// }

export async function getAllCabinsPreview({
    location,
    guests,
    dates,
}: QueryParams): Promise<CabinPreview[]> {
    let locationIds: number[] | undefined;

    if (location) {
        const { data: locationData, error: locationError } = await supabase
            .from("locations")
            .select("id")
            .ilike("country", `%${location}%`);

        if (locationError) throw new Error(locationError.message);
        locationIds = locationData?.map(l => l.id) ?? [];
    }

    if (locationIds?.length === 0) {
        return [];
    }

    let query = supabase
        .from("cabins")
        .select(
            "id, createdAt, name, price, discount, maxNumOfGuests, images, locationId, locations(city, country)",
        )
        .order("createdAt", { ascending: true });

    if (locationIds?.length) {
        query = query.in("locationId", locationIds);
    }

    if (guests) {
        const parsedGuests = JSON.parse(guests) as Record<string, string>;
        const guestsNumber = Object.values(parsedGuests).reduce(
            (acc, value) => {
                const parsedValue = parseInt(value, 10);
                return acc + (isNaN(parsedValue) ? 0 : parsedValue);
            },
            0,
        );

        if (!isNaN(guestsNumber)) {
            query = query.gte("maxNumOfGuests", guestsNumber);
        }
    }

    const parsedDates = dates
        ? (JSON.parse(dates) as { from: string; to?: string })
        : undefined;
    const from = parsedDates?.from;
    const to = parsedDates?.to;

    if (from || to) {
        let bookingsQuery = supabase
            .from("bookings")
            .select("cabinId")
            .in("status", ["confirmed", "checked-in", "pending"]);

        if (from && to) {
            bookingsQuery = bookingsQuery.or(
                `and(startDate.lte.${to},endDate.gte.${from})`,
            );
        } else if (from) {
            bookingsQuery = bookingsQuery
                .lte("startDate", from)
                .gte("endDate", from);
        }

        const { data: conflictingBookings, error: bookingsError } =
            await bookingsQuery;

        if (bookingsError) throw new Error(bookingsError.message);

        const unavailableCabinIds =
            conflictingBookings?.map(b => b.cabinId) ?? [];

        if (unavailableCabinIds.length > 0) {
            query = query.filter(
                "id",
                "not.in",
                `(${unavailableCabinIds.join(",")})`,
            );
        }
    }

    const { data: cabins, error } = await query;

    if (error) throw new Error(error.message);

    const now = from ? new Date(from) : new Date();

    const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("cabinId, startDate, endDate")
        .in(
            "cabinId",
            cabins.map(c => c.id),
        )
        .in("status", ["confirmed", "checked-in", "pending"])
        .gt("endDate", now.toISOString())
        .order("startDate", { ascending: true });

    if (bookingsError) throw new Error(bookingsError.message);

    const bookingsByCabin: Record<
        number,
        { startDate: string; endDate: string }[]
    > = {};
    for (const b of bookings) {
        if (!bookingsByCabin[b.cabinId]) bookingsByCabin[b.cabinId] = [];
        bookingsByCabin[b.cabinId].push({
            startDate: b.startDate,
            endDate: b.endDate,
        });
    }

    return cabins.map(({ locations, id, ...props }) => {
        const bookings = bookingsByCabin[id] ?? [];

        const nextAvailable: { from?: Date; to?: Date } = {
            from: now,
            to: undefined,
        };

        if (bookings.length === 0) {
            nextAvailable.from = now;
            nextAvailable.to = undefined;
        } else {
            let current = now;

            for (let i = 0; i < bookings.length; i++) {
                const { startDate, endDate } = bookings[i];
                const start = new Date(startDate);
                const end = new Date(endDate);

                if (current < start) {
                    const diffInMs = start.getTime() - current.getTime();
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                    if (diffInDays >= 2) {
                        nextAvailable.from = current;
                        nextAvailable.to = start;
                        break;
                    } else {
                        current = end;
                        continue;
                    }
                }

                if (current >= start && current <= end) {
                    current = new Date(end);
                }

                if (i === bookings.length - 1) {
                    const diffInMs = current.getTime() - now.getTime();
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                    if (diffInDays >= 2) {
                        nextAvailable.from = current;
                        nextAvailable.to = undefined;
                    } else {
                        nextAvailable.from = undefined;
                        nextAvailable.to = undefined;
                    }
                }
            }
        }

        return {
            ...props,
            id,
            location: locations as unknown as CabinPreviewLocation,
            nextAvailableDate: nextAvailable,
        };
    });
}
