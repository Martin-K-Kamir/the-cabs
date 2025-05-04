import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

export type StarsProps = {
    length: number;
    maxLenght: number;
    classNameIcon?: string;
    render?: (index: number) => React.ReactNode;
} & Omit<React.ComponentProps<"div">, "children">;

export function Stars({
    length,
    maxLenght,
    className,
    classNameIcon,
    render,
    ...props
}: StarsProps) {
    return (
        <div {...props} className={cn("flex items-center gap-1", className)}>
            {[...Array(maxLenght)].map(
                (_, index) =>
                    render?.(index) ?? (
                        <StarIcon
                            key={index}
                            className={cn("size-4 fill-current", {
                                "text-yellow-400": index < Math.round(length),
                                "text-zinc-500": index >= Math.round(length),
                                classNameIcon,
                            })}
                        />
                    ),
            )}
        </div>
    );
}
