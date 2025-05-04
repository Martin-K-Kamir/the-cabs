"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useBookingSuccessDialogStore } from "@/features/bookings/hooks";
import {
    CalendarDaysIcon,
    DollarSignIcon,
    EggFriedIcon,
    HouseIcon,
    MapPinIcon,
    UsersIcon,
} from "lucide-react";
import { differenceInDays } from "date-fns/differenceInDays";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export function BookingSuccessDialog() {
    const isDialogOpen = useBookingSuccessDialogStore(state => state.open);
    const bookingData = useBookingSuccessDialogStore(
        state => state.bookingData,
    );
    const setOpenDialog = useBookingSuccessDialogStore(state => state.setOpen);

    const info =
        bookingData !== null
            ? [
                  {
                      icon: <HouseIcon />,
                      text: bookingData.cabinName,
                  },
                  {
                      icon: <MapPinIcon />,
                      text: `${bookingData.cabinLocation.address}, ${bookingData.cabinLocation.city}, ${bookingData.cabinLocation.country}`,
                  },
                  {
                      icon: <CalendarDaysIcon />,
                      text: `${differenceInDays(
                          bookingData.endDate,
                          bookingData.startDate,
                      )} nights, ${format(bookingData.startDate, "MMM d yyyy")} - ${format(
                          bookingData.endDate,
                          "MMM d yyyy",
                      )}`,
                  },
                  {
                      icon: <EggFriedIcon />,
                      text: bookingData.isBreakfast
                          ? "Breakfast included"
                          : "No breakfast",
                  },
                  {
                      icon: <UsersIcon />,
                      text: `${bookingData.numOfGuests} guest${
                          bookingData.numOfGuests > 1 ? "s" : ""
                      }`,
                  },
                  {
                      icon: <DollarSignIcon />,
                      text: formatCurrency(bookingData.totalPrice),
                  },
              ]
            : [];

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={open => {
                if (!open) {
                    setOpenDialog({ open: false });
                }
            }}
        >
            <DialogContent className="!py-6 sm:!px-8 sm:!py-10">
                <DialogHeader>
                    <DialogTitle>Reservation Confirmed</DialogTitle>
                    <DialogDescription>
                        Your Reservation has been successfully created. You will
                        receive a confirmation email shortly.
                    </DialogDescription>
                </DialogHeader>
                {bookingData !== null && info.length > 0 && (
                    <div className="my-2 space-y-2">
                        <p className="font-semibold">Reservation details</p>
                        <ul className="sm:py-4.5 space-y-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3.5 text-sm text-zinc-100 sm:px-4">
                            {info.map(item => (
                                <li
                                    key={item.text}
                                    className="flex items-center gap-2 text-pretty first:font-semibold [&_svg]:size-4 [&_svg]:shrink-0"
                                >
                                    {item.icon}
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <p className="text-pretty text-sm text-zinc-200">
                    Manage your reservations anytime in the Reservations section
                    of your account.
                </p>

                <div className="mt-2 flex flex-col gap-2.5">
                    <DialogClose asChild>
                        <Button asChild size="lg">
                            <Link href="/user/reservations">
                                My reservations
                            </Link>
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="tertiary" size="lg">
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
