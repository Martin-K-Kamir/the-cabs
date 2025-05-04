"use client";
import { createContext, useContext, useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ListPaginationContextValue = {
    currentIndex: number;
    length: number;
    limit: number;
    isAtFirst: boolean;
    isAtLast: boolean;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    handleNext: () => void;
    handlePrev: () => void;
    handleFirst: () => void;
    handleLast: () => void;
};

const ListPaginationContext = createContext<ListPaginationContextValue | null>(
    null,
);

const useListPagination = () => {
    const context = useContext(ListPaginationContext);
    if (!context) {
        throw new Error(
            "useListPagination must be used within a <ListPagination/>",
        );
    }
    return context;
};

export type ListPaginationProps = {
    length: number;
    limit?: number;
    defaultIndex?: number;
    currentIndex?: number;
    onIndexChange?: (index: number) => void;
} & React.ComponentProps<"div">;

export function ListPagination({
    length,
    limit = 6,
    defaultIndex = 0,
    currentIndex = defaultIndex,
    onIndexChange,
    children,
    className,
    ...props
}: ListPaginationProps) {
    const [_currentIndex, _setCurrentIndex] = useState(currentIndex);
    const totalChunks = Math.ceil(length / limit);

    const isNextDisabled = _currentIndex >= totalChunks - 1;
    const isPrevDisabled = _currentIndex <= 0;
    const isAtFirst = _currentIndex === 0;
    const isAtLast = _currentIndex === totalChunks - 1;

    const handleNext = () => {
        if (!isNextDisabled) {
            _setCurrentIndex(_currentIndex + 1);
            onIndexChange?.(_currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (!isPrevDisabled) {
            _setCurrentIndex(_currentIndex - 1);
            onIndexChange?.(_currentIndex - 1);
        }
    };

    const handleFirst = () => {
        _setCurrentIndex(0);
        onIndexChange?.(0);
    };

    const handleLast = () => {
        const lastIndex = totalChunks - 1;
        _setCurrentIndex(lastIndex);
        onIndexChange?.(lastIndex);
    };

    return (
        <ListPaginationContext.Provider
            value={{
                length,
                limit,
                isNextDisabled,
                isPrevDisabled,
                isAtFirst,
                isAtLast,
                currentIndex: _currentIndex,
                handleNext,
                handlePrev,
                handleFirst,
                handleLast,
            }}
        >
            <div {...props} className={className}>
                {children}
            </div>
        </ListPaginationContext.Provider>
    );
}

export type ListPaginationContentProps<TItem> = {
    items: TItem[];
    renderItem: (item: TItem, index: number) => React.ReactNode;
} & Omit<React.ComponentProps<"ul">, "children">;

export function ListPaginationContent<TItem>({
    items,
    renderItem,
    ...props
}: ListPaginationContentProps<TItem>) {
    const { currentIndex, limit } = useListPagination();

    return (
        <ul {...props}>
            {items
                .slice(currentIndex * limit, (currentIndex + 1) * limit)
                .map((item, index) => renderItem(item, index))}
        </ul>
    );
}

export function ListPaginationButton({
    variant = "outline",
    size = "icon",
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            {...props}
            variant={variant}
            size={size}
            className={cn("rounded-xl", className)}
        />
    );
}

export type ListPaginationButtonProps = React.ComponentProps<typeof Button> & {
    srOnlyText?: string;
};

export function ListPaginationFirstPageButton({
    srOnlyText = "Go to start of list",
    children,
    ...props
}: ListPaginationButtonProps) {
    const { handleFirst, isAtFirst } = useListPagination();

    return (
        <ListPaginationButton
            {...props}
            onClick={handleFirst}
            disabled={isAtFirst}
        >
            {children ?? (
                <>
                    <span className="sr-only">{srOnlyText}</span>
                    <ChevronsLeftIcon />
                </>
            )}
        </ListPaginationButton>
    );
}

export function ListPaginationLastPageButton({
    srOnlyText = "Go to end of list",
    children,
    ...props
}: ListPaginationButtonProps) {
    const { handleLast, isAtLast } = useListPagination();

    return (
        <ListPaginationButton
            {...props}
            onClick={handleLast}
            disabled={isAtLast}
        >
            {children ?? (
                <>
                    <span className="sr-only">{srOnlyText}</span>
                    <ChevronsRightIcon />
                </>
            )}
        </ListPaginationButton>
    );
}

export function ListPaginationNextPageButton({
    srOnlyText = "Go to next group of items",
    children,
    ...props
}: ListPaginationButtonProps) {
    const { handleNext, isNextDisabled } = useListPagination();

    return (
        <ListPaginationButton
            {...props}
            onClick={handleNext}
            disabled={isNextDisabled}
        >
            {children ?? (
                <>
                    <span className="sr-only">{srOnlyText}</span>
                    <ChevronRightIcon />
                </>
            )}
        </ListPaginationButton>
    );
}

export function ListPaginationPrevPageButton({
    srOnlyText = "Go to previous group of items",
    children,
    ...props
}: ListPaginationButtonProps) {
    const { handlePrev, isPrevDisabled } = useListPagination();

    return (
        <ListPaginationButton
            {...props}
            onClick={handlePrev}
            disabled={isPrevDisabled}
        >
            {children ?? (
                <>
                    <span className="sr-only">{srOnlyText}</span>
                    <ChevronLeftIcon />
                </>
            )}
        </ListPaginationButton>
    );
}

export function ListPaginationCounter({
    className,
    forceRender = false,
    ...props
}: React.ComponentProps<"p"> & {
    forceRender?: boolean;
}) {
    const { currentIndex, limit, length } = useListPagination();
    const totalChunks = Math.ceil(length / limit);

    if (length <= limit && !forceRender) {
        return null;
    }

    return (
        <p {...props} className={cn("text-sm text-zinc-300", className)}>
            View {currentIndex + 1} of {totalChunks}
        </p>
    );
}

export function ListPaginationButtons({
    className,
    forceRender = false,
    ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
    forceRender?: boolean;
}) {
    const { length, limit } = useListPagination();

    if (length <= limit && !forceRender) {
        return null;
    }

    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            <ListPaginationFirstPageButton />
            <ListPaginationPrevPageButton />
            <ListPaginationNextPageButton />
            <ListPaginationLastPageButton />
        </div>
    );
}
