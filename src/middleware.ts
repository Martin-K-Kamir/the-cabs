import { auth } from "./services/auth";

export const middleware = auth;

export const config = {
    matcher: ["/user/:path*"],
};
