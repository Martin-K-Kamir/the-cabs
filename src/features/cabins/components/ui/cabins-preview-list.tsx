import {
    // CabinPreviewCard,
    CabinPreviewCardSkeleton,
    getAllCabinsPreview,
    getAllCabinsRatings,
} from "@/features/cabins";
import { cn } from "@/lib/utils";

export type CabinsPreviewListProps = Omit<
    React.ComponentProps<"div">,
    "children"
> & {
    classNameList?: string;
    queryParams?: Record<string, string | undefined>;
};

const cabinsPreviewListClassName =
    "@10xl/cabin-preview-list:grid-cols-6 @8xl/cabin-preview-list:grid-cols-5 @6xl/cabin-preview-list:grid-cols-4 @4xl/cabin-preview-list:grid-cols-3 @xl/cabin-preview-list:grid-cols-2 @2xl/cabin-preview-list:gap-x-8 mx-auto grid gap-x-6 gap-y-10";

export async function CabinsPreviewList({
    className,
    classNameList,
    queryParams,
    ...props
}: CabinsPreviewListProps) {
    const [cabins, ratings] = await Promise.all([
        await getAllCabinsPreview(queryParams || {}),
        await getAllCabinsRatings(),
    ]);

    return (
        <div
            {...props}
            className={cn("@container/cabin-preview-list", className)}
        >
            {cabins.length === 0 && (
                <div className="py-20 text-center text-xl font-semibold text-zinc-50">
                    No cabins found
                </div>
            )}
            <ul className={cn(cabinsPreviewListClassName, classNameList)}>
                {cabins?.map((cabin, index) => (
                    <li key={cabin.id}>
                        {/* <CabinPreviewCard
                            id={cabin.id}
                            name={cabin.name}
                            images={cabin.images}
                            price={cabin.price}
                            discount={cabin.discount}
                            index={index}
                            location={cabin.location}
                            nextAvailableDate={cabin.nextAvailableDate}
                            ratings={ratings.filter(
                                review => review.cabinId === cabin.id,
                            )}
                        /> */}
                        <div>
                            {cabin.name} {index} {ratings.length}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function CabinsPreviewListSkeleton({
    className,
    classNameList,
    ...props
}: CabinsPreviewListProps) {
    const array = Array.from({ length: 18 }, (_, i) => i + 1);

    return (
        <div
            {...props}
            className={cn("@container/cabin-preview-list", className)}
        >
            <ul className={cn(cabinsPreviewListClassName, classNameList)}>
                {array.map(i => (
                    <li key={i}>
                        <CabinPreviewCardSkeleton />
                    </li>
                ))}
            </ul>
        </div>
    );
}
