import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { createUser } from "@/features/user/services/create-user";
import { getUserByEmail } from "@/features/user/services/get-user-by-email";
import { UserId } from "@/features/user";

export const {
    auth,
    handlers: { GET, POST },
    signIn,
    signOut,
} = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_AUTH_ID,
            clientSecret: process.env.GOOGLE_AUTH_SECRET,
        }),
    ],
    callbacks: {
        authorized({ auth }) {
            return !!auth?.user;
        },
        redirect({ url, baseUrl }) {
            if (url.includes("/auth/login")) return baseUrl;
            return url;
        },
        async signIn({ user }) {
            try {
                if (user.email == null || user.name == null) {
                    return false;
                }

                const existingUser = await getUserByEmail(user.email ?? "");

                if (!existingUser) {
                    await createUser({
                        email: user.email,
                        name: user.name,
                        avatar: user.image ?? null,
                        phone: null,
                    });
                }

                return true;
            } catch {
                return false;
            }
        },
        async session({ session }) {
            const existingUser = await getUserByEmail(
                session.user?.email ?? "",
            );

            if (existingUser) {
                // @ts-expect-error when using next-auth with typescript, the user object is typed to never
                session.user.id = existingUser.id as unknown as UserId;
                session.user.name = existingUser.name ?? session.user.name;
                session.user.email = existingUser.email ?? session.user.email;
                session.user.phone = existingUser.phone ?? "";
                session.user.image = existingUser.avatar ?? session.user.image;
            }

            return session;
        },
    },
    pages: {
        signIn: "/",
    },
});
