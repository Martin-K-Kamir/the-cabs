"use server";

import { auth } from "@/services/auth";
import { updateUserSchema } from "@/features/user/lib/schemas";
import { UploadableMapper } from "@/lib/utils";
import { supabase } from "@/services/supabase";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("You must be logged in to update your profile.");
    }

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone") ?? undefined,
        avatar: formData.getAll("avatar").filter(Boolean) as File[],
    };

    const result = updateUserSchema.safeParse(data);

    if (!result.success) {
        throw new Error("Invalid data provided.");
    }

    const { name, email, phone, avatar } = result.data;
    const isAvatar = avatar && avatar.length > 0;
    let mapper: UploadableMapper | undefined;

    if (isAvatar && avatar) {
        mapper = new UploadableMapper(
            avatar,
            process.env.URL_TO_UPLOAD_AVATARS,
        );
    }

    const { error } = await supabase
        .from("guests")
        .update({
            ...(name && { name }),
            ...(email && { email }),
            ...(phone && { phone }),
            ...(isAvatar && mapper && { avatar: mapper.getUrlPaths()[0] }),
            ...(!isAvatar && { avatar: "" }),
        })
        .eq("id", session.user.id);

    if (error) {
        throw new Error("Failed to update user profile.");
    }

    if (!isAvatar) {
        return;
    }

    if (mapper && mapper.getFilesToUpload().length > 0) {
        const { name, file } = mapper.getFilesToUpload()[0];

        const { error } = await supabase.storage
            .from("avatars")
            .upload(name, file);

        if (error) {
            throw error;
        }
    }

    revalidatePath("/user/profile");
}
