import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
    return (
        <div className="grid h-full justify-center pt-20">
            <LoaderCircleIcon className="size-8 animate-spin text-zinc-50" />
        </div>
    );
}
