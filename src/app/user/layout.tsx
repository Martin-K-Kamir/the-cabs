import { Wrapper } from "@/components/ui/wrapper";
import { UserSidebar } from "@/features/user/components/layouts/user-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Wrapper className="@container/main grid flex-1 gap-12 lg:grid-cols-[auto_1fr]">
            <UserSidebar className="sticky top-0 pt-28" />
            <main className="pb-24 pt-24 lg:pt-28">{children}</main>
        </Wrapper>
    );
}
