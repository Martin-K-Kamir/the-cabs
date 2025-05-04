import { ReviewsList } from "@/features/reviews";
import { type CabinId } from "@/features/cabins/lib/types";
import { getCabinReviews } from "@/features/cabins/services";

export type CabinRecentReviewsProps = {
    cabinId: CabinId;
    className?: string;
    classNameItem?: string;
    limit?: number;
};

export async function CabinRecentReviews({
    cabinId,
    className,
    classNameItem,
    limit = 3,
}: CabinRecentReviewsProps) {
    const reviews = await getCabinReviews(cabinId, { limit });

    return (
        <ReviewsList
            data={reviews}
            className={className}
            classNameItem={classNameItem}
        />
    );
}
