"use server";

import { auth } from "@/services/auth";
import { assertUserOwnsBooking, type BookingId } from "@/features/bookings";
import { assertUserExists } from "@/lib/utils";
import { supabase } from "@/services/supabase";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: BookingId) {
    const session = await auth();
    assertUserExists(
        session,
        "Before you can cancel a reservation, you need to be logged in.",
    );
    assertUserOwnsBooking(
        session.user.id,
        bookingId,
        "Not authorized to cancel this reservation.",
    );

    const { error } = await supabase
        .from("bookings")
        .update({ status: "canceled" })
        .eq("id", bookingId)
        .eq("guestId", session.user.id);

    if (error) {
        throw new Error("Failed to cancel reservation");
    }

    revalidatePath("/user/reservations");
}
