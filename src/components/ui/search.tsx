"use client";
import { useEffect, useState, createContext, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import type { EventFor } from "@/lib/types";
import { cn, debounce, focusTempElement } from "@/lib/utils";

type SearchContextValue = {
    isCompact: boolean;
    isScrolling: boolean;
    showOverlay: boolean;
    setIsCompact: React.Dispatch<React.SetStateAction<boolean>>;
    setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchContext = createContext<SearchContextValue | null>(null);

function useSearch() {
    const context = useContext(SearchContext);

    if (!context) {
        throw new Error("useSearch must be used within a <Search/>");
    }

    return context;
}

export function Search({
    children,
    className,
    ...props
}: React.ComponentProps<"search">) {
    const [isCompact, setIsCompact] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const handleScroll = debounce(() => {
            if (window.scrollY > 0) {
                setIsCompact(true);
                setIsScrolling(true);
                setShowOverlay(false);
            } else {
                setIsCompact(false);
                setIsScrolling(false);
            }
        }, 5);

        window.addEventListener("scroll", handleScroll, {
            passive: true,
            signal: controller.signal,
        });

        return () => {
            controller.abort();
        };
    }, []);

    function handleFocusOut() {
        if (window.scrollY > 0) {
            setIsCompact(true);
            setShowOverlay(false);
        }
    }

    return (
        <SearchContext.Provider
            value={{
                isCompact,
                showOverlay,
                isScrolling,
                setIsCompact,
                setShowOverlay,
            }}
        >
            <search
                {...props}
                ref={containerRef}
                role="search"
                aria-label="Search filter"
                className={cn(
                    "group/search relative flex h-16 max-h-16 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_0_33px_-12px_#ffffff12] transition-all duration-200 data-[variant=compact]:h-12 [&>*:first-child]:border-none [&>*:not(:last-child)]:border-l [&>*]:border-zinc-800",
                    className,
                )}
                data-slot="search"
                data-variant={isCompact ? "compact" : "default"}
                onFocus={() => {
                    if (blurTimeoutRef.current) {
                        clearTimeout(blurTimeoutRef.current);
                    }
                }}
                onBlur={() => {
                    blurTimeoutRef.current = setTimeout(() => {
                        const container = containerRef.current;
                        if (
                            container &&
                            !container.contains(document.activeElement)
                        ) {
                            handleFocusOut();
                        }
                    }, 10);
                }}
            >
                {children}
            </search>
        </SearchContext.Provider>
    );
}

export function SearchOverlay({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
    open?: boolean;
}) {
    const { showOverlay, setShowOverlay, setIsCompact } = useSearch();
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (!showOverlay) {
            setContainer(null);
            return;
        }

        const element = document.createElement("div");
        element.setAttribute("data-portal", "search-overlay");
        document.body.appendChild(element);
        setContainer(element);

        return () => {
            document.body.removeChild(element);
        };
    }, [showOverlay]);

    useEffect(() => {
        const controller = new AbortController();

        window.addEventListener(
            "keydown",
            e => {
                if (e.key === "Escape") {
                    setShowOverlay(false);
                    setIsCompact(true);
                }
            },
            {
                signal: controller.signal,
            },
        );

        return () => {
            controller.abort();
        };
    }, []);

    if (!container) return null;

    return createPortal(
        <div
            {...props}
            data-slot="search-overlay"
            className={cn(
                "fixed inset-0 z-10 bg-zinc-950/60 transition-opacity duration-200",
                className,
            )}
            onClick={() => {
                setShowOverlay(false);
                setIsCompact(true);
            }}
        />,
        container,
    );
}

export function SearchButton({
    children,
    className,
    size = "lg",
    onClick,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { setShowOverlay, setIsCompact } = useSearch();

    return (
        <div className="peer-has-data-[state=open]:bg-zinc-800/70 flex h-full items-center peer-focus-visible:bg-zinc-800/70 peer-has-[button[data-slot='popover-trigger']:focus-visible]:bg-zinc-800/70 peer-has-[button[data-slot='popover-trigger']:hover]:bg-zinc-800/70">
            <Button
                {...props}
                size={size}
                className={cn(
                    "mr-3 size-10 self-center !p-0 transition-all group-data-[variant=compact]/search:mr-2 group-data-[variant=compact]/search:size-8",
                    className,
                )}
                onClick={e => {
                    onClick?.(e);
                    setShowOverlay(false);
                    setIsCompact(window.scrollY > 0);
                }}
            >
                {children ?? <SearchIcon className="size-1/2" />}
            </Button>
        </div>
    );
}

type SearchFieldContextValue = {
    resetRef?: React.RefObject<HTMLButtonElement>;
};

const SearchFieldContext = createContext<SearchFieldContextValue | null>(null);

export function useSearchField() {
    const context = useContext(SearchFieldContext);

    if (!context) {
        throw new Error("useSearchField must be used within a <SearchField/>");
    }

    return context;
}

export function SearchField({
    children,
    ...props
}: React.ComponentProps<typeof Popover>) {
    const resetRef = useRef<HTMLButtonElement>(null);

    return (
        <SearchFieldContext.Provider
            value={{ resetRef: resetRef as React.RefObject<HTMLButtonElement> }}
        >
            <Popover {...props}>{children}</Popover>
        </SearchFieldContext.Provider>
    );
}

export function SearchFieldTrigger({
    className,
    ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
    return (
        <PopoverTrigger
            {...props}
            className={cn(
                "group-data-[variant=compact]/search:min-w-25 peer flex h-full min-w-52 cursor-pointer flex-col items-start justify-center px-6 outline-none transition-[min-width] duration-200 focus-within:bg-zinc-800/70 hover:bg-zinc-800/70 focus-visible:bg-zinc-800/70 data-[state=open]:bg-zinc-800/70",
                className,
            )}
        />
    );
}

export function SearchFieldLabel({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            {...props}
            className={cn(
                "max-h-[16.5px] text-xs font-semibold leading-snug text-zinc-400 transition-[opacity,max-height] duration-200 group-data-[variant=compact]/search:max-h-0 group-data-[variant=compact]/search:opacity-0",
                className,
            )}
        />
    );
}

export function SearchFieldValue({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            {...props}
            className={cn("text-nowrap text-sm text-zinc-50", className)}
        />
    );
}

export function SearchFieldReset({
    className,
    children,
    variant = "ghost",
    size = "icon",
    ...props
}: React.ComponentProps<typeof Button>) {
    const { resetRef } = useSearchField();

    return (
        <Button
            {...props}
            ref={resetRef}
            variant={variant}
            size={size}
            className={cn(
                "absolute right-2 -z-50 size-6 opacity-0 hover:z-50 hover:border-zinc-950/80 hover:bg-zinc-950/80 hover:opacity-100 focus-visible:z-50 focus-visible:opacity-100 peer-focus-within:z-50 peer-focus-within:opacity-100 peer-hover:z-50 peer-hover:opacity-100 peer-focus-visible:z-50 peer-focus-visible:opacity-100 group-data-[variant=compact]/search:!-z-50 group-data-[variant=compact]/search:!opacity-0 peer-data-[state=open]:z-50 peer-data-[state=open]:opacity-100",
                className,
            )}
        >
            {children ?? <XIcon className="size-3.5" />}
        </Button>
    );
}

export function SearchFieldContent({
    children,
    className,
    sideOffset = 10,
    onInteractOutside,
    ...props
}: React.ComponentProps<typeof PopoverContent>) {
    const { resetRef } = useSearchField();

    return (
        <PopoverContent
            {...props}
            sideOffset={sideOffset}
            className={cn("w-auto rounded-2xl", className)}
            onInteractOutside={e => {
                onInteractOutside?.(e);

                if (e.target === resetRef?.current) {
                    e.preventDefault();
                }
            }}
        >
            {children}
        </PopoverContent>
    );
}

export type SimpleSearchFieldProps = {
    label: string;
    value: string;
    className?: string;
    classNameTrigger?: string;
    classNameReset?: string;
    classNameLabel?: string;
    classNameValue?: string;
    classNameContent?: string;
    showReset?: boolean;
    contentProps?: Omit<
        React.ComponentProps<typeof PopoverContent>,
        "className"
    >;
    children: React.ReactNode;
    onReset?: (e: EventFor<"button", "onClick">) => void;
} & React.ComponentProps<typeof SearchField>;

export function SimpleSearchField({
    label,
    value,
    className,
    classNameLabel,
    classNameReset,
    classNameTrigger,
    classNameValue,
    classNameContent,
    contentProps,
    children,
    showReset = true,
    onReset,
    onOpenChange,
    ...props
}: SimpleSearchFieldProps) {
    const { isCompact, isScrolling, setIsCompact, setShowOverlay } =
        useSearch();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isCompact) {
            setIsOpen(false);
            focusTempElement();
        }
    }, [isCompact]);

    return (
        <SearchField
            open={isOpen}
            onOpenChange={open => {
                setIsOpen(open);
                onOpenChange?.(open);

                if (open) {
                    setIsCompact(false);
                }

                if (open && isScrolling) {
                    setShowOverlay(true);
                }
            }}
            {...props}
        >
            <div className={cn("relative grid items-center", className)}>
                <SearchFieldTrigger className={classNameTrigger}>
                    <SearchFieldLabel className={classNameLabel}>
                        {label}
                    </SearchFieldLabel>
                    <SearchFieldValue className={classNameValue}>
                        {value}
                    </SearchFieldValue>
                </SearchFieldTrigger>
                {showReset && !isCompact && (
                    <SearchFieldReset
                        className={classNameReset}
                        onClick={onReset}
                    />
                )}
            </div>
            <SearchFieldContent {...contentProps} className={classNameContent}>
                {children}
            </SearchFieldContent>
        </SearchField>
    );
}
