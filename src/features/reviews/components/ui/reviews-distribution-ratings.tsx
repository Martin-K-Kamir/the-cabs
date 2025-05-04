import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getRatingsDistribution } from "@/features/reviews/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "default" | "compact";
type Item = {
    rating: number;
};

export type ReviewsDistributionRatingsProps<TItem extends Item> = {
    variant?: Variant;
    data: TItem[];
    hideEmptyItems?: boolean;
    classNameItem?: string;
    renderItem?:
        | ((
              item: TItem & { ratingPercent: number },
              index: number,
          ) => React.ReactNode)
        | React.ReactNode;
} & React.ComponentProps<"ul">;

export function ReviewsDistributionRatings<TItem extends Item>({
    className,
    classNameItem,
    hideEmptyItems = false,
    variant = "default",
    data,
    renderItem,
    ...props
}: ReviewsDistributionRatingsProps<TItem>) {
    const items = getRatingsDistribution(data, hideEmptyItems);

    return (
        <ul
            {...props}
            className={cn(
                "min-w-32",
                variant === "default" && "space-y-2",
                variant === "compact" && "space-y-1",
                className,
            )}
        >
            {items.map((item, index) =>
                renderItem ? (
                    typeof renderItem === "function" ? (
                        renderItem(
                            {
                                ...item,
                                ratingPercent: item.ratingPercent,
                            } as TItem & { ratingPercent: number },
                            index,
                        )
                    ) : (
                        <>{renderItem}</>
                    )
                ) : (
                    <ReviewsDistributionRatingsItem
                        key={item.rating}
                        rating={item.rating}
                        ratingPercent={item.ratingPercent}
                        variant={variant}
                        className={classNameItem}
                    />
                ),
            )}
        </ul>
    );
}

export type ReviewsDistributionRatingsItemProps = {
    rating: number;
    ratingPercent: number;
    variant?: Variant;
} & React.ComponentProps<"li">;

export function ReviewsDistributionRatingsItem({
    rating,
    ratingPercent,
    className,
    variant = "default",
    ...props
}: ReviewsDistributionRatingsItemProps) {
    return (
        <li
            {...props}
            className={cn(
                variant === "default" && "space-y-1.5 text-sm",
                variant === "compact" &&
                    "flex items-center gap-2 text-[10px] leading-none",
                className,
            )}
        >
            <p className="flex items-center justify-between">
                <span>
                    <span
                        className={cn(variant === "compact" && "font-semibold")}
                    >
                        {rating}
                    </span>
                    <span className={cn(variant === "compact" && "hidden")}>
                        {" "}
                        star{rating > 1 ? "s" : ""}
                    </span>
                </span>
                <span className={cn(variant === "compact" && "hidden")}>
                    {ratingPercent}%
                </span>
            </p>
            <Progress
                value={ratingPercent}
                className={cn(
                    variant === "default" && "h-2",
                    variant === "compact" && "h-1",
                )}
                classNameIndicator="bg-yellow-400"
            />
        </li>
    );
}

export type ReviewsDistributionRatingsSkeletonProps = {
    variant?: Variant;
    length?: number;
    className?: string;
    classNameItem?: string;
    renderItem?: ((index: number) => React.ReactNode) | React.ReactNode;
} & React.ComponentProps<"div">;

export function ReviewsDistributionRatingsSkeleton({
    variant = "default",
    length = 5,
    className,
    classNameItem,
    renderItem,
    ...props
}: ReviewsDistributionRatingsSkeletonProps) {
    return (
        <div
            {...props}
            className={cn(
                variant === "default" && "space-y-3.5",
                variant === "compact" && "space-y-2",
                className,
            )}
        >
            {Array.from({ length }).map((_, index) =>
                renderItem !== undefined ? (
                    typeof renderItem === "function" ? (
                        renderItem(index)
                    ) : (
                        renderItem
                    )
                ) : (
                    <div
                        key={index}
                        className={cn(
                            variant === "default" && "flex flex-col gap-1.5",
                            variant === "compact" &&
                                "flex items-center gap-1.5",
                            classNameItem,
                        )}
                    >
                        <Skeleton
                            className={cn(
                                variant === "default" && "h-3.5 w-12",
                                variant === "compact" && "h-1.5 w-3",
                            )}
                        />
                        <Skeleton
                            className={cn(
                                "w-full",
                                variant === "default" && "h-3.5",
                                variant === "compact" && "h-1.5",
                            )}
                        />
                    </div>
                ),
            )}
        </div>
    );
}
