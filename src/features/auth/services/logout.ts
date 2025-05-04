"use server";
import { signOut } from "@/services/auth";

export async function logout() {
    await signOut({
        redirectTo: "/",
    });
}
