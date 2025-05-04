import { getUnavailableBookingsDates } from "@/features/bookings/services/get-unavailable-bookings-dates";
import type { CabinId } from "@/features/cabins/lib/types";
import { isValidCabinId } from "@/features/cabins/lib/utils";
import { isValidDate } from "@/lib/utils";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cabinIdRaw = searchParams.get("cabinId");
    const dateRaw = searchParams.get("date");

    if (!isValidCabinId(cabinIdRaw) || !isValidDate(dateRaw)) {
        return Response.json(
            { error: "Invalid or missing cabinId or date" },
            { status: 400 },
        );
    }

    try {
        const bookingsDates = await getUnavailableBookingsDates({
            cabinId: Number(cabinIdRaw) as CabinId,
            date: new Date(dateRaw),
        });

        return Response.json(bookingsDates, { status: 200 });
    } catch {
        return Response.json(
            { error: "Failed to fetch bookings dates" },
            { status: 500 },
        );
    }
}
