import { type CabinId, CabinReviewItem } from "@/features/cabins/lib/types";
import { supabase } from "@/services/supabase";

type Options = Partial<{
    limit: number;
}>;

export async function getCabinReviews(
    cabinId: CabinId,
    options?: Options,
): Promise<CabinReviewItem[]> {
    let query = supabase
        .from("reviews")
        .select("*, guests(name, avatar)")
        .eq("cabinId", cabinId)
        .order("createdAt", { ascending: false });

    if (options?.limit && Number.isFinite(options?.limit)) {
        query = query.limit(options.limit!);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map(review => ({
        ...review,
        guestName: review.guests.name,
        guestAvatar: review.guests.avatar,
    }));
}
