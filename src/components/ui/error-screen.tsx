import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Wrapper } from "@/components/ui/wrapper";

export function ErrorScreen({
    className,
    ...props
}: React.ComponentProps<"main">) {
    return (
        <main
            {...props}
            className={cn("pt-26 grid min-h-svh flex-1 lg:pt-48", className)}
        />
    );
}

export function ErrorScreenWrapper({
    className,
    ...props
}: React.ComponentProps<typeof Wrapper>) {
    return (
        <Wrapper
            size="sm"
            {...props}
            className={cn("space-y-6 lg:space-y-8", className)}
        />
    );
}

export function ErrorScreenHeader({
    className,
    ...props
}: React.ComponentProps<typeof Wrapper>) {
    return (
        <header {...props} className={cn("space-y-3 text-center", className)} />
    );
}

export function ErrorScreenTitle({
    className,
    asChild,
    ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "h1";

    return (
        <Comp
            {...props}
            className={cn(
                "font-sans-serif text-3xl font-bold text-white sm:text-4xl",
                className,
            )}
        />
    );
}

export function ErrorScreenDescription({
    className,
    asChild,
    ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "p";

    return (
        <Comp
            {...props}
            className={cn(
                "mx-auto max-w-prose text-pretty text-sm text-zinc-200 sm:text-base",
                className,
            )}
        />
    );
}
