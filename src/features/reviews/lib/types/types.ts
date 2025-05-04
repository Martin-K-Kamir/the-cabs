export type RatingCategoryItem = {
    id: string;
    name: string;
    rating: number;
};

export type RatingDistributionItem = {
    rating: number;
    ratingPercent: number;
};

export type ReviewItem = {
    id: number;
    rating: number;
    categoryRatings: RatingCategoryItem[];
    guestName: string;
    guestAvatar: string;
    createdAt: Date | string;
    title: string;
    description: string;
};
