"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { type EmblaCarouselType } from "embla-carousel";

import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EventFor } from "@/lib/types";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    canScrollPrev: boolean;
    canScrollNext: boolean;
    slidesInView: number[];
    scrollSnaps: number[];
    selectedIndex: number;
    scrollPrev: () => void;
    scrollNext: () => void;
    handleDotClick: (index: number) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }

    return context;
}

function Carousel({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    onItemChange,
    onDestroy,
    ...props
}: React.ComponentProps<"div"> &
    CarouselProps & {
        onItemChange?: (index?: number) => void;
        onDestroy?: () => void;
    }) {
    const [carouselRef, api] = useEmblaCarousel(
        {
            ...opts,
            axis: orientation === "horizontal" ? "x" : "y",
        },
        plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
    const [slidesInView, setSlidesInView] = useState<number[]>([]);

    const onInit = useCallback((api: EmblaCarouselType) => {
        setScrollSnaps(api.scrollSnapList());
    }, []);

    const onSelect = useCallback((api: CarouselApi) => {
        if (!api) return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
        setSelectedIndex(api.selectedScrollSnap());
        onItemChange?.(api.selectedScrollSnap());
    }, []);

    const scrollPrev = useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const scrollNext = useCallback(() => {
        api?.scrollNext();
    }, [api]);

    const handleDotClick = useCallback(
        (index: number) => {
            if (!api) return;
            api.scrollTo(index);
        },
        [api],
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollPrev();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollNext();
            }
        },
        [scrollPrev, scrollNext],
    );

    const updateSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {
        setSlidesInView(slidesInView => {
            if (slidesInView.length === emblaApi.slideNodes().length) {
                emblaApi.off("slidesInView", updateSlidesInView);
            }
            const inView = emblaApi
                .slidesInView()
                .filter(index => !slidesInView.includes(index));
            return slidesInView.concat(inView);
        });
    }, []);

    useEffect(() => {
        if (!api || !setApi) return;
        setApi(api);
    }, [api, setApi]);

    useEffect(() => {
        if (!api) return;
        onInit(api);
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        api.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
        api.on("destroy", () => {
            onDestroy?.();
        });

        return () => {
            api?.off("select", onSelect);
            api?.off("reInit", onInit);
        };
    }, [api, onSelect, onInit]);

    useEffect(() => {
        if (!api) return;

        updateSlidesInView(api);
        api.on("slidesInView", updateSlidesInView);
        api.on("reInit", updateSlidesInView);

        return () => {
            api.off("slidesInView", updateSlidesInView);
            api.off("reInit", updateSlidesInView);
        };
    }, [api, updateSlidesInView]);

    return (
        <CarouselContext.Provider
            value={{
                carouselRef,
                api: api,
                opts,
                orientation:
                    orientation ||
                    (opts?.axis === "y" ? "vertical" : "horizontal"),
                scrollSnaps,
                selectedIndex,
                slidesInView,
                canScrollPrev,
                canScrollNext,
                scrollPrev,
                scrollNext,
                handleDotClick,
            }}
        >
            <div
                onKeyDownCapture={handleKeyDown}
                className={cn("relative grid items-center", className)}
                role="region"
                aria-roledescription="carousel"
                data-slot="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
    const { carouselRef, orientation } = useCarousel();

    return (
        <div
            ref={carouselRef}
            className="overflow-hidden"
            data-slot="carousel-content"
        >
            <div
                className={cn(
                    "flex",
                    orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                    className,
                )}
                {...props}
            />
        </div>
    );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
    const { orientation } = useCarousel();

    return (
        <div
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full",
                orientation === "horizontal" ? "pl-4" : "pt-4",
                className,
            )}
            {...props}
        />
    );
}

type CarouselButtonProps = {
    hideOnDisabled?: boolean;
} & React.ComponentProps<typeof Button>;

function CarouselPrevious({
    className,
    variant = "blurred",
    size = "icon",
    hideOnDisabled = false,
    onClick,
    ...props
}: CarouselButtonProps) {
    const { scrollPrev, canScrollPrev } = useCarousel();

    function handleClick(e: EventFor<"button", "onClick">) {
        if (!canScrollPrev) return;
        scrollPrev();
        onClick?.(e);
    }

    return (
        <Button
            data-slot="carousel-previous"
            variant={variant}
            size={size}
            className={cn(
                "absolute left-2 size-8 justify-self-start rounded-full",
                hideOnDisabled && !canScrollPrev && "!cursor-auto !opacity-0",
                className,
            )}
            onClick={handleClick}
            {...props}
        >
            <ArrowLeft />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
}

function CarouselNext({
    className,
    variant = "blurred",
    size = "icon",
    hideOnDisabled = false,
    onClick,
    ...props
}: CarouselButtonProps) {
    const { scrollNext, canScrollNext } = useCarousel();

    function handleClick(e: EventFor<"button", "onClick">) {
        if (!canScrollNext) return;
        scrollNext();
        onClick?.(e);
    }

    return (
        <Button
            data-slot="carousel-next"
            variant={variant}
            size={size}
            className={cn(
                "absolute right-2 justify-self-end rounded-full",
                hideOnDisabled && !canScrollNext && "!cursor-auto !opacity-0",
                className,
            )}
            onClick={handleClick}
            {...props}
        >
            <ArrowRight />
            <span className="sr-only">Next slide</span>
        </Button>
    );
}

function CarouselDots({
    className,
    children,
    hideForSingleSlide = true,
    ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
    hideForSingleSlide?: boolean;
    children?: (index: number) => React.ReactNode;
}) {
    const { scrollSnaps } = useCarousel();

    if (hideForSingleSlide && scrollSnaps.length < 2) {
        return null;
    }

    return (
        <div
            {...props}
            className={cn(
                "absolute bottom-2.5 flex justify-center justify-self-center",
                className,
            )}
        >
            {scrollSnaps.map((_, index) =>
                children ? (
                    <React.Fragment key={index}>
                        {children(index)}
                    </React.Fragment>
                ) : (
                    <CarouselDot
                        key={index}
                        index={index}
                        {...(props.tabIndex === -1 && { tabIndex: -1 })}
                    />
                ),
            )}
        </div>
    );
}

function CarouselCounter({ className, ...props }: React.ComponentProps<"p">) {
    const { selectedIndex, scrollSnaps } = useCarousel();

    return (
        <p className={cn("font-medium", className)} {...props}>
            {selectedIndex + 1} / {scrollSnaps.length}
        </p>
    );
}

function CarouselDot({
    children,
    index,
    className,
    variant = "ghost",
    size = "icon",
    ...props
}: React.ComponentProps<typeof Button> & { index: number }) {
    const { handleDotClick, selectedIndex } = useCarousel();

    return (
        <Button
            onClick={() => handleDotClick(index)}
            variant={variant}
            size={size}
            className={cn(
                "size-3 !border-transparent !bg-transparent !ring-0 focus-visible:opacity-90 [&_svg:not([class*='fill-'])]:fill-white [&_svg:not([class*='size-'])]:size-2/3 [&_svg:not([class*='stroke-'])]:stroke-2 [&_svg:not([class*='text-'])]:text-white",
                selectedIndex !== index && "opacity-50",
                selectedIndex === index && "opacity-100",
                className,
            )}
            {...props}
        >
            {children ?? <CircleIcon />}
            <span className="sr-only">Go to slide {index + 1}</span>
        </Button>
    );
}

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
    CarouselCounter,
};
