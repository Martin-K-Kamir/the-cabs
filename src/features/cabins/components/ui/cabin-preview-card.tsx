"use client";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselDots, CarouselItem } from "@/components/ui/carousel";
import { ImagesGalleryCarousel } from "@/components/ui/images-gallery";
import { ReviewsSummary } from "@/features/reviews/components/ui/reviews-summary";
import { BookingPrice } from "@/features/bookings/components/ui/booking-price";
import type { CabinId } from "@/features/cabins/lib/types";
import { cn, formatCompactDateRange } from "@/lib/utils";

export type CabinPreviewCardProps = {
    id: CabinId;
    name: string;
    images: string[];
    price: number;
    discount: number;
    index?: number;
    nextAvailableDate?: {
        from?: Date;
        to?: Date;
    };
    location?: {
        city: string;
        country: string;
    };
    ratings?: { rating: number }[];
} & Omit<React.ComponentProps<"article">, "children" | "id">;

export function CabinPreviewCard({
    id,
    name,
    images,
    price,
    discount,
    className,
    ratings,
    location,
    nextAvailableDate,
    index = 0,
}: CabinPreviewCardProps) {
    return (
        <article
            style={
                {
                    "--cabin-preview-index": index,
                } as React.CSSProperties
            }
            className={cn(
                "@container/cabin-preview animate-fade-in group/cabin-preview relative rounded-xl ring-zinc-800 ring-offset-4 ring-offset-zinc-800 [animation-delay:calc(0.1s*var(--cabin-preview-index))] [&:has(*:focus-visible)]:bg-zinc-800 [&:has(*:focus-visible)]:ring-4",
                className,
            )}
        >
            <Link
                href={`/cabins/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 rounded-xl outline-none"
                tabIndex={-1}
            />

            <ImagesGalleryCarousel
                className="relative aspect-[1.1/1] overflow-hidden rounded-xl transition-[scale] group-hover/cabin-preview:scale-[103%]"
                classNameButtons="opacity-0 transition-[opacity,scale] hover:scale-105 group-hover/cabin-preview:opacity-100 group-has-[*:focus-visible]/cabin-preview:opacity-100 lg:size-8"
                images={images}
                render={(image, index) => (
                    <CarouselItem
                        key={image}
                        className="relative aspect-[1.1/1] overflow-hidden p-0 first:rounded-l-xl last:rounded-r-xl"
                    >
                        <Link
                            href={`/cabins/${id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 rounded-xl outline-none"
                        >
                            <Image
                                fill
                                src={image}
                                alt={`Image ${index + 1} of ${images.length} showcasing the ${name}`}
                                className="object-cover"
                                priority={true}
                                sizes="(max-width: 600px) 100vw, 600px"
                            />
                        </Link>
                    </CarouselItem>
                )}
            >
                <CarouselDots tabIndex={-1} />
            </ImagesGalleryCarousel>

            <section className="mt-2">
                <header className="flex items-center justify-between">
                    <h3 className="font-semibold">{name}</h3>
                    {ratings && (
                        <ReviewsSummary
                            data={ratings}
                            compact
                            className="gap-1 text-sm [&_svg]:size-3 [&_svg]:translate-y-[0.5px]"
                        />
                    )}
                </header>

                {location && (
                    <p className="mt-0.5 text-sm text-zinc-300">
                        {location.city}, {location.country}
                    </p>
                )}
                {nextAvailableDate && (
                    <p className="text-sm text-zinc-300">
                        {formatCompactDateRange(
                            nextAvailableDate?.from,
                            nextAvailableDate?.to,
                            {
                                fallback: "no available dates",
                                hideSameMonth: true,
                                fromPrefix: "Available from ",
                            },
                        )}
                    </p>
                )}
                <BookingPrice
                    className="mt-1 text-base"
                    price={price}
                    discount={discount}
                    suffix=" night"
                />
            </section>
        </article>
    );
}

export function CabinPreviewCardSkeleton() {
    return (
        <div className="flex flex-col space-y-3.5">
            <Skeleton className="aspect-[1.1/1] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
                <Skeleton className="h-6 w-2/6" />
            </div>
        </div>
    );
}
