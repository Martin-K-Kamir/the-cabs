import { Brand } from "@/lib/types";
import { Tables } from "@/services/supabase";

export type User = Omit<Tables<"guests">, "id"> & { id: UserId };
export type NewUser = Omit<User, "id" | "createdAt">;
export type UserId = Brand<Tables<"guests">["id"], "guestId">;
