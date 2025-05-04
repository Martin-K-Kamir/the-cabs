import { type BookingPreviewItem } from "@/features/bookings";

export function transformUserBookings(
    bookings: BookingPreviewItem[],
    sortBy: "asc" | "desc" | "recent" = "asc",
) {
    return bookings
        .map(booking => ({
            bookingId: booking.id,
            cabinId: booking.cabin.id,
            guestId: booking.guestId,
            cabinUrl: `/cabins/${booking.cabin.id}`,
            name: booking.cabin.name,
            image: booking.cabin.images[0],
            totalPrice: booking.totalPrice,
            isBreakfast: booking.isBreakfast,
            guests: booking.numOfGuests,
            status: booking.status,
            location: {
                city: booking.cabin.location.city,
                country: booking.cabin.location.country,
                address: booking.cabin.location.address,
            },
            dates: {
                from: new Date(booking.startDate),
                to: new Date(booking.endDate),
            },
        }))
        .sort((a, b) => {
            const aTo = a.dates.to.getTime();
            const bTo = b.dates.to.getTime();
            const aFrom = a.dates.from.getTime();
            const bFrom = b.dates.from.getTime();

            switch (sortBy) {
                case "asc":
                    return aTo - bTo || aFrom - bFrom;
                case "desc":
                    return bTo - aTo || bFrom - aFrom;
                case "recent":
                    return bFrom - aFrom || bTo - aTo;
                default:
                    return 0;
            }
        });
}
