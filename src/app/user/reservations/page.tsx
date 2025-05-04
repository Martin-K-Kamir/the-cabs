import { auth } from "@/services/auth";
import { assertUserExists } from "@/lib/utils";
import {
    NoUpcomingBookings,
    BookingsPreviewList,
    getBookingsByUserId,
    transformUserBookings,
    groupUserBookings,
} from "@/features/bookings";

export const metadata = {
    title: "Reservations",
};

export default async function Page() {
    const session = await auth();
    assertUserExists(session);

    const data = await getBookingsByUserId(session.user.id);
    const groupedBookings = groupUserBookings(data);

    return (
        <article className="space-y-6 sm:space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold">Your reservations</h1>
            </header>
            {groupedBookings.upcoming.length === 0 && <NoUpcomingBookings />}
            {groupedBookings.upcoming.length > 0 && (
                <BookingsPreviewList
                    className="grid gap-4 sm:gap-6"
                    data={transformUserBookings(groupedBookings.upcoming)}
                />
            )}

            {groupedBookings.past.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Where you been</h2>

                    <BookingsPreviewList
                        variant="compact"
                        className="@3xl/booking-preview-list:grid-cols-2 grid gap-4 sm:gap-6"
                        limit={6}
                        data={transformUserBookings(
                            groupedBookings.past,
                            "desc",
                        )}
                    />
                </section>
            )}

            {groupedBookings.canceled.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Canceled cabs</h2>

                    <BookingsPreviewList
                        variant="compact"
                        className="@3xl/booking-preview-list:grid-cols-2 grid gap-4 sm:gap-6"
                        limit={6}
                        data={transformUserBookings(
                            groupedBookings.canceled,
                            "desc",
                        )}
                    />
                </section>
            )}
        </article>
    );
}
