import { Url } from "@/lib/types";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASE_DOMAIN: string;
            SUPABASE_URL: string;
            SUPABASE_KEY: string;
            NEXTAUTH_URL: string;
            NEXTAUTH_SECRET: string;
            GOOGLE_MAPS_KEY: string;
            GOOGLE_AUTH_ID: string;
            GOOGLE_AUTH_SECRET: string;
            URL_TO_UPLOAD_AVATARS: Url;
        }
    }
}

export {};
