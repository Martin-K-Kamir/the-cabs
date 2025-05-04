"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

function ScrollArea({
    className,
    children,
    orientation = "vertical",
    showScrollbar = true,
    showScrollShadow = false,
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
    orientation?: "vertical" | "horizontal";
    showScrollbar?: boolean;
    showScrollShadow?: boolean;
}) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot="scroll-area"
            className={cn("relative overflow-hidden", className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                className={cn(
                    "size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-zinc-950/50 dark:focus-visible:ring-zinc-300/50",
                    orientation === "vertical" &&
                        showScrollShadow &&
                        "scroll-shadows-vertical",
                    orientation === "horizontal" &&
                        showScrollShadow &&
                        "scroll-shadows-horizontal",
                )}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar
                orientation={orientation}
                className={cn(!showScrollbar && "opacity-0")}
            />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({
    className,
    orientation = "vertical",
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            orientation={orientation}
            className={cn(
                "flex touch-none select-none p-px transition-colors",
                orientation === "vertical" &&
                    "h-full w-2.5 border-l border-l-transparent",
                orientation === "horizontal" &&
                    "h-2.5 flex-col border-t border-t-transparent",
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="relative flex-1 cursor-pointer rounded-full bg-zinc-800/70 hover:bg-zinc-700/70"
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
}

export { ScrollArea, ScrollBar };
