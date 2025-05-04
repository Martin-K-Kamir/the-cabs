"use client";
import { usePathname } from "next/navigation";
import { Wrapper } from "@/components/ui/wrapper";

export function FlexibleWrapper({
    className,
    ...props
}: React.ComponentProps<"div">) {
    let size: React.ComponentProps<typeof Wrapper>["size"] = "lg";
    const pathname = usePathname();

    if (pathname === "/") {
        size = "2xl";
    }

    return <Wrapper {...props} className={className} size={size} />;
}
