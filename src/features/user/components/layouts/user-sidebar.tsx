"use client";
import { BookCheckIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { logout } from "@/features/auth/services/logout";
import { usePathname } from "next/navigation";

const items = [
    {
        title: "Reservations",
        url: "/user/reservations",
        icon: BookCheckIcon,
    },
    {
        title: "Profile",
        url: "/user/profile",
        icon: UserIcon,
    },
] as const satisfies Array<{
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}>;

export function UserSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup className="p-0 pr-4">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={{
                                            children: item.title,
                                        }}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-0 py-8 pr-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={{
                                children: "Logout",
                            }}
                            className="cursor-pointer"
                            onClick={logout}
                        >
                            <LogOutIcon />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
