"use client";
import { usePathname } from "next/navigation";

type ShowOnPathProps = {
    paths?: string[];
};

export function RenderOnPath({
    paths,
    children,
}: React.PropsWithChildren<ShowOnPathProps>) {
    const pathname = usePathname();

    if (paths) {
        const isMatch = paths.some(path => {
            const regex = new RegExp(`^${path.replace(/\[.*?\]/g, "[^/]+")}$`);
            return regex.test(pathname);
        });

        if (!isMatch) {
            return null;
        }
    }
    return children;
}
