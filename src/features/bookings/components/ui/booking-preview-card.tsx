"use client";
import Image from "next/image";
import { differenceInDays, format } from "date-fns";
import {
    CalendarDaysIcon,
    EggFriedIcon,
    EllipsisIcon,
    HouseIcon,
    MapPinIcon,
    UserCogIcon,
    UserPen,
    UsersIcon,
    UserXIcon,
} from "lucide-react";
import {
    type BookingStatus,
    type BookingId,
} from "@/features/bookings/lib/types";
import {
    CancelBookingAlertDialogTrigger,
    CancelBookingAlertDialog,
} from "@/features/bookings/components/ui/cancel-booking-alert-dialog";
import { UserId } from "@/features/user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type CabinId } from "@/features/cabins";
import { cn, formatCurrency } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export type BookingPreviewCardVariant = "default" | "compact";

export type BookingPreviewCardProps = {
    image: string;
    name: string;
    location: {
        address: string;
        city: string;
        country: string;
    };
    dates: {
        from: Date;
        to: Date;
    };
    isBreakfast?: boolean;
    guests: number;
    totalPrice: number;
    cabinId: CabinId;
    bookingId: BookingId;
    guestId: UserId;
    cabinUrl: string;
    status: BookingStatus;
} & React.ComponentProps<typeof Card>;

export function BookingPreviewCard({
    variant = "default",
    ...props
}: BookingPreviewCardProps & {
    variant?: BookingPreviewCardVariant;
}) {
    if (variant === "compact") {
        return <BookingPreviewCompactCard {...props} />;
    }

    return <BookingPreviewDefaultCard {...props} />;
}

export function BookingPreviewDefaultCard({
    image,
    name,
    location,
    dates,
    isBreakfast = false,
    guests,
    totalPrice,
    className,
    bookingId,
    cabinId,
    cabinUrl,
    status,
}: BookingPreviewCardProps) {
    const isMd = useMediaQuery("(min-width: 48rem)", {
        defaultValue: true,
        initializeWithValue: false,
    });

    const info = [
        {
            icon: <MapPinIcon />,
            text: `${location.address}, ${location.city}, ${location.country}`,
        },
        {
            icon: <CalendarDaysIcon />,
            text: `${differenceInDays(dates.to, dates.from)} nights, ${format(dates.from, "MMM d yyyy")} - ${format(dates.to, "MMM d yyyy")}`,
        },
        {
            icon: <EggFriedIcon />,
            text: isBreakfast ? "Breakfast included" : "No breakfast",
        },
        {
            icon: <UsersIcon />,
            text: `${guests} guests`,
        },
    ];

    return (
        <Card
            className={cn(
                "gap-4.5 2xs:gap-6 relative flex flex-col overflow-hidden p-0 md:flex-row md:p-6",
                className,
            )}
        >
            <div className="md:w-38 relative aspect-video w-full overflow-hidden md:aspect-square md:rounded-xl">
                <Image
                    src={image}
                    alt={`Cabin ${name} in ${location.city}, ${location.country}`}
                    className="object-cover"
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 300px"
                />
            </div>
            <div className="2xs:px-6 2xs:pb-6 px-4.5 pb-4.5 flex flex-col md:px-0 md:pb-0">
                <p className="font-semibold">{name}</p>
                <ul className="mt-1.5 space-y-1 md:mt-1 md:space-y-0.5">
                    {info.map(item => (
                        <li
                            key={item.text}
                            className="flex items-center gap-2 text-pretty text-sm text-zinc-200 [&_svg]:size-3.5 [&_svg]:shrink-0"
                        >
                            {item.icon}
                            {item.text}
                        </li>
                    ))}
                </ul>
                <p className="mt-3 text-lg font-semibold md:mt-auto">
                    {formatCurrency(totalPrice)}
                </p>
            </div>

            <BookingPreviewCardActions
                bookingId={bookingId}
                cabinId={cabinId}
                cabinUrl={cabinUrl}
                status={status}
                buttonVariant={isMd ? "ghost" : "blurred"}
            />
        </Card>
    );
}

export function BookingPreviewCompactCard({
    image,
    name,
    location,
    dates,
    className,
    bookingId,
    cabinId,
    cabinUrl,
    status,
}: BookingPreviewCardProps) {
    return (
        <div
            className={cn(
                "group/booking-preview-card 2xs:gap-3.5 relative flex items-center gap-3 sm:items-start sm:gap-4",
                className,
            )}
        >
            <div className="sm:w-22 2xs:w-18 relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-xl object-cover">
                <Image
                    className="object-cover"
                    src={image}
                    alt={`Cabin ${name} in ${location.city}, ${location.country}`}
                    fill
                    priority={true}
                    sizes="180px"
                />
            </div>
            <div className="flex-1 space-y-0.5">
                <h3 className="font-semibold">{name}</h3>
                <p className="text-sm text-zinc-300">
                    {location.city}, {location.country}
                </p>
                <p className="text-sm text-zinc-300">
                    {format(dates.from, "MMM d yyyy")} -{" "}
                    {format(dates.to, "MMM d yyyy")}
                </p>
            </div>

            <BookingPreviewCardActions
                bookingId={bookingId}
                cabinId={cabinId}
                cabinUrl={cabinUrl}
                status={status}
                classNameButton="top-0 right-0"
            />
        </div>
    );
}

function BookingPreviewCardActions({
    bookingId,
    cabinId,
    cabinUrl,
    status,
    classNameButton,
    buttonVariant = "ghost",
}: {
    bookingId: BookingId;
    cabinId: CabinId;
    cabinUrl: string;
    status: BookingStatus;
    classNameButton?: string;
    buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant={buttonVariant}
                    className={cn(
                        "absolute right-4 top-4 rounded-xl",
                        classNameButton,
                    )}
                >
                    <EllipsisIcon />
                    <span className="sr-only">
                        More options for booking {bookingId} in cabin {cabinId}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Reservation #{bookingId}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={cabinUrl} target="_blank">
                    <DropdownMenuItem className="cursor-pointer">
                        <HouseIcon />
                        View cabin
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <UserCogIcon />
                    Reservation details
                </DropdownMenuItem>
                {(status === "pending" || status === "confirmed") && (
                    <>
                        <DropdownMenuItem>
                            <UserPen />
                            Update reservation
                        </DropdownMenuItem>
                        <CancelBookingAlertDialog
                            bookingId={bookingId}
                            onCancel={() => setIsOpen(false)}
                        >
                            <CancelBookingAlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    variant="destructive"
                                    onSelect={e => e.preventDefault()}
                                >
                                    <UserXIcon />
                                    Cancel reservation
                                </DropdownMenuItem>
                            </CancelBookingAlertDialogTrigger>
                        </CancelBookingAlertDialog>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
