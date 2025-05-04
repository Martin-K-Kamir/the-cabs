import {
    type BookingPreviewItemRaw,
    type BookingPreviewItem,
} from "@/features/bookings";

export function groupUserBookings(bookings: BookingPreviewItemRaw[]) {
    return bookings.reduce(
        (acc, booking) => {
            const transformedBooking = {
                ...booking,
                startDate: new Date(booking.startDate),
                endDate: new Date(booking.endDate),
                status: booking.status,
                cabin: {
                    ...booking.cabins,
                    location: {
                        ...booking.cabins.locations,
                    },
                },
            };

            if (
                booking.status === "confirmed" ||
                booking.status === "pending"
            ) {
                acc.upcoming.push(
                    transformedBooking as unknown as BookingPreviewItem,
                );
            }
            if (booking.status === "checked-out") {
                acc.past.push(
                    transformedBooking as unknown as BookingPreviewItem,
                );
            }
            if (booking.status === "canceled") {
                acc.canceled.push(
                    transformedBooking as unknown as BookingPreviewItem,
                );
            }
            return acc;
        },
        {
            upcoming: [] as BookingPreviewItem[],
            past: [] as BookingPreviewItem[],
            canceled: [] as BookingPreviewItem[],
        },
    );
}
