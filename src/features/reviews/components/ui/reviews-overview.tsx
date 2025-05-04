"use client";
import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ReviewsDistributionRatings,
    ReviewsDistributionRatingsSkeleton,
} from "@/features/reviews/components/ui/reviews-distribution-ratings";
import {
    ReviewsList,
    ReviewsListSkeleton,
} from "@/features/reviews/components/ui/reviews-list";
import { ReviewsCategoryRatings } from "@/features/reviews/components/ui/reviews-category-ratings";
import { ReviewsSummary } from "@/features/reviews/components/ui/reviews-summary";
import { getCategoryItems, sortReviews } from "@/features/reviews/lib/utils";
import { type ReviewItem } from "@/features/reviews/lib/types";
import { cn, memoize } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type SortBy = "most-recent" | "highest-rated" | "lowest-rated";

const memoizedSortReviews = memoize(sortReviews);

export type ReviewsOverviewProps = {
    data: ReviewItem[];
    classNameContainer?: string;
} & Omit<React.ComponentProps<"div">, "children">;

export function ReviewsOverview({
    data,
    classNameContainer,
    ...props
}: ReviewsOverviewProps) {
    const [sortBy, setSortBy] = useState<SortBy>("most-recent");

    const sortedReviews = useMemo(() => {
        return memoizedSortReviews(data, sortBy);
    }, [data, sortBy]);

    return (
        <ReviewsOverviewContainer className={classNameContainer}>
            <ReviewsOverviewContent {...props}>
                <ReviewsOverviewSide>
                    <ReviewsSummary
                        className="h-9 text-xl [&_svg]:size-6"
                        compact
                        data={data}
                    />

                    <ReviewsDistributionRatings data={data} />

                    <ReviewsCategoryRatings data={getCategoryItems(data)} />
                </ReviewsOverviewSide>

                <ReviewsOverviewMain>
                    <ReviewsOverviewMainHeader>
                        <div className="@3xl:hidden flex flex-col gap-4">
                            <ReviewsSummary
                                compact
                                className="text-xl"
                                data={data}
                            />

                            <ReviewsDistributionRatings
                                variant="compact"
                                data={data}
                            />

                            <ScrollArea
                                orientation="horizontal"
                                className="w-full"
                            >
                                <ReviewsCategoryRatings
                                    className="flex-nowrap pb-4"
                                    data={getCategoryItems(data)}
                                />
                            </ScrollArea>
                        </div>

                        <div className="flex w-full items-center justify-between">
                            <p className="@md:text-xl text-lg font-semibold">
                                {data.length} reviews
                            </p>

                            <Select
                                value={sortBy}
                                defaultValue={sortBy}
                                onValueChange={(value: SortBy) =>
                                    setSortBy(value)
                                }
                            >
                                <SelectTrigger className="@md:w-40 w-36">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="most-recent">
                                        Most recent
                                    </SelectItem>
                                    <SelectItem value="highest-rated">
                                        Highest rated
                                    </SelectItem>
                                    <SelectItem value="lowest-rated">
                                        Lowest rated
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </ReviewsOverviewMainHeader>

                    <ScrollArea showScrollShadow>
                        <ReviewsList
                            data={sortedReviews}
                            className="space-y-0 divide-y divide-zinc-800"
                            classNameItem="bg-transparent border-none px-0 pr-3 @md:px-6"
                        />
                    </ScrollArea>
                </ReviewsOverviewMain>
            </ReviewsOverviewContent>
        </ReviewsOverviewContainer>
    );
}

export function ReviewsOverviewSkeleton({
    classNameContainer,
    ...props
}: {
    classNameContainer?: string;
} & Omit<React.ComponentProps<"div">, "children">) {
    return (
        <ReviewsOverviewContainer className={classNameContainer}>
            <ReviewsOverviewContent {...props}>
                <ReviewsOverviewSide>
                    <Skeleton className="h-7 w-2/6" />

                    <ReviewsDistributionRatingsSkeleton className="w-full" />
                </ReviewsOverviewSide>

                <ReviewsOverviewMain>
                    <ReviewsOverviewMainHeader>
                        <Skeleton className="h-7 w-3/12" />
                    </ReviewsOverviewMainHeader>

                    <ScrollArea showScrollShadow>
                        <ReviewsListSkeleton
                            length={6}
                            className="space-y-0 divide-y divide-zinc-800"
                            classNameItem="bg-transparent border-none px-0 pr-3 @md:px-6"
                        />
                    </ScrollArea>
                </ReviewsOverviewMain>
            </ReviewsOverviewContent>
        </ReviewsOverviewContainer>
    );
}

function ReviewsOverviewContainer({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("@container/reviews-overview h-full", className)}
        />
    );
}

function ReviewsOverviewContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "@5xl:px-6 @5xl:gap-14 @3xl:flex-row flex h-full flex-col gap-6",
                className,
            )}
        />
    );
}

function ReviewsOverviewSide({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "@3xl:block hidden w-[36ch] space-y-6 pt-6",
                className,
            )}
        />
    );
}

function ReviewsOverviewMain({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "flex grow flex-col [@media(min-height:58rem)]:h-full",
                className,
            )}
        />
    );
}

function ReviewsOverviewMainHeader({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "@3xl:flex-row @3xl:items-center @3xl:justify-between @md:px-6 @md:py-6 flex flex-col gap-2 border-b border-zinc-800 pb-6",
                className,
            )}
        />
    );
}
