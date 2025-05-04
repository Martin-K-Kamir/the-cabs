"use client";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { EventFor } from "@/lib/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

type ImageItem = string | { id: string; src: string };

export type ImagesGalleryBentoProps<TImage extends ImageItem> = {
    images: TImage[];
    classNameImage?: string;
    limitDesktop?: number;
    limitMobile?: number;
    onImageClick?: (
        event: EventFor<"img", "onClick">,
        image: TImage,
        index: number,
    ) => void;
    render?: (image: TImage, index: number) => React.ReactNode;
} & React.ComponentProps<"div">;

export function ImagesGalleryBento<TImage extends ImageItem>({
    images,
    className,
    classNameImage,
    limitDesktop = 3,
    limitMobile = 1,
    onImageClick,
    render,
    children,
    ...props
}: ImagesGalleryBentoProps<TImage>) {
    const isSm = useMediaQuery("(min-width: 40rem)", {
        defaultValue: true,
        initializeWithValue: false,
    });
    const limit = isSm ? limitDesktop : limitMobile;

    return (
        <div
            className={cn(
                "grid aspect-[1.1/1] sm:aspect-[16/7] sm:grid-cols-[1.7fr_1fr] sm:grid-rows-2 sm:gap-4",
                images.length < 3 && "!gap-0 sm:grid-cols-1 sm:grid-rows-1",
                className,
            )}
            {...props}
        >
            {images
                .slice(0, limit)
                .map(
                    (image, index) =>
                        render?.(image, index) ?? (
                            <ImagesGalleryBentoItem
                                key={
                                    typeof image === "string" ? image : image.id
                                }
                                index={index}
                                src={
                                    typeof image === "string"
                                        ? image
                                        : image.src
                                }
                                className={cn(
                                    "max-sm:not-first:hidden",
                                    classNameImage,
                                )}
                                alt={`Image ${index + 1} of ${images.length}`}
                                onClick={event =>
                                    onImageClick?.(event, image, index)
                                }
                            />
                        ),
                )}
            {children}
        </div>
    );
}

export function ImagesGalleryBentoItem({
    className,
    index,
    alt,
    ...props
}: React.ComponentProps<typeof Image> & {
    index: number;
    classNameMainImage?: string;
    classNameImage?: string;
}) {
    return (
        <div
            className={cn(
                "relative rounded-xl [&>img]:size-full [&>img]:rounded-[inherit] [&>img]:object-cover",
                index === 0 ? "row-span-full" : "col-span-1 row-span-1",
                className,
            )}
        >
            <Image
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={alt}
                {...props}
            />
        </div>
    );
}

export type ImagesGalleryGridProps<TImage extends ImageItem> = {
    images: TImage[];
    classNameImage?: string;
    onImageClick?: (
        event: EventFor<"img", "onClick">,
        image: TImage,
        index: number,
    ) => void;
    render?: (image: TImage, index: number) => React.ReactNode;
} & React.ComponentProps<"div">;

export function ImagesGalleryGrid<TImage extends ImageItem>({
    images,
    className,
    classNameImage,
    render,
    onImageClick,
    children,
    ...props
}: ImagesGalleryGridProps<TImage>) {
    return (
        <div
            {...props}
            className={cn(
                "grid grid-cols-1 content-start gap-4 lg:grid-cols-2",
                className,
            )}
        >
            {images.map(
                (image, index) =>
                    render?.(image, index) ?? (
                        <div
                            key={typeof image === "string" ? image : image.id}
                            className={cn(
                                "relative aspect-video rounded-xl [&>img]:size-full [&>img]:rounded-[inherit] [&>img]:object-cover",
                                classNameImage,
                            )}
                        >
                            <Image
                                fill
                                src={
                                    typeof image === "string"
                                        ? image
                                        : image.src
                                }
                                alt={`Image ${index + 1} of ${images.length}`}
                                onClick={event =>
                                    onImageClick?.(event, image, index)
                                }
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ),
            )}
            {children}
        </div>
    );
}

export type ImagesGalleryCarouselProps<TImage extends ImageItem> = {
    images: TImage[];
    classNameImage?: string;
    classNameButtons?: string;
    onImageClick?: (
        event: EventFor<"img", "onClick">,
        image: TImage,
        index: number,
    ) => void;
    render?: (image: TImage, index: number) => React.ReactNode;
} & React.ComponentProps<typeof Carousel>;

export function ImagesGalleryCarousel<TImage extends ImageItem>({
    images,
    classNameImage,
    classNameButtons,
    onImageClick,
    render,
    children,
    ...props
}: ImagesGalleryCarouselProps<TImage>) {
    const cnButtons = cn(
        "transition-[opacity,scale] hover:scale-105 focus:scale-105 lg:left-4 lg:size-9",
        classNameButtons,
    );

    return (
        <Carousel {...props}>
            <CarouselContent className="relative m-0">
                {images.map(
                    (image, index) =>
                        render?.(image, index) ?? (
                            <CarouselItem
                                key={
                                    typeof image === "string" ? image : image.id
                                }
                                className={cn(
                                    "relative aspect-[4/3] lg:aspect-video [&>img]:rounded-xl [&>img]:object-cover",
                                    classNameImage,
                                )}
                            >
                                <Image
                                    fill
                                    src={
                                        typeof image === "string"
                                            ? image
                                            : image.src
                                    }
                                    alt={`Image ${index + 1} of ${images.length}`}
                                    onClick={event =>
                                        onImageClick?.(event, image, index)
                                    }
                                />
                            </CarouselItem>
                        ),
                )}
            </CarouselContent>
            <CarouselPrevious hideOnDisabled className={cnButtons} />
            <CarouselNext hideOnDisabled className={cnButtons} />
            {children}
        </Carousel>
    );
}
