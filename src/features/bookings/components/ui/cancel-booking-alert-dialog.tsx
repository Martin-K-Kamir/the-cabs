import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { type BookingId } from "@/features/bookings";
import { cancelBooking } from "@/features/bookings/services/cancel-booking";
import { isReactElement, toastPromise } from "@/lib/utils";

export type CancelBookingAlertDialogProps = {
    bookingId: BookingId;
    onCancel?: (bookingId: BookingId) => void;
    onCancelSuccess?: () => void;
    onCancelError?: (error: Error) => void;
} & React.ComponentProps<typeof AlertDialog>;

export function CancelBookingAlertDialog({
    bookingId,
    children,
    onCancel,
    onCancelSuccess,
    onCancelError,
    ...props
}: CancelBookingAlertDialogProps) {
    const isTrigger =
        isReactElement(children) && isCancelBookingAlertDialogTrigger(children);

    async function handleClick() {
        onCancel?.(bookingId);
        const {
            promise: updatePromise,
            reject: rejectPromise,
            resolve: resolvePromist,
        } = Promise.withResolvers();

        toastPromise({
            promise: updatePromise,
            messages: [
                "Canceling reservation...",
                "Reservation canceled successfully.",
                "Failed to cancel reservation.",
            ],
        });

        try {
            await cancelBooking(bookingId);
            onCancelSuccess?.();
            resolvePromist(true);
        } catch (err) {
            onCancelError?.(
                err instanceof Error
                    ? err
                    : new Error("Unknown error occurred"),
            );
            rejectPromise(false);
        }
    }

    return (
        <AlertDialog {...props}>
            {isTrigger ? (
                children
            ) : (
                <AlertDialogTrigger>{children}</AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancel reservation #{bookingId}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to cancel this reservation? This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Go back</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleClick}
                        variant="destructive"
                    >
                        Cancel reservation
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function CancelBookingAlertDialogTrigger(
    props: React.ComponentProps<typeof AlertDialogTrigger>,
) {
    return <AlertDialogTrigger {...props} />;
}

function isCancelBookingAlertDialogTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === CancelBookingAlertDialogTrigger.name
    );
}
