import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: process.env.SUPABASE_DOMAIN,
                port: "",
                pathname: "/storage/v1/object/public/cabin-images/**",
            },
        ],
    },
    // output: "export",
};

export default nextConfig;
