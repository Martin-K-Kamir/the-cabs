import { ReviewsSummary, ReviewsSummaryProps } from "@/features/reviews";
import { type CabinId } from "@/features/cabins/lib/types";
import { getCabinReviews } from "@/features/cabins/services";

export type CabinReviewsSummaryProps = {
    cabinId: CabinId;
} & Omit<ReviewsSummaryProps, "data">;

export async function CabinReviewsSummary({
    cabinId,
    ...props
}: CabinReviewsSummaryProps) {
    const reviews = await getCabinReviews(cabinId);

    return <ReviewsSummary {...props} data={reviews} />;
}
