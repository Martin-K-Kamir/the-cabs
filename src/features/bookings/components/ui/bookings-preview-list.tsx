"use client";
import {
    ListPagination,
    ListPaginationButtons,
    ListPaginationContent,
    ListPaginationCounter,
} from "@/components/ui/list-pagination";
import {
    BookingPreviewCard,
    type BookingPreviewCardProps,
    type BookingPreviewCardVariant,
} from "@/features/bookings/components/ui/booking-preview-card";

export type BookingsPreviewListProps = {
    data: BookingPreviewCardProps[];
    classNameItem?: string;
    limit?: number;
    variant?: BookingPreviewCardVariant;
} & React.ComponentProps<"ul">;

export function BookingsPreviewList({
    data,
    classNameItem,
    limit = 2,
    variant = "default",
    ...props
}: BookingsPreviewListProps) {
    return (
        <ListPagination
            className="@container/booking-preview-list"
            length={data.length}
            limit={limit}
        >
            <ListPaginationContent
                {...props}
                items={data}
                renderItem={item => (
                    <li key={item.bookingId}>
                        <BookingPreviewCard
                            {...item}
                            className={classNameItem}
                            variant={variant}
                        />
                    </li>
                )}
            />
            <div className="mt-4 flex items-center justify-end gap-4 sm:mt-6">
                <ListPaginationCounter />
                <ListPaginationButtons />
            </div>
        </ListPagination>
    );
}
