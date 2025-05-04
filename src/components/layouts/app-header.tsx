import Link from "next/link";
import { ShareButton } from "@/components/ui/share-button";
import { RenderOnPath } from "@/components/ui/render-on-path";
import { FlexibleWrapper } from "@/components/ui/flexible-wrapper";
import { CabinsSearch } from "@/features/cabins/components/ui/cabins-search";
import { CabinsSearchDrawer } from "@/features/cabins/components/ui/cabins-search-drawer";
import { UserNav } from "@/features/user/components/ui/user-nav";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export function AppHeader({
    className,
    ...props
}: React.ComponentProps<"header">) {
    return (
        <header
            {...props}
            className={cn(
                "lg:has-data-[variant=default]:max-h-30 backdrop-blur-xs lg:max-h-18 fixed top-0 z-20 grid h-full max-h-14 w-full items-center border-b border-zinc-800 bg-zinc-950/95 shadow-md transition-[max-height] duration-200",
                className,
            )}
        >
            <FlexibleWrapper className="flex items-center justify-between gap-6">
                <Link
                    href="/"
                    className="font-sans-serif focus-visible:ring-offset-5 select-none rounded-md text-xl font-bold leading-[0.9] text-white outline-none ring-white ring-offset-zinc-950 focus-visible:ring-2 lg:text-2xl"
                >
                    The Cabs
                </Link>

                <RenderOnPath paths={["/"]}>
                    <Suspense>
                        <CabinsSearch className="hidden lg:flex" />
                    </Suspense>
                </RenderOnPath>

                <div className="flex items-center gap-0.5 lg:gap-1.5">
                    <RenderOnPath paths={["/"]}>
                        <Suspense>
                            <CabinsSearchDrawer classNameTrigger="lg:hidden" />
                        </Suspense>
                    </RenderOnPath>

                    <RenderOnPath paths={["/cabins/[id]"]}>
                        <ShareButton
                            shareData={{
                                text: "Check out this cabin!",
                            }}
                            className="rounded-xl lg:mr-2"
                        />
                    </RenderOnPath>

                    <UserNav />
                </div>
            </FlexibleWrapper>
        </header>
    );
}
