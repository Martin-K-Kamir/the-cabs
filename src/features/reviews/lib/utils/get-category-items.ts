import { type RatingCategoryItem } from "@/features/reviews/lib/types";

export function getCategoryItems(
    data: { categoryRatings: RatingCategoryItem[] }[],
) {
    return data.reduce((acc, review) => {
        acc.push(review.categoryRatings);
        return acc;
    }, [] as RatingCategoryItem[][]);
}
