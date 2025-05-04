import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type NoUpcomingBookingsProps = {
    title?: string;
    description?: string;
    linkText?: string;
    linkHref?: string;
    linkTarget?: string;
    titleAs?: keyof React.JSX.IntrinsicElements;
    classNameHeader?: string;
    classNameTitle?: string;
    classNameDescription?: string;
    classNameContent?: string;
    classNameButton?: string;
    buttonProps?: Omit<React.ComponentProps<typeof Button>, "className">;
} & Omit<React.ComponentProps<typeof Card>, "children">;

export function NoUpcomingBookings({
    title = "No reservations… at least for now!",
    description = "It's time to dust off your suitcase and start planning your next adventure.",
    linkText = "Start exploring cabins",
    linkHref = "/",
    titleAs = "h2",
    linkTarget = "_blank",
    classNameHeader,
    classNameTitle,
    classNameDescription,
    classNameContent,
    classNameButton,
    buttonProps,
    ...props
}: NoUpcomingBookingsProps) {
    return (
        <Card {...props}>
            <CardHeader
                className={cn("space-y-1 text-pretty", classNameHeader)}
            >
                <CardTitle
                    className={cn("text-lg leading-snug", classNameTitle)}
                    as={titleAs}
                >
                    {title}
                </CardTitle>
                <CardDescription
                    className={cn("text-pretty", classNameDescription)}
                >
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className={classNameContent}>
                <Button
                    size="lg"
                    {...buttonProps}
                    className={cn("xs:w-auto w-full", classNameButton)}
                    asChild
                >
                    <Link href={linkHref} target={linkTarget}>
                        {linkText}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
