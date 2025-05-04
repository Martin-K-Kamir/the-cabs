"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef } from "react";

function Dialog({
    openOnSearchParams,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & {
    openOnSearchParams?: string;
}) {
    const disableAutoFocus = useRef(true);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const defaultOpen =
        searchParams.get(`dialog-${openOnSearchParams}`) === "open";

    return (
        <DialogPrimitive.Root
            data-slot="dialog"
            defaultOpen={defaultOpen}
            onOpenChange={open => {
                if (!openOnSearchParams) return;

                const dialogParam = `dialog-${openOnSearchParams}`;
                const params = new URLSearchParams(searchParams);

                if (open) {
                    params.set(dialogParam, "open");
                } else {
                    params.delete(dialogParam);

                    if (disableAutoFocus.current) {
                        params.set("dialog-auto-focus", "false");
                        const newUrl = `${window.location.pathname}?${params.toString()}`;
                        window.history.replaceState(null, "", newUrl);
                    }
                }

                window.history.replaceState(null, "", `${pathname}?${params}`);
                disableAutoFocus.current = false;
            }}
            {...props}
        />
    );
}

function DialogBaseContent({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
    const searchParams = useSearchParams();

    return (
        <DialogPrimitive.Content
            onCloseAutoFocus={e => {
                const params = new URLSearchParams(searchParams);

                if (params.get("dialog-auto-focus") === "false") {
                    e.preventDefault();
                    params.delete("dialog-auto-focus");
                    const newUrl = `${window.location.pathname}?${params.toString()}`;
                    window.history.replaceState(null, "", newUrl);
                }
            }}
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 grid w-[calc(100%-2rem)] max-w-lg gap-4 rounded-xl border border-zinc-900 bg-zinc-950 shadow-lg outline-none ring-zinc-700 duration-200 focus-visible:ring-2",
                className,
            )}
            data-slot="dialog-content"
            {...props}
        />
    );
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 grid max-h-svh place-items-center overflow-y-auto bg-black/80 py-6 lg:py-8",
                className,
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    classNameOverlay,
    showClose = true,
    showStickyClose = false,
    children,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    classNameOverlay?: string;
    showClose?: boolean;
    showStickyClose?: boolean;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay className={classNameOverlay}>
                <DialogBaseContent
                    className={cn(
                        !showStickyClose && "p-4 lg:p-6",
                        showStickyClose && "px-4 pb-4 lg:px-6 lg:pb-6",
                        className,
                    )}
                    {...props}
                >
                    {showClose && !showStickyClose && (
                        <DialogCloseButton className="absolute right-4 top-4" />
                    )}

                    {showStickyClose && (
                        <div className="sticky -top-6 z-10 -mx-3 flex justify-end bg-zinc-950 py-3.5">
                            <DialogCloseButton />
                        </div>
                    )}
                    {children}
                </DialogBaseContent>
            </DialogOverlay>
        </DialogPortal>
    );
}

function DialogCloseButton({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return (
        <DialogPrimitive.Close
            {...props}
            className={cn(
                "cursor-pointer rounded-full outline-none ring-offset-8 ring-offset-zinc-950 transition-opacity focus:ring-2 focus:ring-zinc-50 focus:ring-offset-2 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-zinc-400 hover:[&_svg:not([class*='text-'])]:text-zinc-50 focus:[&_svg:not([class*='text-'])]:text-zinc-50 hover:[&_svg:not([class*='transition-'])]:transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
        >
            <XIcon />
            <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
    );
}

function DialogScreenContent({
    className,
    children,
    showClose = false,
    renderInWrapper = true,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showClose?: boolean;
    renderInWrapper?: boolean;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay className="z-[9999] !p-0">
                <DialogBaseContent
                    className={cn(
                        "size-full max-w-none px-4 lg:px-6",
                        className,
                    )}
                    {...props}
                >
                    {renderInWrapper ? (
                        <div className="mx-auto w-full max-w-7xl grid-rows-[auto_1fr]">
                            {children}
                        </div>
                    ) : (
                        children
                    )}
                    {showClose && (
                        <DialogCloseButton className="absolute right-4 top-4" />
                    )}
                </DialogBaseContent>
            </DialogOverlay>
        </DialogPortal>
    );
}

function DialogFullHeightContent({
    className,
    classNameOverlay,
    showClose = true,
    children,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    classNameOverlay?: string;
    showClose?: boolean;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay className={classNameOverlay}>
                <DialogBaseContent
                    className={cn(
                        "[@media(min-height:58rem)]:min-h-220 block h-full w-[calc(100%-2rem)] p-6 [@media(max-height:58rem)]:pt-0",
                        className,
                    )}
                    {...props}
                >
                    {showClose && (
                        <>
                            <DialogCloseButton className="absolute right-4 top-4 hidden [@media(min-height:58rem)]:block" />

                            <div className="sticky -top-6 z-10 -mx-3 flex justify-end bg-zinc-950 py-3.5 [@media(min-height:58rem)]:hidden">
                                <DialogCloseButton />
                            </div>
                        </>
                    )}

                    {children}
                </DialogBaseContent>
            </DialogOverlay>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2", className)}
            {...props}
        />
    );
}

function DialogStickyHeader({
    className,
    children,
    showClose = true,
    ...props
}: React.ComponentProps<"div"> & {
    showClose?: boolean;
}) {
    return (
        <div
            data-slot="dialog-header"
            className={cn(
                "sticky top-0 z-10 flex flex-row items-center justify-between gap-2 bg-zinc-950/95 py-4 backdrop-blur-md lg:py-6",
                className,
            )}
            {...props}
        >
            {children}
            {showClose && (
                <DialogClose asChild>
                    <Button variant="tertiary" size="icon">
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </Button>
                </DialogClose>
            )}
        </div>
    );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn(
                "text-lg font-semibold leading-none text-white",
                className,
            )}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-pretty text-sm text-zinc-200", className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogCloseButton,
    DialogContent,
    DialogScreenContent,
    DialogFullHeightContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogStickyHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
