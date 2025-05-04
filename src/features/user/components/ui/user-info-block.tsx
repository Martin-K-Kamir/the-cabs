import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatUserInitials } from "@/lib/utils";

export type UserInfoBlockProps = {
    userName: string;
    userAvatar: string;
    userEmail: string;
} & React.ComponentProps<"div">;

export function UserInfoBlock({
    userEmail,
    userAvatar,
    userName,
    className,
    ...props
}: UserInfoBlockProps) {
    return (
        <div
            {...props}
            className={cn("flex items-center gap-3 p-1.5", className)}
        >
            <Avatar>
                <AvatarImage
                    src={userAvatar}
                    alt={`${userName}'s avatar picture`}
                />
                <AvatarFallback>{formatUserInitials(userName)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs text-zinc-300">
                    {userEmail}
                </span>
            </div>
        </div>
    );
}
