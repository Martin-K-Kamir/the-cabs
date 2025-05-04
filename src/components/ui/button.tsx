import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/index";

const buttonVariants = cva(
    `inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-xl 
    text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
    [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2
     aria-invalid:ring-rose-500 aria-invalid:border-rose-500 focus-visible:border-zinc-300 ring-zinc-100`,
    {
        variants: {
            variant: {
                default:
                    "border bg-linear-to-r from-pink-700 border-rose-600 to-rose-600 text-white hover:brightness-110",
                outline:
                    "border bg-transparent hover:bg-zinc-800/60 hover:text-zinc-50 border-zinc-800 data-[state=open]:bg-zinc-800/60 data-[state=open]:text-zinc-50",
                secondary:
                    "border bg-zinc-50 text-zinc-900 border-zinc-50 hover:bg-zinc-50/90 hover:border-zinc-50/90",
                tertiary:
                    "border text-zinc-50 bg-zinc-800 border-zinc-800 hover:brightness-125 data-[state=open]:brightness-125",
                quaternary:
                    "border text-zinc-50 bg-zinc-900 border-zinc-800 hover:bg-zinc-800/70 data-[state=open]:bg-zinc-800/70",
                ghost: "border border-transparent bg-transparent text-zinc-50 hover:bg-zinc-800 hover:border-zinc-800 data-[state=open]:bg-zinc-800",
                blurred:
                    "border bg-zinc-900/80 border-none backdrop-blur-xs [&_svg:not([class*='text-'])]:text-zinc-100/80 data-[state=open]:bg-zinc-900 hover:bg-zinc-900 data-[state=open]:[&_svg:not([class*='text-'])]:text-zinc-50 hover:[&_svg:not([class*='text-'])]:text-zinc-50",
                none: "",
                destructive:
                    "border bg-rose-800 text-white border-rose-800 hover:border-rose-700 hover:bg-rose-700",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                sm: "h-8 gap-1.5 px-3.5 has-[>svg]:px-2.5",
                lg: "h-10 px-6 has-[>svg]:px-4",
                xl: "h-12 text-base px-6 has-[>svg]:px-4",
                icon: "size-8 rounded-full",
                full: "w-full h-auto py-4 px-5",
                none: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
