import { Suspense } from "react";
import { BookCheckIcon, LogOutIcon, UserIcon } from "lucide-react";
import { auth } from "@/services/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserNavButton } from "@/features/user/components/ui/user-nav-button";
import { UserInfoBlock } from "@/features/user/components/ui/user-info-block";
import {
    LoginDialog,
    LoginDialogTrigger,
} from "@/features/auth/components/ui/login-dialog";
import { logout } from "@/features/auth/services/logout";
import Link from "next/link";

export async function UserNavMain() {
    const session = await auth();

    if (!session) {
        return (
            <LoginDialog>
                <LoginDialogTrigger asChild>
                    <UserNavButton>
                        <span className="sr-only">Login</span>
                    </UserNavButton>
                </LoginDialogTrigger>
            </LoginDialog>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <UserNavButton
                    userName={session.user?.name}
                    userAvatar={session.user?.image}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-58">
                {session.user && session.user.name && session.user.email && (
                    <>
                        <UserInfoBlock
                            userName={session.user.name}
                            userAvatar={session.user.image ?? ""}
                            userEmail={session.user.email}
                        />
                        <DropdownMenuSeparator />
                    </>
                )}

                <Link href="/user/reservations">
                    <DropdownMenuItem className="cursor-pointer">
                        <BookCheckIcon />
                        Reservations
                    </DropdownMenuItem>
                </Link>
                <Link href="/user/profile">
                    <DropdownMenuItem className="cursor-pointer">
                        <UserIcon /> Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOutIcon /> Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function UserNav() {
    return (
        <Suspense fallback={<UserNavButton isLoading />}>
            <UserNavMain />
        </Suspense>
    );
}
