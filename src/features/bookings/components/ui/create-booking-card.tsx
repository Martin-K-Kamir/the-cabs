import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CabinId } from "@/features/cabins";
import { getCabinById } from "@/features/cabins/services/get-cabin-by-id";
import { getBookingSettings } from "@/features/bookings/services/get-booking-settings";
import {
    CreateBookingForm,
    BookingPrice,
    BookingPriceList,
} from "@/features/bookings";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/services/auth";

export type CreateBookingCardProps = Omit<
    React.ComponentProps<typeof Card>,
    "children"
> & {
    cabinId: CabinId;
};

export async function CreateBookingCard({
    className,
    cabinId,
    ...props
}: CreateBookingCardProps) {
    const [cabin, settings, session] = await Promise.all([
        getCabinById(cabinId),
        getBookingSettings(),
        auth(),
    ]);

    return (
        <Card {...props} className={cn("p-6", className)}>
            <BookingPrice price={cabin.price} discount={cabin.discount} />
            <CreateBookingForm
                cabinId={cabinId}
                cabinPrice={cabin.price}
                cabinDiscount={cabin.discount}
                breakfastPrice={settings.breakfastPrice}
                minNumOfGuests={1}
                maxNumOfGuests={cabin.maxNumOfGuests}
                minNumOfNights={settings.minNights}
                maxNumOfNights={settings.maxNights}
                session={session}
            />
            <BookingPriceList />
        </Card>
    );
}

export function CreateBookingCardSkeleton({
    className,
    ...props
}: React.ComponentProps<typeof Card>) {
    return (
        <Card {...props} className={cn("p-6", className)}>
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2.5">
                <Skeleton className="h-[72px]" />
                <Skeleton className="h-[72px]" />
                <Skeleton className="h-[72px]" />
            </div>
            <Skeleton className="h-12" />
        </Card>
    );
}
