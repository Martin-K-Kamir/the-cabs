'use client";';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { BookingPriceList } from "@/features/bookings/components/ui/booking-price-list";
import { useState } from "react";

export function BookingPriceListPopover({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children ?? (
                    <Button size="xl" className="w-full" variant="tertiary">
                        Show price list
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                inPortal={false}
                className="w-(--radix-popover-trigger-width) bg-zinc-950"
            >
                <BookingPriceList
                    renderFallback={
                        <p className="text-pretty">
                            Select stay duration, guests and breakfast options
                            to see the price list.
                        </p>
                    }
                />
            </PopoverContent>
        </Popover>
    );
}
