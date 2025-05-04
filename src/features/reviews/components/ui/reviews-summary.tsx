import { StarIcon } from "lucide-react";
import { AnyComponent } from "@/components/ui/any-component";
import { cn } from "@/lib/utils";

export type ReviewsSummaryProps = {
    data: {
        rating: number;
    }[];
    compact?: boolean;
} & React.ComponentProps<typeof AnyComponent>;

export function ReviewsSummary({
    as: Comp = "p",
    className,
    data,
    compact = false,
    ...props
}: ReviewsSummaryProps) {
    const ratingsLength = data.length;
    const rating =
        data.reduce((acc, review) => acc + review.rating, 0) / ratingsLength;

    if (ratingsLength === 0) {
        return null;
    }

    return (
        <Comp
            {...props}
            className={cn(
                "flex items-center gap-2 text-lg font-semibold [&_svg]:size-5 [&_svg]:fill-current [&_svg]:text-yellow-400",
                className,
            )}
        >
            <StarIcon />
            <span>
                {rating.toFixed(2)}{" "}
                <span className={cn(compact && "hidden")}>
                    · {ratingsLength} reviews
                </span>
            </span>
        </Comp>
    );
}
