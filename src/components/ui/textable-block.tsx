import { cn } from "@/lib/utils";

export type TextableBlockProps = {
    title: string;
    description: string;
    icon?: React.ReactNode;
    classNameTitle?: string;
    classNameDescription?: string;
} & React.ComponentProps<"div">;

export function TextableBlock({
    title,
    description,
    icon,
    className,
    classNameTitle,
    classNameDescription,
    ...props
}: TextableBlockProps) {
    return (
        <div
            {...props}
            className={cn(
                "flex items-center gap-5 text-left text-sm [&>div:not([class*='flex-'])]:flex-1 [&>div:not([class*='space-y-'])]:space-y-1 [&_svg:not([class*='size-'])]:size-6",
                className,
            )}
        >
            {icon}
            <div>
                <p className={cn("font-medium leading-none", classNameTitle)}>
                    {title}
                </p>
                <p
                    className={cn(
                        "font-normal text-zinc-300",
                        classNameDescription,
                    )}
                >
                    {description}
                </p>
            </div>
        </div>
    );
}
