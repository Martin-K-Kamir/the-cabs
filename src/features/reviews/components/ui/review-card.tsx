"use client";
import { Slot } from "@radix-ui/react-slot";

import { formatDistance } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stars, type StarsProps } from "@/components/ui/stars";
import {
    ExpandableText,
    ExpandableTextContent,
    ExpandableTextTrigger,
} from "@/components/ui/extendable-text";
import { cn } from "@/lib/utils";

export function ReviewCard({
    className,
    ...props
}: React.ComponentProps<"article">) {
    return (
        <article
            {...props}
            className={cn(
                "space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6",
                className,
            )}
        />
    );
}

export function ReviewCardHeader({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("flex items-center justify-between gap-2", className)}
        />
    );
}
export function ReviewCardContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return <div {...props} className={cn("space-y-1.5", className)} />;
}

export function ReviewCardStars({ ...props }: Omit<StarsProps, "maxLenght">) {
    return <Stars {...props} maxLenght={5} />;
}

export function ReviewCardAvatar({
    fallback,
    src,
}: React.ComponentProps<typeof Avatar> & {
    src: string;
    fallback: string;
}) {
    return (
        <Avatar className="size-10">
            <AvatarImage src={src} />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    );
}

export function ReviewCardUser({
    className,
    asChild,
    ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "p";

    return (
        <Comp
            {...props}
            className={cn("text-sm font-medium text-white", className)}
        />
    );
}

export function ReviewCardDate({
    date,
    className,
    ...props
}: React.ComponentProps<"time"> & {
    date: Date | string;
}) {
    return (
        <time
            dateTime={new Date(date).toISOString()}
            className={cn("text-sm text-zinc-300", className)}
            {...props}
        >
            {formatDistance(date, new Date(), {
                addSuffix: true,
            })
                .replace("about ", "")
                .replace("in", "In")}
        </time>
    );
}

export function ReviewCardTitle({
    className,
    asChild,
    ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "p";

    return (
        <Comp {...props} className={cn("font-medium text-white", className)} />
    );
}

export function ReviewCardDescription({
    className,
    description,
    ...props
}: Omit<React.ComponentProps<typeof ExpandableText>, "children"> & {
    description: string;
}) {
    return (
        <ExpandableText
            {...props}
            className={cn("max-w-prose text-pretty text-zinc-200", className)}
        >
            <ExpandableTextContent>{description}</ExpandableTextContent>{" "}
            <ExpandableTextTrigger />
        </ExpandableText>
    );
}
