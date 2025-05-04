import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageBackdrop({
    image,
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
    image: string;
}) {
    return (
        <div
            {...props}
            className={cn(
                "max-h-220 min-h-100 absolute left-0 right-0 top-0 -z-10 h-3/4 w-full",
                className,
            )}
        >
            <Image
                fill
                priority
                sizes="100vw"
                src={image}
                className="absolute inset-0 size-full object-cover"
                alt=""
                aria-hidden="true"
            />
            <div className="bg-linear-to-b absolute inset-0 size-full from-transparent to-zinc-950 object-cover backdrop-blur-md backdrop-brightness-50" />
        </div>
    );
}
