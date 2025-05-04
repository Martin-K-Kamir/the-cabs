import { type CabinId } from "@/features/cabins/lib/types";
import { getCabinReviews } from "@/features/cabins/services";
import { ReviewsOverview, type ReviewsOverviewProps } from "@/features/reviews";

export type CabinReviewsOverviewProps = {
    cabinId: CabinId;
} & Omit<ReviewsOverviewProps, "data">;

export async function CabinReviewsOverview({
    cabinId,
    ...props
}: CabinReviewsOverviewProps) {
    const reviews = await getCabinReviews(cabinId);

    return <ReviewsOverview {...props} data={reviews} />;
}
