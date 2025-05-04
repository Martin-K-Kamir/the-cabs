import { addDays } from "date-fns";
import { supabase } from "@/services/supabase";
import { type CabinId } from "@/features/cabins";
import type { DateRange } from "@/lib/types";

type GetUnavailableBookingsDates = {
    cabinId: CabinId;
    date: Date;
};

export async function getUnavailableBookingsDates({
    cabinId,
    date,
}: GetUnavailableBookingsDates): Promise<DateRange[]> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const today = new Date().toISOString().split("T")[0];

    const startOfMonth = `${year}-${month.toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("bookings")
        .select("startDate, endDate, status")
        .eq("cabinId", cabinId) // Filter by cabin
        .gte("endDate", today) // Exclude past bookings
        .or(`and(startDate.lte.${lastDay},endDate.gte.${startOfMonth})`) // Booking overlaps with the given month
        .neq("status", "checked-out") // Exclude checked-out bookings
        .neq("status", "canceled"); // Exclude canceled bookings

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map(
        (booking: { startDate: string; endDate: string }) => {
            return {
                from: addDays(new Date(booking.startDate), 1),
                to: addDays(new Date(booking.endDate), -1),
            };
        },
    );
}
