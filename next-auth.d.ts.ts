import { type UserId } from "@/features/user";
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: UserId;
            name: string;
            email: string;
            phone?: string;
            image?: string;
        };
    }

    interface User {
        id: UserId;
        phone?: string;
    }
}
