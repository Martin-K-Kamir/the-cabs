import { supabase } from "@/services/supabase";

export async function getBookedCabins<TCabin extends { id: number }>(
    cabins: TCabin[],
    now: Date,
) {
    const { data, error } = await supabase
        .from("bookings")
        .select("cabinId, startDate, endDate")
        .in(
            "cabinId",
            cabins.map(c => c.id),
        )
        .in("status", ["confirmed", "checked-in", "pending"])
        .gt("endDate", now.toISOString())
        .order("startDate", { ascending: true });

    if (error) throw new Error(error.message);

    const grouped: Record<number, { startDate: string; endDate: string }[]> =
        {};

    for (let i = 0; i < data.length; i++) {
        const booking = data[i];
        const { cabinId, startDate, endDate } = booking;

        if (!grouped[cabinId]) {
            grouped[cabinId] = [];
        }

        grouped[cabinId].push({ startDate, endDate });
    }

    return grouped;
}
