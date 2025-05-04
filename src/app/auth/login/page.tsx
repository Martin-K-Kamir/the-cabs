import { Wrapper } from "@/components/ui/wrapper";
import { LogInForm } from "@/features/auth";

export default function Page() {
    return (
        <Wrapper
            size="sm"
            className="@container/main pt-26 space-y-6 lg:space-y-8 lg:pt-48"
            as="main"
        >
            <header className="space-y-2.5 text-center">
                <h1 className="font-sans-serif text-3xl font-bold text-white sm:text-4xl">
                    Welcome Back
                </h1>
                <p className="mx-auto max-w-prose text-balance text-sm text-zinc-200 sm:text-base">
                    Login with your Google account.
                </p>
            </header>
            <LogInForm
                redirectTo="/"
                buttonProps={{
                    size: "lg",
                }}
            />
        </Wrapper>
    );
}
