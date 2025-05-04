import { CABIN_ICONS_MAP, type CabinCategorizedItem } from "@/features/cabins";
import { cn } from "@/lib/utils";

export type CabinCategorizedListProps<TRecord extends CabinCategorizedItem> = {
    data: TRecord[];
    classNameItem?: string;
    classNameCategory?: string;
    renderItem?:
        | React.ReactNode
        | ((item: TRecord["items"][number], index: number) => React.ReactNode);
    renderCategory?:
        | React.ReactNode
        | ((item: TRecord, index: number) => React.ReactNode);
} & Omit<React.ComponentProps<"ul">, "children">;

export function CabinCategorizedList<TRecord extends CabinCategorizedItem>({
    data,
    className,
    classNameItem,
    classNameCategory,
    renderItem,
    renderCategory,
    ...props
}: CabinCategorizedListProps<TRecord>) {
    return (
        <ul {...props} className={cn("space-y-10", className)}>
            {data.map((item, index) =>
                renderCategory !== undefined ? (
                    typeof renderCategory === "function" ? (
                        renderCategory(item, index)
                    ) : (
                        renderCategory
                    )
                ) : (
                    <li
                        key={item.label}
                        className={cn(
                            "[&>span]:mb-2 [&>span]:block [&>span]:text-lg [&>span]:font-semibold [&>ul]:space-y-2",
                            classNameCategory,
                        )}
                    >
                        <span>{item.label}</span>
                        <ul>
                            {item.items.map(subItem =>
                                renderItem !== undefined ? (
                                    typeof renderItem === "function" ? (
                                        renderItem(subItem, index)
                                    ) : (
                                        renderItem
                                    )
                                ) : (
                                    <li
                                        key={subItem.label}
                                        className={cn(
                                            "flex items-center gap-4 [&_svg]:size-5 [&_svg]:text-zinc-300",
                                            classNameItem,
                                        )}
                                    >
                                        {CABIN_ICONS_MAP[subItem.icon]}
                                        {subItem.label}
                                    </li>
                                ),
                            )}
                        </ul>
                    </li>
                ),
            )}
        </ul>
    );
}
