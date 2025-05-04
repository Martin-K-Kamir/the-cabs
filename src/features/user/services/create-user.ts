import { supabase } from "@/services/supabase";
import { type NewUser } from "@/features/user/lib/types";

export async function createUser(newUser: NewUser) {
    const { data, error } = await supabase.from("guests").insert([newUser]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
