"use client";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import {
    CalendarDaysIcon,
    EggFriedIcon,
    LoaderCircleIcon,
    TriangleAlertIcon,
    UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ItemsCounter } from "@/components/ui/counter";
import {
    Form,
    FormField,
    FormPopover,
    FormMessage,
    FormPopoverTrigger,
    FormPopoverContent,
} from "@/components/ui/form";
import { TextableBlock } from "@/components/ui/textable-block";
import { Switch } from "@/components/ui/switch";
import {
    cn,
    formatCompactDateRange,
    formatCurrency,
    formatGuestsSummary,
} from "@/lib/utils";
import { createBookingSchema } from "@/features/bookings/lib/schemas";
import { createBooking } from "@/features/bookings/services/create-booking";
import {
    useBookingManagerStore,
    useBookingSuccessDialogStore,
    type UseBookingFormProps,
} from "@/features/bookings/hooks";
import { useBookingForm } from "@/features/bookings/hooks/use-booking-form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export type CreateBookingFormProps = {
    className?: string;
    classNamePopoverContent?: string;
    classNameFields?: string;
    popoverContentProps?: Omit<
        React.ComponentProps<typeof FormPopoverContent>,
        "className"
    >;
    onCreateSuccess?: () => void;
    onCreateError?: () => void;
    onCreate?: (data: z.infer<typeof createBookingSchema>) => boolean;
} & UseBookingFormProps;

export function CreateBookingForm({
    cabinId,
    className,
    classNamePopoverContent,
    classNameFields,
    popoverContentProps,
    ...formProps
}: CreateBookingFormProps) {
    const [isCreating, setIsCreating] = useState(false);
    const totalPrice = useBookingManagerStore(state => state.bookingTotalPrice);
    const breakfastPrice = useBookingManagerStore(
        state => state.bookingBreakfastPrice,
    );
    const cabinPrice = useBookingManagerStore(state => state.bookingCabinPrice);
    const setBookingSuccessDialogOpen = useBookingSuccessDialogStore(
        state => state.setOpen,
    );
    const queryClient = useQueryClient();

    const isSm = useMediaQuery("(min-width: 40rem)", {
        defaultValue: false,
        initializeWithValue: false,
    });

    const { form, availableDatesQuery } = useBookingForm({
        cabinId,
        ...formProps,
    });

    async function handleSubmit(values: z.infer<typeof createBookingSchema>) {
        setIsCreating(true);

        if (!totalPrice || totalPrice <= 0 || !cabinPrice || cabinPrice <= 0) {
            form.setError("root", {
                type: "manual",
                message: "Internal error. Please try again later.",
            });
            return;
        }

        try {
            const newBooking = await createBooking({
                cabinId,
                breakfastPrice: breakfastPrice ?? 0,
                totalPrice: totalPrice,
                cabinPrice: cabinPrice,
                startDate: values.dates.from,
                endDate: values.dates.to,
                numOfGuests: values.guests.adults + values.guests.children,
                isBreakfast: values.isBreakfast,
            });

            setBookingSuccessDialogOpen({
                open: true,
                bookingData: {
                    id: newBooking.id,
                    cabinName: newBooking.cabins.name,
                    cabinLocation: {
                        address: newBooking.cabins.locations.address,
                        city: newBooking.cabins.locations.city,
                        country: newBooking.cabins.locations.country,
                    },
                    startDate: newBooking.startDate,
                    endDate: newBooking.endDate,
                    totalPrice: newBooking.totalPrice,
                    numOfGuests: newBooking.numOfGuests,
                    isBreakfast: newBooking.isBreakfast,
                },
            });

            form.reset();
            queryClient.invalidateQueries({
                queryKey: ["bookingDates"],
                exact: false,
            });
        } catch (error) {
            form.setError("root", {
                type: "manual",
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal error. Please try again later.",
            });
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn("space-y-6", className)}
            >
                <div className={cn("space-y-2.5", classNameFields)}>
                    <FormField
                        control={form.control}
                        name="dates"
                        render={({ field }) => (
                            <FormPopover
                                onOpenChange={isOpen => {
                                    if (!isOpen) {
                                        form.setValue(
                                            "selectedDate",
                                            new Date(),
                                        );
                                    }
                                }}
                            >
                                <FormPopoverTrigger
                                    size="full"
                                    variant="outline"
                                    className="justify-start"
                                >
                                    <TextableBlock
                                        title="Stay duration"
                                        description={formatCompactDateRange(
                                            field.value.from,
                                            field.value.to,
                                            {
                                                fallback:
                                                    "Click to select dates",
                                                fromPrefix: "",
                                                separator: " - ",
                                                fromSeparator: " - ",
                                            },
                                        )}
                                        icon={<CalendarDaysIcon />}
                                    />
                                </FormPopoverTrigger>
                                <FormPopoverContent
                                    {...popoverContentProps}
                                    collisionPadding={
                                        popoverContentProps?.collisionPadding ??
                                        20
                                    }
                                    className={cn(
                                        (availableDatesQuery.error ||
                                            availableDatesQuery.isPending) &&
                                            "w-114",
                                        availableDatesQuery.isSuccess &&
                                            "w-(--radix-popover-trigger-width) max-w-full space-y-4 lg:w-auto",
                                        classNamePopoverContent,
                                    )}
                                    align={
                                        popoverContentProps?.align ?? "center"
                                    }
                                >
                                    {availableDatesQuery.error && (
                                        <div className="min-h-74 flex w-full flex-col items-center justify-center space-y-2">
                                            <TriangleAlertIcon className="size-6 text-rose-600" />{" "}
                                            <p className="text-center font-semibold text-rose-500">
                                                Dates are currently unavailable.
                                                <br />
                                                Please try again later.{" "}
                                            </p>
                                        </div>
                                    )}

                                    {availableDatesQuery.isPending && (
                                        <div className="min-h-74 flex w-full flex-col items-center justify-center space-y-2">
                                            <LoaderCircleIcon className="size-6 animate-spin" />
                                            <p>Loading available dates...</p>
                                        </div>
                                    )}

                                    {availableDatesQuery.isSuccess && (
                                        <>
                                            <Calendar
                                                initialFocus
                                                excludeDisabled
                                                mode="range"
                                                onSelect={dates => {
                                                    field.onChange(dates);
                                                }}
                                                onMonthChange={date =>
                                                    form.setValue(
                                                        "selectedDate",
                                                        date,
                                                    )
                                                }
                                                numberOfMonths={isSm ? 2 : 1}
                                                selected={{
                                                    from: field.value.from,
                                                    to: field.value.to,
                                                }}
                                                fromDate={new Date()}
                                                toYear={
                                                    new Date().getFullYear() + 1
                                                }
                                                disabled={
                                                    availableDatesQuery.data
                                                }
                                                className="justify-center"
                                            />

                                            <p className="text-left text-sm text-zinc-300 sm:text-center lg:text-left">
                                                The minimum stay is{" "}
                                                {formProps.minNumOfNights}{" "}
                                                nights and the maximum stay is{" "}
                                                {formProps.maxNumOfNights}{" "}
                                                nights.
                                            </p>
                                        </>
                                    )}
                                </FormPopoverContent>
                                <FormMessage />
                            </FormPopover>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                            <FormPopover>
                                <FormPopoverTrigger
                                    size="full"
                                    variant="outline"
                                    className="justify-start"
                                >
                                    <TextableBlock
                                        title="Number of guests"
                                        description={formatGuestsSummary(
                                            field.value.adults,
                                            field.value.children,
                                            "Click to select number of guests",
                                        )}
                                        icon={<UsersIcon />}
                                    />
                                </FormPopoverTrigger>
                                <FormPopoverContent
                                    {...popoverContentProps}
                                    collisionPadding={
                                        popoverContentProps?.collisionPadding ??
                                        20
                                    }
                                    className={cn(
                                        "w-(--radix-popover-trigger-width) space-y-4",
                                        classNamePopoverContent,
                                    )}
                                    align={
                                        popoverContentProps?.align ?? "center"
                                    }
                                >
                                    <ItemsCounter
                                        items={[
                                            {
                                                id: "adults",
                                                title: "Adults",
                                                description: "Ages 18 and up",
                                                min: 1,
                                            },
                                            {
                                                id: "children",
                                                title: "Children",
                                                description:
                                                    "Ages 17 and under",
                                                min: 0,
                                            },
                                        ]}
                                        value={field.value}
                                        onChange={values => {
                                            field.onChange(values);
                                        }}
                                        max={formProps.maxNumOfGuests}
                                        className="space-y-6"
                                    />
                                    <p className="text-sm text-zinc-300">
                                        The maximum number of guests is{" "}
                                        {formProps.maxNumOfGuests}.
                                    </p>
                                </FormPopoverContent>
                                <FormMessage />
                            </FormPopover>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isBreakfast"
                        render={({ field }) => (
                            <FormPopover>
                                <FormPopoverTrigger
                                    size="full"
                                    variant="outline"
                                    className="justify-start"
                                >
                                    <TextableBlock
                                        title="Add breakfast"
                                        description={
                                            field.value
                                                ? "Breakfast included"
                                                : "Click to add breakfast"
                                        }
                                        icon={<EggFriedIcon />}
                                    />
                                </FormPopoverTrigger>
                                <FormPopoverContent
                                    {...popoverContentProps}
                                    collisionPadding={
                                        popoverContentProps?.collisionPadding ??
                                        20
                                    }
                                    className={cn(
                                        "w-(--radix-popover-trigger-width) space-y-2",
                                        classNamePopoverContent,
                                    )}
                                    align={
                                        popoverContentProps?.align ?? "center"
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-base font-semibold">
                                            Breakfast for{" "}
                                            {formatCurrency(
                                                formProps.breakfastPrice,
                                            )}
                                        </p>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={value => {
                                                field.onChange(value);
                                            }}
                                        />
                                    </div>

                                    <p className="text-sm text-zinc-300">
                                        Breakfast is served to your cabin every
                                        morning. Breakfast price is per person
                                        and per day.
                                    </p>
                                </FormPopoverContent>
                                <FormMessage />
                            </FormPopover>
                        )}
                    />
                </div>

                {form.formState.errors.root && (
                    <FormMessage className="font-semibold">
                        {form.formState.errors.root.message}{" "}
                    </FormMessage>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    size="xl"
                    disabled={isCreating}
                >
                    {isCreating ? (
                        <LoaderCircleIcon className="size-5.5 animate-spin" />
                    ) : totalPrice && totalPrice > 0 ? (
                        `Book now for ${formatCurrency(totalPrice)}`
                    ) : (
                        "Check availability"
                    )}
                </Button>
            </form>
        </Form>
    );
}
