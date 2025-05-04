import { notFound } from "next/navigation";
import { supabase } from "@/services/supabase";
import {
    type CabinLocation,
    type CabinId,
    type CabinItem,
} from "@/features/cabins";

export async function getCabinById(
    cabinId: CabinId,
): Promise<CabinItem & { location: CabinLocation }> {
    const { data, error } = await supabase
        .from("cabins")
        .select("*, locations(*)")
        .eq("id", cabinId)
        .single();

    if (error) {
        console.error("Error fetching cabin by ID:", {
            cabinId,
            error: error.message,
        });

        notFound();
    }

    const { locations, ...cabin } = data;

    return {
        ...cabin,
        location: locations,
    };
}
