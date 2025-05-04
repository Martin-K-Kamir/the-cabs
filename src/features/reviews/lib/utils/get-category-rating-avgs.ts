import { type RatingCategoryItem } from "@/features/reviews/lib/types";

export function getCategoryRatingAvgs(data: RatingCategoryItem[][]) {
    const sums = new Map<
        string,
        { total: number; count: number; name: string }
    >();

    for (let i = 0; i < data.length; i++) {
        const group = data[i];
        for (let j = 0; j < group.length; j++) {
            const { id, name, rating } = group[j];
            const existing = sums.get(id);
            if (existing) {
                existing.total += rating;
                existing.count += 1;
            } else {
                sums.set(id, { total: rating, count: 1, name });
            }
        }
    }

    const result: RatingCategoryItem[] = [];

    sums.forEach(({ total, count, name }, id) => {
        result.push({
            id,
            name,
            rating: total / count,
        });
    });

    return result;
}
