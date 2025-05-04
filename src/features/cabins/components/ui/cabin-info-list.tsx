import { CABIN_ICONS_MAP, type CabinInfoItem } from "@/features/cabins";
import { cn } from "@/lib/utils";

export type CabinInfoListProps<TItem extends CabinInfoItem> = {
    data: TItem[];
    classNameItem?: string;
    children?:
        | React.ReactNode
        | ((item: TItem, index: number) => React.ReactNode);
} & Omit<React.ComponentProps<"ul">, "children">;

export function CabinInfoList<TItem extends CabinInfoItem>({
    data,
    className,
    classNameItem,
    children,
    ...props
}: CabinInfoListProps<TItem>) {
    return (
        <ul
            {...props}
            className={cn(
                "flex flex-wrap items-center gap-x-5 gap-y-2 text-zinc-200",
                className,
            )}
        >
            {data.map((item, index) =>
                typeof children === "function" ? (
                    children(item, index)
                ) : (
                    <li
                        key={item.label}
                        className={cn(
                            "flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0",
                            classNameItem,
                        )}
                    >
                        {CABIN_ICONS_MAP[item.icon]}
                        {item.label}
                    </li>
                ),
            )}
        </ul>
    );
}
