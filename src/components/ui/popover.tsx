"use client";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TextableBlock } from "./textable-block";
import { XIcon } from "lucide-react";
import { useRef } from "react";

export function Popover({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export function PopoverTrigger({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverContent({
    className,
    align = "center",
    sideOffset = 4,
    inPortal = true,
    container,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
    container?: Element | DocumentFragment | null;
    inPortal?: boolean;
}) {
    const Portal = inPortal ? PopoverPrimitive.Portal : React.Fragment;

    return (
        <Portal {...(inPortal ? { container } : {})}>
            <PopoverPrimitive.Content
                data-slot="popover-content"
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin) outline-hidden pointer-events-auto z-[150] w-72 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-50 shadow-md",
                    className,
                )}
                {...props}
            />
        </Portal>
    );
}

export function PopoverCloseButton({
    children,
    className,
    size = "icon",
    variant = "ghost",
    asChild = false,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close> & {
    size?: React.ComponentProps<typeof Button>["size"];
    variant?: React.ComponentProps<typeof Button>["variant"];
}) {
    return (
        <PopoverPrimitive.Close data-slot="popover-close" asChild {...props}>
            <Button
                type="button"
                variant={variant}
                size={size}
                className={className}
                asChild={asChild}
            >
                {children ?? <XIcon />}
            </Button>
        </PopoverPrimitive.Close>
    );
}

export function PopoverAnchor({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export type SimplePopoverBlockProps = {
    label: string;
    value: string;
    icon?: React.ReactNode;
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
    onReset?: () => void;
} & React.ComponentProps<typeof Popover>;

export function SimplePopoverBlock({
    label,
    value,
    icon,
    className,
    classNameTrigger,
    classNameReset,
    classNameLabel,
    classNameValue,
    classNameContent,
    showReset = true,
    contentProps,
    children,
    onReset,
    ...props
}: SimplePopoverBlockProps) {
    const resetRef = useRef<HTMLButtonElement>(null);

    return (
        <Popover {...props}>
            <div className={cn("relative grid items-center", className)}>
                <PopoverTrigger asChild>
                    <Button
                        size="full"
                        variant="outline"
                        className={cn("justify-start", classNameTrigger)}
                    >
                        <TextableBlock
                            title={label}
                            description={value}
                            icon={icon}
                            classNameTitle={classNameLabel}
                            classNameDescription={classNameValue}
                        />
                    </Button>
                </PopoverTrigger>
                <Button
                    ref={resetRef}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute right-4",
                        !showReset && "hidden",
                        classNameReset,
                    )}
                    onClick={e => {
                        e.stopPropagation();
                        onReset?.();
                    }}
                >
                    <XIcon />
                </Button>
            </div>
            <PopoverContent
                {...contentProps}
                onInteractOutside={e => {
                    contentProps?.onInteractOutside?.(e);

                    if (e.target === resetRef.current) {
                        e.preventDefault();
                    }
                }}
                className={classNameContent}
            >
                <PopoverCloseButton className="absolute right-2 top-2" />
                {children}
            </PopoverContent>
        </Popover>
    );
}
