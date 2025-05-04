import { differenceInCalendarDays } from "date-fns";
import { z } from "zod";

export const createBookingSchema = z
    .object({
        minNumOfNights: z.number().min(1),
        maxNumOfNights: z.number().min(1),
        minNumOfGuests: z.number().min(1),
        maxNumOfGuests: z.number().min(1),
        dates: z.object(
            {
                from: z.date({
                    required_error: "Please select a start date",
                }),
                to: z.date({
                    required_error: "Please select an end date",
                }),
            },
            {
                required_error: "Please select a stay duration",
            },
        ),
        guests: z.object({
            adults: z.number().min(1, "At least one adult is required"),
            children: z.number().min(0),
        }),
        isBreakfast: z.boolean(),
        selectedDate: z.date(),
    })
    .refine(
        ({ dates, minNumOfNights }) => {
            if (!dates.from || !dates.to) {
                return true;
            }

            const nights = differenceInCalendarDays(dates.to, dates.from);
            return nights >= minNumOfNights;
        },
        {
            path: ["dates"],
            message: "The stay must be at least the minimum number of nights.",
        },
    )
    .refine(
        ({ dates, maxNumOfNights }) => {
            if (!dates.from || !dates.to) {
                return true;
            }

            const nights = differenceInCalendarDays(dates.to, dates.from);
            return nights <= maxNumOfNights;
        },
        {
            path: ["dates"],
            message: "The stay cannot exceed the maximum number of nights.",
        },
    )
    .refine(
        ({ guests, minNumOfGuests }) => {
            return guests.adults + guests.children >= minNumOfGuests;
        },
        {
            path: ["guests"],
            message: "The number of guests is below the minimum limit.",
        },
    )
    .refine(
        ({ guests, maxNumOfGuests }) => {
            return guests.adults + guests.children <= maxNumOfGuests;
        },
        {
            path: ["guests"],
            message: "The number of guests exceeds the maximum limit.",
        },
    );
