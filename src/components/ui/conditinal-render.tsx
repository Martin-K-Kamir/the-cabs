"use client";
import React from "react";
import { useMediaQuery } from "usehooks-ts";

const DEFAULT_OPTIONS = {
    defaultValue: true,
    initializeWithValue: false,
};

type ConditinalRenderProps = {
    query: string;
    options?: {
        defaultValue?: boolean;
        initializeWithValue?: boolean;
    };
    children: React.ReactNode;
};

export function ConditinalRender({
    children,
    query,
    options = DEFAULT_OPTIONS,
}: ConditinalRenderProps) {
    const isTrue = useMediaQuery(query, options);

    if (!isTrue) {
        return null;
    }

    return <>{children}</>;
}
