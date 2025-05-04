import { supabase } from "@/services/supabase";
import { CabinId } from "@/features/cabins";

export async function getAllCabinsIds() {
    const { data, error } = await supabase.from("cabins").select("id");

    if (error) {
        throw new Error(error.message);
    }

    return data as { id: CabinId }[];
}
