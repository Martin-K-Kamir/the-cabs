import { supabase } from "@/services/supabase";
import type { User } from "@/features/user/lib/types";

export async function getUserByEmail(email: string): Promise<User | null> {
    const { data } = await supabase
        .from("guests")
        .select("*")
        .eq("email", email)
        .single();

    return data;
}
