"use client";
import { ReactNode } from "react";
import {
    QueryClientProvider,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            <HydrationBoundary>{children}</HydrationBoundary>
        </QueryClientProvider>
    );
}
