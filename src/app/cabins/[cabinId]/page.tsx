import { Suspense } from "react";
import { type Metadata } from "next";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import { Wrapper } from "@/components/ui/wrapper";
import { Separator } from "@/components/ui/separator";
import { ImageBackdrop } from "@/components/ui/image-backdrop";
import {
    CabinReviewsSummary,
    CabinInfoList,
    CabinRules,
    fakeCabinAmenities,
    fakeCabinCategorizedAmenities,
    getCabinById,
    getAllCabinsIds,
    CabinImagesGallery,
    CabinRecentReviews,
    CabinReviewsOverview,
    CabinCategorizedList,
    getCabinReviews,
    type CabinId,
} from "@/features/cabins";
import { Button } from "@/components/ui/button";
import {
    BookingSuccessDialog,
    CreateBookingCard,
    CreateBookingCardSkeleton,
    CreateBookingDrawer,
    CreateBookingDrawerSkeleton,
} from "@/features/bookings";
import { ConditinalRender } from "@/components/ui/conditinal-render";
import {
    ReviewsListSkeleton,
    ReviewsOverviewSkeleton,
} from "@/features/reviews";
import {
    ExpandableText,
    ExpandableTextContent,
    ExpandableTextTrigger,
} from "@/components/ui/extendable-text";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogTrigger,
    DialogDescription,
    DialogFullHeightContent,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { type Location } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

type PageProps = {
    params: Promise<{
        cabinId: CabinId;
    }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { cabinId } = await params;
    const { name, images } = await getCabinById(cabinId);

    return {
        title: name,
        openGraph: {
            images: [
                {
                    url: images[0],
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
        },
        twitter: {
            images: [images[0]],
        },
    } satisfies Metadata;
}

export async function generateStaticParams() {
    const data = await getAllCabinsIds();
    return data.map(({ id }) => ({ cabinId: String(id) }));
}

export default async function Page({ params }: PageProps) {
    const { cabinId } = await params;
    const { name, images, description, maxNumOfGuests, location } =
        await getCabinById(cabinId);

    return (
        <Wrapper className="pb-30 lg:pt-30 h-full flex-1 pt-24" as="article">
            <ImageBackdrop image={images[0]} />
            <Suspense>
                <CabinImagesGallery images={images} name={name} />
            </Suspense>

            <div className="mt-8 grid sm:gap-6 lg:grid-cols-[1.7fr_1fr]">
                <main className="@container/main space-y-10">
                    <Header
                        location={location}
                        name={name}
                        description={description}
                        maxNumOfGuests={maxNumOfGuests}
                    />
                    <Amenities />
                    <Reviews cabinId={cabinId} />
                    <Map location={location} />
                    <Rules />
                </main>

                <aside>
                    <ConditinalRender query="(min-width: 64rem)">
                        <Suspense
                            fallback={
                                <CreateBookingCardSkeleton className="sticky top-24 hidden lg:flex" />
                            }
                        >
                            <CreateBookingCard
                                cabinId={cabinId}
                                className="sticky top-24 hidden lg:flex"
                            />
                        </Suspense>
                    </ConditinalRender>
                </aside>

                <ConditinalRender query="(max-width: 64rem)">
                    <Suspense
                        fallback={
                            <CreateBookingDrawerSkeleton className="lg:hidden" />
                        }
                    >
                        <CreateBookingDrawer
                            cabinId={cabinId}
                            className="lg:hidden"
                        />
                    </Suspense>
                </ConditinalRender>
                <Suspense>
                    <BookingSuccessDialog />
                </Suspense>
            </div>
        </Wrapper>
    );
}

function Header({
    name,
    description,
    maxNumOfGuests,
    location,
}: {
    location: Location;
    name: string;
    description: string;
    maxNumOfGuests: number;
}) {
    const numOfBedrooms = maxNumOfGuests / 2;
    const numOfBathrooms = Math.max(maxNumOfGuests / 2 - 1, 1);

    return (
        <header className="space-y-4">
            <h1 className="font-sans-serif text-2xl font-bold text-white sm:text-4xl">
                {name}
            </h1>
            <CabinInfoList
                data={[
                    {
                        icon: "mapPin",
                        label: `${location.city}, ${location.country}`,
                    },
                    {
                        icon: "users",
                        label: `${maxNumOfGuests} guests`,
                    },
                    {
                        icon: "bedDouble",
                        label: `${numOfBedrooms} bedroom${numOfBedrooms > 1 ? "s" : ""}`,
                    },
                    {
                        icon: "bath",
                        label: `${numOfBathrooms} bathroom${numOfBathrooms > 1 ? "s" : ""}`,
                    },
                ]}
            />
            <Separator />
            <ExpandableText className="max-w-[72ch] text-zinc-200" length={220}>
                <ExpandableTextContent>{description}</ExpandableTextContent>{" "}
                <ExpandableTextTrigger />
            </ExpandableText>
        </header>
    );
}

function Amenities() {
    return (
        <section className="space-y-4">
            <h2 className="!mb-3 text-lg font-medium text-white">
                Hotel-grade amenities
            </h2>

            <CabinInfoList
                className="grid grid-cols-[repeat(auto-fill,minmax(min(28ch,100%),1fr))] gap-2"
                data={fakeCabinAmenities}
            />

            <Suspense>
                <Dialog openOnSearchParams="amenities">
                    <DialogTrigger asChild>
                        <Button variant="secondary">Show all amenities</Button>
                    </DialogTrigger>{" "}
                    <DialogFullHeightContent className="max-w-2xl pb-8">
                        <div className="flex h-full flex-col">
                            <DialogHeader className="pb-6 pt-2">
                                <DialogTitle className="text-xl">
                                    Hotel-grade amenities
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    All amenities are included in your stay.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea showScrollShadow>
                                <CabinCategorizedList
                                    data={fakeCabinCategorizedAmenities}
                                />
                            </ScrollArea>
                        </div>
                    </DialogFullHeightContent>
                </Dialog>
            </Suspense>
        </section>
    );
}

async function Reviews({ cabinId }: { cabinId: CabinId }) {
    const reviews = await getCabinReviews(cabinId);

    if (reviews.length === 0) {
        return null;
    }

    return (
        <section className="space-y-4">
            <Suspense fallback={<Skeleton className="h-7 w-3/12" />}>
                <CabinReviewsSummary
                    as="h2"
                    cabinId={cabinId}
                    className="text-lg font-medium text-white"
                />
            </Suspense>

            <Suspense fallback={<ReviewsListSkeleton />}>
                <CabinRecentReviews cabinId={cabinId} />
            </Suspense>

            <Suspense>
                <Dialog openOnSearchParams="reviews">
                    <DialogTrigger asChild>
                        <Button variant="secondary">Show all reviews</Button>
                    </DialogTrigger>
                    <DialogFullHeightContent className="max-w-[calc(100vw-2rem)] md:max-w-6xl">
                        <DialogTitle className="sr-only">
                            Reviews Overview
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            This dialog shows the reviews overview.
                        </DialogDescription>

                        <Suspense fallback={<ReviewsOverviewSkeleton />}>
                            <CabinReviewsOverview cabinId={cabinId} />
                        </Suspense>
                    </DialogFullHeightContent>
                </Dialog>
            </Suspense>
        </section>
    );
}

function Map({ location }: { location: Location }) {
    return (
        <section className="space-y-4">
            <h2 className="text-lg font-medium text-white">
                Where you&apos;ll be staying
            </h2>
            <div className="overflow-hidden rounded-xl">
                <GoogleMapsEmbed
                    apiKey={process.env.GOOGLE_MAPS_KEY}
                    height={400}
                    width="100%"
                    mode="place"
                    q={`${location.address}, ${location.city}, ${location.country}`}
                />
            </div>
        </section>
    );
}

function Rules() {
    return (
        <section className="space-y-4">
            <h2 className="text-lg font-medium text-white">
                Property rules and information
            </h2>
            <CabinRules type="single" collapsible />
        </section>
    );
}
