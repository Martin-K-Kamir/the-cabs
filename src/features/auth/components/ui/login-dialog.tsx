import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn, isReactElement } from "@/lib/utils";
import { LogInForm } from "@/features/auth/components/forms/login-form";

type LoginDialogProps = {
    children?: React.ReactNode;
    title?: string;
    description?: string;
    classNameContent?: string;
    classNameTrigger?: string;
} & React.ComponentProps<typeof Dialog>;

export function LoginDialog({
    children,
    title = "Welcome Back",
    description = "Log in with your Google account.",
    classNameContent,
    classNameTrigger,
    ...props
}: LoginDialogProps) {
    const isTrigger = isReactElement(children) && isLoginTrigger(children);

    return (
        <Dialog {...props}>
            {isTrigger ? (
                children
            ) : (
                <DialogTrigger className={classNameTrigger}>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className={cn("!py-8", classNameContent)}>
                <DialogHeader className="gap-1 text-center">
                    <DialogTitle className="font-sans-serif text-2xl font-bold text-white">
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="mt-2">
                    <LogInForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function LoginDialogTrigger(
    props: React.ComponentProps<typeof DialogTrigger>,
) {
    return <DialogTrigger {...props} />;
}

function isLoginTrigger(children: React.ReactElement) {
    return (
        typeof children.type === "function" &&
        children.type.name === LoginDialogTrigger.name
    );
}
