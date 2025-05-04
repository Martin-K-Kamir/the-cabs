import { z } from "zod";

export const updateUserSchema = z
    .object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        phone: z
            .string()
            .trim()
            .optional()
            .refine(val => !val || /^\+?[0-9\s\-()]{6,15}$/.test(val), {
                message:
                    "Phone number must be valid and can include digits, spaces, dashes, parentheses, and an optional '+'",
            }),
        avatar: z
            .array(
                z
                    .instanceof(File)
                    .refine(
                        file => file.size < 1_048_576,
                        "Image size must be less than 1MB.",
                    )
                    .refine(file => {
                        return [
                            "image/jpeg",
                            "image/jpg",
                            "image/png",
                            "image/webp",
                        ].includes(file.type);
                    }, "File must be a jpeg, jpg, or webp image."),
            )
            .optional(),
    })
    .refine(data => data.avatar && data.avatar.length <= 1, {
        message: "Only one image is allowed.",
        path: ["avatar"],
    });
