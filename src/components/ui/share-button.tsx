"use client";
import { useEffect, useState } from "react";
import { ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slot } from "@radix-ui/react-slot";

type ShareButtonProps = {
    shareData?: ShareData;
} & React.ComponentProps<typeof Button>;

export function ShareButton({
    shareData,
    variant = "ghost",
    size = "icon",
    children,
    ...props
}: ShareButtonProps) {
    const [isShareSupported, setIsShareSupported] = useState(true);

    useEffect(() => {
        setIsShareSupported("share" in navigator);
    }, []);

    if (!isShareSupported) {
        return null;
    }

    function handleClick() {
        navigator.share({
            ...shareData,
            title: shareData?.title ?? "The Cabs",
            text: shareData?.text ?? "Check out this website!",
            url: shareData?.url ?? window.location.href,
        });
    }

    if (children) {
        return <Slot onClick={handleClick}>{children}</Slot>;
    }

    return (
        <Button {...props} variant={variant} size={size} onClick={handleClick}>
            <ShareIcon className="text-zinc-100" />
            <span className="sr-only">share this page</span>
        </Button>
    );
}
