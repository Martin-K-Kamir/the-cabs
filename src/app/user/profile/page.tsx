import { UpdateUserForm } from "@/features/user/components/forms/update-user-form";
import { assertUserExists } from "@/lib/utils";
import { auth } from "@/services/auth";

export const metadata = {
    title: "Profile",
};

export default async function Page() {
    const session = await auth();
    assertUserExists(session);

    return (
        <article className="space-y-6 sm:space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl font-semibold">Update your profile</h1>
            </header>
            <UpdateUserForm
                defaultFormValues={{
                    name: session.user.name,
                    email: session.user.email,
                    phone: session.user.phone ?? "",
                    avatar: session.user.image ?? "",
                }}
            />
        </article>
    );
}
