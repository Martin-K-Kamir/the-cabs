import { type BookingId, getBookingsByUserId } from "@/features/bookings";
import { type UserId } from "@/features/user";

export async function assertUserOwnsBooking(
    userId: UserId,
    bookingId: BookingId,
    errorMessage: string = "Not authorized to access this reservation.",
) {
    const userBookings = await getBookingsByUserId(userId);
    const userBookingIds = userBookings.map(booking => booking.id);

    if (!userBookingIds.includes(bookingId)) {
        throw new Error(errorMessage);
    }
}
