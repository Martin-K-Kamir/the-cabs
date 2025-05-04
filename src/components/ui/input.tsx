import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "shadow-xs flex h-9 w-full min-w-0 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-base outline-none transition-[color,box-shadow] selection:bg-zinc-50 selection:text-zinc-900 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-50 placeholder:text-zinc-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-800",
                "aria-invalid:ring-rose-500 aria-invalid:border-rose-500",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
