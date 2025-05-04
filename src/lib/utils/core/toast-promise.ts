import { toast } from "sonner";

type ToastPromiseParams<TPromiseValue> = {
    promise: Promise<TPromiseValue>;
    messages: [loading: string, success: string, error: string];
    undoFn?: (value: TPromiseValue) => void;
};

export function toastPromise<TPromiseValue>({
    promise,
    messages,
    undoFn,
}: ToastPromiseParams<TPromiseValue>) {
    return toast.promise(promise, {
        loading: messages[0],
        success: (value: TPromiseValue) => ({
            message: messages[1],
            ...(undoFn && {
                action: {
                    label: "Undo",
                    onClick: () => undoFn(value),
                },
                duration: 5_000,
            }),
        }),
        error: {
            message: messages[2],
            richColors: true,
        },
    });
}
