"use client";
import { cn, formatCurrency } from "@/lib/utils";
import { useBookingManagerStore } from "@/features/bookings/hooks";
import { Separator } from "@/components/ui/separator";

export type BookingPriceListProps = {
    renderFallback?: React.ReactNode;
} & React.ComponentProps<"ul">;

export function BookingPriceList({
    className,
    renderFallback,
    ...props
}: BookingPriceListProps) {
    const cabinPrice = useBookingManagerStore(state => state.cabinPrice);
    const cabinDiscount = useBookingManagerStore(state => state.cabinDiscount);
    const breakfastPrice = useBookingManagerStore(
        state => state.breakfastPrice,
    );
    const isBreakfast = useBookingManagerStore(state => state.isBreakfast);
    const numOfGuests = useBookingManagerStore(state => state.numOfGuests);
    const numOfNights = useBookingManagerStore(state => state.numOfNights);
    const bookingCabinPrice = useBookingManagerStore(
        state => state.bookingCabinPrice,
    );
    const bookingBreakfastPrice = useBookingManagerStore(
        state => state.bookingBreakfastPrice,
    );
    const bookingTotalPrice = useBookingManagerStore(
        state => state.bookingTotalPrice,
    );

    if (
        !numOfNights ||
        !bookingCabinPrice ||
        !bookingTotalPrice ||
        !cabinPrice
    ) {
        return <>{renderFallback ?? null}</>;
    }

    return (
        <ul {...props} className={cn("space-y-2", className)}>
            <BookingPriceItem
                title="Cabin:"
                description={`${formatCurrency(cabinPrice - (cabinDiscount ?? 0))} x ${numOfNights} nights`}
                price={bookingCabinPrice}
            />
            {isBreakfast && breakfastPrice && bookingBreakfastPrice && (
                <BookingPriceItem
                    title="Breakfast:"
                    description={`${formatCurrency(breakfastPrice)} x ${numOfNights} nights x ${numOfGuests} guest${numOfGuests && numOfGuests > 1 ? "s" : ""}`}
                    price={bookingBreakfastPrice}
                />
            )}
            <Separator className="my-3.5" />
            <BookingPriceItem
                title="Total"
                price={bookingTotalPrice}
                className="text-lg font-semibold text-white"
            />
        </ul>
    );
}

type BookingPriceItemProps = {
    title: string;
    description?: string;
    price: number;
    classNameTitle?: string;
    classNameDescription?: string;
    classNamePrice?: string;
} & React.ComponentProps<"li">;

function BookingPriceItem({
    title,
    description,
    price,
    className,
    classNameTitle,
    classNameDescription,
    classNamePrice,
    ...props
}: BookingPriceItemProps) {
    return (
        <li
            {...props}
            className={cn("flex items-center justify-between", className)}
        >
            <p>
                <span className={cn("block", classNameTitle)}>{title}</span>
                {description && (
                    <span
                        className={cn(
                            "block text-sm text-zinc-300",
                            classNameDescription,
                        )}
                    >
                        {description}
                    </span>
                )}
            </p>
            <p className={classNamePrice}>{formatCurrency(price)}</p>
        </li>
    );
}
