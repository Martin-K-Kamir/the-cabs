import { supabase } from "@/services/supabase";
import { type UserId } from "@/features/user";
import { type BookingPreviewItemRaw } from "@/features/bookings";

export async function getBookingsByUserId(userId: UserId) {
    const { data, error } = await supabase
        .from("bookings")
        .select(
            "id, guestId, startDate, endDate, status, totalPrice, isBreakfast, numOfGuests, cabins(id, name, images, locations(address, city, country))",
        )
        .eq("guestId", userId)
        .order("startDate", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as unknown as BookingPreviewItemRaw[];
}
