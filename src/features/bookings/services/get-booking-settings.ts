import { supabase } from "@/services/supabase";
import { type BookingSettings } from "@/features/bookings";

export async function getBookingSettings() {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single<BookingSettings>();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
