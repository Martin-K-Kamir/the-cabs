export function sortReviews<
    TItem extends { createdAt: Date | string; rating: number },
>(data: TItem[], sortBy: "most-recent" | "highest-rated" | "lowest-rated") {
    return [...data].sort((a, b) => {
        const dateSort =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        if (sortBy === "most-recent") {
            return dateSort;
        }

        const ratingSort = b.rating - a.rating;

        if (sortBy === "highest-rated") {
            return ratingSort || dateSort;
        }

        if (sortBy === "lowest-rated") {
            return -ratingSort || dateSort;
        }

        return 0;
    });
}
