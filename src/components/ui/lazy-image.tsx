"use client";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export type LazyImageProps = React.ComponentProps<"img"> & {
    renderLoader?: React.ReactNode;
    classNameLoader?: string;
    classNameWrapper?: string;
    isLoaded?: boolean;
};

export function LazyImage({
    className,
    classNameLoader,
    classNameWrapper,
    renderLoader,
    isLoaded,
    ...props
}: LazyImageProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(() => isLoaded ?? false);

    useEffect(() => {
        setIsImageLoaded(isLoaded ?? false);
    }, [isLoaded]);

    return (
        <div className={cn("relative", classNameWrapper)}>
            {!isImageLoaded &&
                (renderLoader ? (
                    renderLoader
                ) : (
                    <div
                        className={cn(
                            "grid size-full place-items-center rounded-2xl bg-zinc-800 [&_svg]:size-1/4 [&_svg]:animate-spin [&_svg]:text-zinc-400",
                            classNameLoader,
                        )}
                    >
                        <LoaderCircleIcon />
                    </div>
                ))}

            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
                className={cn(
                    "size-full rounded-2xl object-cover transition-opacity duration-100",
                    isImageLoaded
                        ? "opacity-100"
                        : "invisible absolute size-0 opacity-0",
                    className,
                )}
                onLoad={() => setIsImageLoaded(true)}
                {...props}
            />
        </div>
    );
}
