import { type RatingDistributionItem } from "@/features/reviews/lib/types";

export function getRatingsDistribution<TItem extends { rating: number }>(
    data: TItem[],
    hideEmpty: boolean = false,
) {
    const total = data.length;
    const counts = new Map<number, number>();
    let maxRating = 0;

    for (let i = 0; i < data.length; i++) {
        const rounded = Math.round(data[i].rating);
        maxRating = Math.max(maxRating, rounded);
        counts.set(rounded, (counts.get(rounded) || 0) + 1);
    }

    const result: RatingDistributionItem[] = [];

    for (let rating = maxRating; rating >= 1; rating--) {
        const count = counts.get(rating) || 0;
        const ratingPercent = total > 0 ? Math.round((count / total) * 100) : 0;

        if (!hideEmpty || count > 0) {
            result.push({ rating, ratingPercent });
        }
    }

    return result;
}
