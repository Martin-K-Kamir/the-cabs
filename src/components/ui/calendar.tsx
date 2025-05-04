"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type DateRange, DayPicker } from "react-day-picker";

import { cn, isDateRangeDisabled } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
    className,
    classNames,
    showOutsideDays = false,
    excludeDisabled,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    excludeDisabled?: boolean;
    onSelect: (e: DateRange | undefined) => void;
}) {
    function handleSelect(e: DateRange) {
        if (e?.to && excludeDisabled) {
            const isDisabled = isDateRangeDisabled(
                e,
                props.disabled as Array<{ from: Date; to: Date }> | undefined,
            );

            if (isDisabled) {
                props?.onSelect({ from: undefined, to: undefined });
                return;
            }
        }

        props?.onSelect(e);
    }
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            styles={{ cell: { minWidth: "32px" } }}
            className={cn("", className)}
            classNames={{
                months: "flex justify-center flex-col sm:flex-row gap-2",
                month: "flex flex-col gap-4",
                caption:
                    "flex justify-center pt-1 relative items-center w-full",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                nav_button: cn(
                    buttonVariants({ variant: "tertiary" }),
                    "size-7 p-0",
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "mx-auto border-collapse space-x-1",
                head_row: "flex",
                head_cell:
                    "rounded-xl w-8 font-normal text-[0.8rem] text-zinc-400",
                row: "flex w-full mt-2",
                cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-xl [&:has([aria-selected])]:bg-zinc-800",
                    props.mode === "range"
                        ? "[&:has(>.day-range-end)]:rounded-r-xl [&:has(>.day-range-start)]:rounded-l-xl first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl"
                        : "[&:has([aria-selected])]:rounded-xl",
                ),
                day: cn(
                    buttonVariants({ variant: "none" }),
                    "size-8 p-0 font-normal aria-selected:opacity-100 !transition-none hover:bg-zinc-700",
                ),
                day_range_start:
                    "day-range-start aria-selected:bg-zinc-50 aria-selected:text-zinc-900",
                day_range_end:
                    "day-range-end aria-selected:bg-zinc-50 aria-selected:text-zinc-900",
                day_selected:
                    "bg-zinc-900 text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 focus:bg-zinc-50 focus:text-zinc-900",
                day_today: "bg-blue-600 text-zinc-50",
                day_outside: showOutsideDays
                    ? "day-outside text-zinc-400 aria-selected:text-zinc-400"
                    : "day-outside opacity-0 invisible pointers-events-none bg-transparent",
                day_disabled: "opacity-40 text-zinc-400 line-through",
                day_range_middle:
                    "aria-selected:bg-zinc-800 aria-selected:text-zinc-50",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft
                        className={cn("size-4 text-zinc-50", className)}
                        {...props}
                    />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight
                        className={cn("size-4 text-zinc-50", className)}
                        {...props}
                    />
                ),
            }}
            {...props}
            // @ts-expect-error this a bug in react-day-picker types there is onSelect prop
            onSelect={handleSelect}
        />
    );
}

export { Calendar };
