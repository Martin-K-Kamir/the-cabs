import { supabase } from "@/services/supabase";
import { type CabinId } from "@/features/cabins/lib/types";

export async function getAllCabinsRatings() {
    const { data, error } = await supabase
        .from("reviews")
        .select("rating, cabinId");

    if (error) {
        throw new Error(error.message);
    }

    return data as { rating: number; cabinId: CabinId }[];
}
