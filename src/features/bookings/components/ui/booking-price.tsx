import { cn, formatCurrency } from "@/lib/utils";

export type BookingPriceProps = {
    price: number;
    discount?: number;
    suffix?: string;
    classNameDiscount?: string;
    classNamePrice?: string;
    classNameSuffix?: string;
} & React.ComponentProps<"p">;

export function BookingPrice({
    price,
    discount,
    className,
    classNameDiscount,
    classNamePrice,
    classNameSuffix,
    suffix = " per night",
    ...props
}: BookingPriceProps) {
    return (
        <p {...props} className={cn("text-2xl font-semibold", className)}>
            {discount ? (
                <span
                    className={cn("line-through opacity-40", classNameDiscount)}
                >
                    {formatCurrency(price)}
                </span>
            ) : null}{" "}
            <span className={classNamePrice}>
                {discount
                    ? formatCurrency(price - discount)
                    : formatCurrency(price)}
            </span>
            <span className={cn("text-base font-normal", classNameSuffix)}>
                {suffix}
            </span>
        </p>
    );
}
