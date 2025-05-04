import { cn } from "@/lib/utils";
import {
    EggFriedIcon,
    KeyRoundIcon,
    MapPinIcon,
    MessageCircleIcon,
    SparklesIcon,
    StarIcon,
    TagIcon,
} from "lucide-react";
import { getCategoryRatingAvgs } from "@/features/reviews/lib/utils";
import { type RatingCategoryItem } from "@/features/reviews/lib/types";

const MAP_OF_ICONS = {
    breakfast: <EggFriedIcon />,
    location: <MapPinIcon />,
    "check-in": <KeyRoundIcon />,
    communication: <MessageCircleIcon />,
    cleanliness: <SparklesIcon />,
    accuracy: <TagIcon />,
    value: <TagIcon />,
    default: <StarIcon />,
} as const;

export type ReviewsCategoryRatingsProps<TItem extends RatingCategoryItem> = {
    data: TItem[][];
    classNameItem?: string;
    renderItem?:
        | ((
              item: TItem & { icon: React.ReactNode },
              index: number,
          ) => React.ReactNode)
        | React.ReactNode;
} & React.ComponentProps<"ul">;

export function ReviewsCategoryRatings<TItem extends RatingCategoryItem>({
    className,
    classNameItem,
    data,
    renderItem,
    ...props
}: ReviewsCategoryRatingsProps<TItem>) {
    const items = getCategoryRatingAvgs(data);

    return (
        <ul
            {...props}
            className={cn("flex flex-wrap items-center gap-3", className)}
        >
            {items.map((item, index) => {
                const icon =
                    MAP_OF_ICONS[item.id as keyof typeof MAP_OF_ICONS] ??
                    MAP_OF_ICONS.default;

                return renderItem ? (
                    typeof renderItem === "function" ? (
                        renderItem(
                            { ...item, icon } as TItem & {
                                icon: React.ReactNode;
                            },
                            index,
                        )
                    ) : (
                        renderItem
                    )
                ) : (
                    <ReviewsCategoryRatingsItem
                        key={item.id}
                        value={item.rating}
                        label={item.name}
                        icon={icon}
                        className={classNameItem}
                    />
                );
            })}
        </ul>
    );
}

export type ReviewsCategoryRatingsItemProps = {
    value: number;
    label: string;
    icon: React.ReactNode;
} & React.ComponentProps<"li">;

export function ReviewsCategoryRatingsItem({
    value,
    label,
    icon,
    className,
    ...props
}: ReviewsCategoryRatingsItemProps) {
    return (
        <li
            {...props}
            className={cn(
                "flex items-center justify-between gap-2 rounded-xl bg-zinc-800 px-2.5 py-1.5 text-sm text-white [&_svg]:size-4 [&_svg]:text-zinc-100",
                className,
            )}
        >
            {icon}
            <span className="text-nowrap">{label}</span>
            <span className="font-semibold">{value.toFixed(1)}</span>
        </li>
    );
}
