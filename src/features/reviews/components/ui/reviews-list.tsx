import { Skeleton } from "@/components/ui/skeleton";
import {
    ReviewCard,
    ReviewCardAvatar,
    ReviewCardContent,
    ReviewCardDate,
    ReviewCardDescription,
    ReviewCardHeader,
    ReviewCardStars,
    ReviewCardTitle,
    ReviewCardUser,
} from "@/features/reviews/components/ui/review-card";
import { cn, getNameInitials } from "@/lib/utils";

type Item = {
    id: number;
    rating: number;
    guestName: string;
    guestAvatar: string;
    createdAt: Date | string;
    title: string;
    description: string;
};

export type ReviewsListProps<TItem extends Item> = {
    data: TItem[];
    classNameItem?: string;
    renderItem?:
        | React.ReactNode
        | ((item: TItem, index: number) => React.ReactNode);
} & React.ComponentProps<"ul">;

export function ReviewsList<TItem extends Item>({
    className,
    data,
    classNameItem,
    renderItem,
    ...props
}: ReviewsListProps<TItem>) {
    return (
        <ul className={cn("space-y-4", className)} {...props}>
            {data.map((review, index) =>
                renderItem !== undefined ? (
                    typeof renderItem === "function" ? (
                        renderItem(review, index)
                    ) : (
                        renderItem
                    )
                ) : (
                    <li key={review.id}>
                        <ReviewsListItem
                            createdAt={review.createdAt}
                            guestAvatar={review.guestAvatar}
                            guestName={review.guestName}
                            rating={review.rating}
                            title={review.title}
                            description={review.description}
                            className={classNameItem}
                        />
                    </li>
                ),
            )}
        </ul>
    );
}

export type ReviewsListItemProps = Omit<Item, "id"> &
    React.ComponentProps<typeof ReviewCard>;

export function ReviewsListItem({
    guestName,
    guestAvatar,
    createdAt,
    rating,
    title,
    description,
    ...props
}: ReviewsListItemProps) {
    return (
        <ReviewCard {...props}>
            <ReviewCardHeader>
                <div className="flex gap-3.5">
                    <ReviewCardAvatar
                        src={guestAvatar}
                        fallback={getNameInitials(guestName)}
                    />
                    <div className="flex flex-col">
                        <ReviewCardUser>{guestName}</ReviewCardUser>
                        <ReviewCardDate date={createdAt} />
                    </div>
                </div>
                <ReviewCardStars length={rating} />
            </ReviewCardHeader>
            <ReviewCardContent>
                <ReviewCardTitle>{title}</ReviewCardTitle>
                <ReviewCardDescription description={description} />
            </ReviewCardContent>
        </ReviewCard>
    );
}

export function ReviewsListSkeleton({
    length = 3,
    className,
    classNameItem,
    renderItem,
    ...props
}: {
    length?: number;
    className?: string;
    classNameItem?: string;
    renderItem?: React.ReactNode | ((index: number) => React.ReactNode);
} & React.ComponentProps<"ul">) {
    return (
        <ul className={cn("space-y-4", className)} {...props}>
            {Array.from({ length: length }).map((_, index) =>
                renderItem !== undefined ? (
                    typeof renderItem === "function" ? (
                        renderItem(index)
                    ) : (
                        renderItem
                    )
                ) : (
                    <li key={index}>
                        <ReviewsListItemSkeleton className={classNameItem} />
                    </li>
                ),
            )}
        </ul>
    );
}

export function ReviewsListItemSkeleton(
    props: React.ComponentProps<typeof ReviewCard>,
) {
    return (
        <ReviewCard {...props}>
            <ReviewCardHeader className="justify-start gap-3.5">
                <Skeleton className="size-10 shrink-0 rounded-full" />

                <div className="w-full flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/12" />
                    <Skeleton className="h-4 w-3/12" />
                </div>
            </ReviewCardHeader>
            <ReviewCardContent className="space-y-3">
                <Skeleton className="h-5 w-3/12" />

                <div className="space-y-1.5">
                    <Skeleton className="h-5 w-11/12" />
                    <Skeleton className="h-5 w-6/12" />
                </div>
            </ReviewCardContent>
        </ReviewCard>
    );
}
