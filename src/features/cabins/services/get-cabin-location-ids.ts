import { supabase } from "@/services/supabase";

export async function getCabinLocationIds(location?: string) {
    if (!location) return [];

    const { data, error } = await supabase
        .from("locations")
        .select("id")
        .ilike("country", `%${location}%`);

    if (error) throw new Error(error.message);
    return data?.map(l => l.id) ?? [];
}
