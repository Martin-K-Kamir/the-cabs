"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDropBox,
    FormDropInput,
    FormField,
    FormImageUploadPreview,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/features/user/services/update-user";
import { updateUserSchema } from "@/features/user/lib/schemas";
import { toastPromise } from "@/lib/utils/core/toast-promise";

type UpdateUserFormProps = {
    defaultFormValues?: Partial<{
        name: string;
        email: string;
        phone: string;
        avatar: File | string;
    }>;
    onUpdate?: (data: z.infer<typeof updateUserSchema>) => void;
    onUpdateSuccess?: () => void;
    onUpdateError?: (error: Error) => void;
};

export function UpdateUserForm({
    defaultFormValues,
    onUpdate,
    onUpdateError,
    onUpdateSuccess,
}: UpdateUserFormProps) {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: defaultFormValues?.name ?? "",
            email: defaultFormValues?.email ?? "",
            phone: defaultFormValues?.phone ?? "",
            avatar: [],
        },
    });

    async function handleSubmit(values: z.infer<typeof updateUserSchema>) {
        setIsFormSubmitting(true);
        onUpdate?.(values);
        const {
            promise: updatePromise,
            reject: rejectPromise,
            resolve: resolvePromist,
        } = Promise.withResolvers();

        toastPromise({
            promise: updatePromise,
            messages: [
                "Updating your profile...",
                "Your profile has been updated.",
                "Something went wrong. Please try again.",
            ],
        });

        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("email", values.email);

        if (values.phone) {
            formData.append("phone", values.phone);
        }

        if (values.avatar && values.avatar.length > 0) {
            formData.append("avatar", values.avatar[0]);
        }

        try {
            await updateUser(formData);
            resolvePromist(true);
            onUpdateSuccess?.();
        } catch (err) {
            rejectPromise(err);
            onUpdateError?.(
                err instanceof Error
                    ? err
                    : new Error("Something went wrong. Please try again."),
            );

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";

            form.setError("root", {
                type: "server",
                message,
            });
        } finally {
            setIsFormSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 sm:space-y-8"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email address"
                                    disabled
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your phone number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormDropBox
                                single
                                className="grid place-items-center gap-2 text-balance text-center font-normal"
                            >
                                <ImageUpIcon className="size-4.5 text-current" />
                                Drop your avatar image here or click to upload
                            </FormDropBox>
                            <FormControl>
                                <FormDropInput
                                    accept="image/jpeg, image/jpg, image/webp"
                                    size={1_048_576}
                                    {...field}
                                />
                            </FormControl>
                            <FormImageUploadPreview
                                lazy={false}
                                className="grid grid-cols-[repeat(auto-fill,minmax(min(6rem,100%),1fr))] items-start gap-2"
                                classNameImage="aspect-square"
                                value={defaultFormValues?.avatar}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.formState.errors.root && (
                    <FormMessage>
                        {form.formState.errors.root.message}{" "}
                    </FormMessage>
                )}

                <Button type="submit" size="lg" disabled={isFormSubmitting}>
                    {isFormSubmitting ? "Updating..." : "Update profile"}
                </Button>
            </form>
        </Form>
    );
}
