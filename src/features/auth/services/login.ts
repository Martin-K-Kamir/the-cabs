"use server";
import { signIn } from "@/services/auth";

export async function login(formData?: FormData) {
    const redirectTo = formData?.get("redirectTo");
    const redirect = formData?.get("redirect");

    await signIn("google", {
        redirectTo: redirectTo ? String(redirectTo) : undefined,
        redirect: redirect ? Boolean(String(redirect)) : undefined,
    });
}
