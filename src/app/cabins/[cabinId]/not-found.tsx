import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ErrorScreen,
    ErrorScreenWrapper,
    ErrorScreenDescription,
    ErrorScreenHeader,
    ErrorScreenTitle,
} from "@/components/ui/error-screen";

export default function NotFound() {
    return (
        <ErrorScreen>
            <ErrorScreenWrapper>
                <ErrorScreenHeader>
                    <ErrorScreenTitle>Cabin not found</ErrorScreenTitle>
                    <ErrorScreenDescription>
                        The cabin you are looking for does not exist. Please
                        check the URL or go back to the home page.
                    </ErrorScreenDescription>
                </ErrorScreenHeader>
                <Button asChild size="lg" className="w-full">
                    <Link href="/">Go back to home</Link>
                </Button>
            </ErrorScreenWrapper>
        </ErrorScreen>
    );
}
