"use client";
import { Slot } from "@radix-ui/react-slot";
import { createContext, useContext, useEffect, useState } from "react";

type ExpandableTextContextValue = {
    length: number;
    isExpanded: boolean;
    canExpand: boolean;
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    setCanExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

const ExpandableTextContext = createContext<ExpandableTextContextValue | null>(
    null,
);

function useExpandableText() {
    const context = useContext(ExpandableTextContext);

    if (!context) {
        throw new Error(
            "useExpandableText should be used within <ExpandableText/>",
        );
    }

    return context;
}

export type ExpandableTextProps = {
    children: React.ReactNode;
    length?: number;
    isExpanded?: boolean;
    asChild?: boolean;
} & Omit<React.ComponentProps<"p">, "children">;

export function ExpandableText({
    asChild,
    children,
    length = 100,
    ...props
}: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(props?.isExpanded ?? false);
    const [canExpand, setCanExpand] = useState(false);
    const Comp = asChild ? Slot : "p";

    return (
        <Comp {...props}>
            <ExpandableTextContext.Provider
                value={{
                    length,
                    isExpanded,
                    canExpand,
                    setCanExpand,
                    setIsExpanded,
                }}
            >
                {children}
            </ExpandableTextContext.Provider>
        </Comp>
    );
}

export function ExpandableTextContent({
    children,
    ellipsis = "...",
}: {
    children: string;
    ellipsis?: string;
}) {
    const { length, isExpanded, setCanExpand } = useExpandableText();

    useEffect(() => {
        if (children.length > length) {
            setCanExpand(true);
        }
    }, [children, length, setCanExpand]);

    return (
        <>
            {isExpanded || children.length <= length
                ? children
                : `${children.slice(0, length)}${ellipsis}`}
        </>
    );
}

export function ExpandableTextTrigger({
    asChild,
    children,
    ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
    asChild?: boolean;
    children?: React.ReactNode | ((isExtended: boolean) => React.ReactNode);
}) {
    const { isExpanded, setIsExpanded, canExpand } = useExpandableText();
    const Comp = asChild ? Slot : "span";

    if (!canExpand) {
        return null;
    }

    return (
        <Comp
            {...props}
            onClick={e => {
                setIsExpanded(prev => !prev);
                props?.onClick?.(e);
            }}
        >
            {typeof children === "function"
                ? children(isExpanded)
                : (children ?? (
                      <span className="cursor-pointer text-nowrap text-zinc-200 underline hover:no-underline">
                          {isExpanded ? "Read less" : "Read more"}
                      </span>
                  ))}
        </Comp>
    );
}
