"use client";
import Fade from "embla-carousel-fade";
import {
    Dialog,
    DialogDescription,
    DialogScreenContent,
    DialogStickyHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import {
    ImagesGalleryBento,
    ImagesGalleryCarousel,
    ImagesGalleryGrid,
} from "@/components/ui/images-gallery";
import { CarouselCounter } from "@/components/ui/carousel";
import { LayoutGridIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { ShareButton } from "@/components/ui/share-button";

export type CabinImagesGalleryProps = {
    images: (string | { id: string; src: string })[];
    name: string;
};

const DIALOG_GALLERY_SEARCH_PARAM = "dialog-cabin-images";
const DIALOG_IMAGE_SEARCH_PARAM = "image";

export function CabinImagesGallery({ images, name }: CabinImagesGalleryProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isDialogGalleryOpen, setIsDialogGalleryOpen] = useState(false);
    const [isDialogImageOpen, setIsDialogImageOpen] = useState(false);

    const imageIndex = useRef(
        Number(searchParams.get(DIALOG_IMAGE_SEARCH_PARAM)) || 0,
    );

    function setDialogGallerySearchParams(open: boolean) {
        const params = new URLSearchParams(searchParams);

        if (open) {
            params.set(DIALOG_GALLERY_SEARCH_PARAM, "open");
        } else {
            params.delete(DIALOG_GALLERY_SEARCH_PARAM);
        }

        window.history.replaceState(null, "", `${pathname}?${params}`);
    }

    function setDialogImageSearchParams(open: boolean, index?: number) {
        const params = new URLSearchParams(searchParams);

        if (open && index !== undefined) {
            imageIndex.current = index;
            params.set(DIALOG_IMAGE_SEARCH_PARAM, index.toString());
        } else {
            params.delete(DIALOG_IMAGE_SEARCH_PARAM);
        }

        window.history.replaceState(null, "", `${pathname}?${params}`);
    }

    useEffect(() => {
        setIsDialogGalleryOpen(
            searchParams.get(DIALOG_GALLERY_SEARCH_PARAM) === "open",
        );
        setIsDialogImageOpen(
            searchParams.get(DIALOG_IMAGE_SEARCH_PARAM) !== null,
        );
    }, []);

    return (
        <Dialog
            open={isDialogGalleryOpen}
            onOpenChange={open => {
                setDialogGallerySearchParams(open);
                setIsDialogGalleryOpen(open);
            }}
        >
            <div className="relative">
                <ImagesGalleryBento
                    images={images}
                    classNameImage="[&>img]:cursor-pointer"
                    onImageClick={() => {
                        setDialogGallerySearchParams(true);
                        setIsDialogGalleryOpen(true);
                    }}
                />
                <DialogTrigger asChild>
                    <Button
                        className="absolute bottom-4 right-4 h-7 px-3 py-1 text-xs sm:h-9 sm:px-4 sm:py-2 sm:has-[>svg]:px-3"
                        variant="blurred"
                    >
                        <LayoutGridIcon className="hidden sm:flex" />
                        <span className="hidden sm:flex">Show Gallery</span>
                        <span className="flex sm:hidden">
                            1/{images.length}
                            <span className="sr-only">
                                images in the gallery. Click to see all images.
                            </span>
                        </span>
                    </Button>
                </DialogTrigger>
            </div>

            <DialogScreenContent className="pb-6">
                <CabinImagesHeader
                    title={name}
                    description={`Images gallery of ${name}. Click on an image to view it in full size.`}
                />

                <Dialog
                    open={isDialogImageOpen}
                    onOpenChange={open => {
                        setDialogImageSearchParams(open);
                        setIsDialogImageOpen(open);
                    }}
                >
                    <ImagesGalleryGrid
                        images={images}
                        classNameImage="[&>img]:cursor-pointer"
                        onImageClick={(_, __, index) => {
                            imageIndex.current = index;
                            setIsDialogImageOpen(true);
                            setDialogImageSearchParams(true, index);
                        }}
                    />

                    <DialogScreenContent className="pb-6">
                        <CabinImagesHeader
                            title={name}
                            description={`Images gallery of ${name}. Use the left and right arrows to navigate through the images.`}
                        />

                        <ImagesGalleryCarousel
                            plugins={[Fade()]}
                            opts={{
                                startIndex: imageIndex.current,
                            }}
                            images={images}
                            classNameButtons="-translate-y-1/2"
                            onItemChange={index => {
                                setDialogImageSearchParams(true, index);
                            }}
                            onDestroy={() => {
                                setDialogImageSearchParams(false);
                            }}
                        >
                            <CarouselCounter className="mx-auto mt-4" />
                        </ImagesGalleryCarousel>
                    </DialogScreenContent>
                </Dialog>
            </DialogScreenContent>
        </Dialog>
    );
}

export function CabinImagesHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <DialogStickyHeader>
            <div className="flex items-center gap-1.5">
                <ShareButton
                    variant="outline"
                    shareData={{
                        text: "Check out this cabin!",
                    }}
                />
            </div>
            <DialogTitle className="font-sans-serif text-sm font-bold text-white sm:text-base">
                {title}
            </DialogTitle>
            <DialogDescription className="sr-only">
                {description}.
            </DialogDescription>
        </DialogStickyHeader>
    );
}
