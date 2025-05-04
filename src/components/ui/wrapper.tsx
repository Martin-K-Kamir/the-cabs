import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AnyComponent } from "@/components/ui/any-component";

export const wrapperVariants = cva("mx-auto px-6 sm:px-10 2xl:px-20 w-full", {
    variants: {
        size: {
            sm: "max-w-xl",
            md: "max-w-6xl",
            lg: "max-w-7xl",
            xl: "max-w-10xl",
            "2xl": "max-w-12xl",
        },
    },
    defaultVariants: {
        size: "lg",
    },
});

export function Wrapper({
    as: Comp = "div",
    className,
    size,
    ...props
}: React.ComponentProps<typeof AnyComponent> &
    VariantProps<typeof wrapperVariants>) {
    return (
        <Comp {...props} className={cn(wrapperVariants({ size, className }))} />
    );
}
