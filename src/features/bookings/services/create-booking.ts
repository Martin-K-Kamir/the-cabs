"use server";
import {
    assertBookingDateIsAvailable,
    type NewBookingRaw,
    type NewBooking,
    type BookingItem,
} from "@/features/bookings";
import { assertUserExists } from "@/lib/utils";
import { auth } from "@/services/auth";
import { supabase } from "@/services/supabase";
import { endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";

export async function createBooking(
    newBookingData: NewBookingRaw,
): Promise<BookingItem> {
    const session = await auth();
    assertUserExists(
        session,
        "You must be logged in to create a new reservation.",
    );

    await assertBookingDateIsAvailable({
        cabinId: newBookingData.cabinId,
        startDate: newBookingData.startDate,
        endDate: newBookingData.endDate,
        errorMessage: "The selected date range is already reserved.",
    });

    const newBooking = {
        ...newBookingData,
        guestId: session.user.id,
        status: "pending",
        breakfastPaid: 0,
        breakfastRefund: 0,
        cabinPaid: 0,
        cabinRefund: 0,
        totalPaid: 0,
        totalRefund: 0,
        observations: "",
        startDate: endOfDay(newBookingData.startDate),
        endDate: endOfDay(newBookingData.endDate),
    } satisfies NewBooking;

    const { data, error } = await supabase
        .from("bookings")
        .insert([newBooking])
        .select("*, cabins(*, locations(*)), guests(*)")
        .single();

    if (error) {
        throw new Error(
            "Reservation creation failed. Please try again later. If the problem persists, please contact support.",
        );
    }

    revalidatePath(`/cabins/${newBookingData.cabinId}`);

    return data;
}
