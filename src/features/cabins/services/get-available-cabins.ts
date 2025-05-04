import { supabase } from "@/services/supabase";
import { buildQuery } from "@/features/cabins/services";
import type { DateRange } from "@/lib/types";

export async function getAvailableCabins(
    query: ReturnType<typeof buildQuery>,
    dateRange?: Partial<DateRange>,
) {
    if (!dateRange?.from && !dateRange?.to) return query;

    let bookingsQuery = supabase
        .from("bookings")
        .select("cabinId")
        .in("status", ["confirmed", "checked-in", "pending"]);

    if (dateRange.from && dateRange.to) {
        bookingsQuery = bookingsQuery.or(
            `and(startDate.lte.${dateRange.to.toISOString()},endDate.gte.${dateRange.from.toISOString()})`,
        );
    } else if (dateRange.from) {
        bookingsQuery = bookingsQuery
            .lte("startDate", dateRange.from.toISOString())
            .gte("endDate", dateRange.from.toISOString());
    }

    const { data: conflicting, error } = await bookingsQuery;
    if (error) throw new Error(error.message);

    const unavailableIds = conflicting?.map(b => b.cabinId) ?? [];
    if (unavailableIds.length > 0) {
        query = query.filter("id", "not.in", `(${unavailableIds.join(",")})`);
    }

    return query;
}
