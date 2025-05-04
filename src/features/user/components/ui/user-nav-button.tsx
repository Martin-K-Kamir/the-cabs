import { MenuIcon, UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatUserInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export type UserNavButtonProps = {
    isLoading?: boolean;
    userName?: string | null;
    userAvatar?: string | null;
} & React.ComponentProps<"button">;

export function UserNavButton({
    className,
    userName,
    userAvatar,
    isLoading = false,
    children,
    ...props
}: UserNavButtonProps) {
    let content: React.ReactNode = null;
    if (isLoading) {
        content = <Skeleton className="hidden size-8 rounded-full lg:block" />;
    }

    if (!isLoading && userName) {
        content = (
            <Avatar className="hidden lg:flex">
                <AvatarImage
                    src={userAvatar ?? ""}
                    alt={`${userName}'s avatar picture`}
                />
                <AvatarFallback>{formatUserInitials(userName)}</AvatarFallback>
            </Avatar>
        );
    }

    if (!isLoading && !userName && !userAvatar) {
        content = (
            <span className="hidden size-8 items-center justify-center rounded-full bg-zinc-700 lg:flex">
                <UserRoundIcon className="size-5" />
            </span>
        );
    }

    return (
        <button
            {...props}
            className={cn(
                "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent bg-transparent text-sm font-medium text-zinc-50 outline-none ring-zinc-100 transition-all hover:border-zinc-800 hover:bg-zinc-800 focus-visible:border-zinc-300 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-zinc-800 lg:size-auto lg:gap-3.5 lg:border lg:border-zinc-800 lg:bg-zinc-950 lg:py-2 lg:pl-4 lg:pr-2.5 lg:hover:bg-zinc-900 lg:hover:text-zinc-50 lg:data-[state=open]:bg-zinc-900 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
        >
            <MenuIcon className="text-zinc-100" />
            {content}
            {children}
        </button>
    );
}
