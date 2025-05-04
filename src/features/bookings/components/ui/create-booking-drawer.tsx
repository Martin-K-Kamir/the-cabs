import { LoaderCircle } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCabinById, type CabinId } from "@/features/cabins";
import { BookingPrice } from "@/features/bookings/components/ui/booking-price";
import { CreateBookingForm } from "@/features/bookings/components/forms/create-booking-form";
import { BookingPriceList } from "@/features/bookings/components/ui/booking-price-list";
import { getBookingSettings } from "@/features/bookings/services";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export type BookingDrawerProps = {
    cabinId: CabinId;
} & React.ComponentProps<"div">;

export async function CreateBookingDrawer({
    cabinId,
    className,
    ...props
}: BookingDrawerProps) {
    const [cabin, settings] = await Promise.all([
        getCabinById(cabinId),
        getBookingSettings(),
    ]);

    return (
        <div
            {...props}
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-2xl border border-zinc-800 bg-zinc-950 py-6",
                className,
            )}
        >
            <Drawer>
                <Wrapper className="flex items-center justify-between">
                    <BookingPrice
                        price={cabin.price}
                        discount={cabin.discount}
                        className="xs:text-xl text-base"
                        suffix="/night"
                    />
                    <DrawerTrigger asChild>
                        <Button size="lg">
                            <span className="xs:hidden">Book now</span>
                            <span className="xs:block hidden">
                                Book your stay
                            </span>
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent showThumb className="py-14">
                        <DrawerTitle className="sr-only">
                            Manage your booking
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            Select your dates, guests, and breakfast options.
                        </DrawerDescription>

                        <Wrapper className="space-y-6">
                            <BookingPrice
                                price={cabin.price}
                                discount={cabin.discount}
                            />

                            <div className="space-y-2.5">
                                <CreateBookingForm
                                    cabinId={cabinId}
                                    cabinPrice={cabin.price}
                                    cabinDiscount={cabin.discount}
                                    breakfastPrice={settings.breakfastPrice}
                                    minNumOfGuests={1}
                                    maxNumOfGuests={cabin.maxNumOfGuests}
                                    minNumOfNights={settings.minNights}
                                    maxNumOfNights={settings.maxNights}
                                    classNameFields="flex flex-col-reverse gap-2.5 space-y-0"
                                    classNamePopoverContent="bg-zinc-950"
                                    popoverContentProps={{
                                        side: "top",
                                    }}
                                />

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="xl"
                                            className="w-full"
                                            variant="tertiary"
                                        >
                                            Show price list
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-(--radix-popover-trigger-width) bg-zinc-950">
                                        <BookingPriceList
                                            renderFallback={
                                                <p className="text-pretty">
                                                    Select stay duration, guests
                                                    and breakfast options to see
                                                    the price list.
                                                </p>
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </Wrapper>
                    </DrawerContent>
                </Wrapper>
            </Drawer>
        </div>
    );
}

export function CreateBookingDrawerSkeleton({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "xs:py-6 fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-2xl border border-zinc-800 bg-zinc-950 py-5",
                className,
            )}
        >
            <Wrapper className="flex items-center justify-between gap-6">
                <Skeleton className="h-8 w-2/4" />
                <Button
                    size="lg"
                    className="xs:w-[144px] pointer-events-none w-[113px] animate-pulse"
                >
                    <LoaderCircle className="size-5 animate-spin" />
                </Button>
            </Wrapper>
        </div>
    );
}
