import { type Session } from "next-auth";

export function assertUserExists(
    session: Session | null,
    errorMessage: string = "You must be logged in to view this page. Please log in and try again.",
): asserts session is Session {
    if (!session?.user) {
        const error = new Error(errorMessage);
        error.name = "Authentication";
        throw error;
    }
}
