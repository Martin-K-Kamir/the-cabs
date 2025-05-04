"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ErrorScreen,
    ErrorScreenWrapper,
    ErrorScreenDescription,
    ErrorScreenHeader,
    ErrorScreenTitle,
} from "@/components/ui/error-screen";

export default function Error() {
    return (
        <ErrorScreen>
            <ErrorScreenWrapper>
                <ErrorScreenHeader>
                    <ErrorScreenTitle>Something went wrong</ErrorScreenTitle>
                    <ErrorScreenDescription>
                        Please try again later or contact support if the problem
                        persists.
                    </ErrorScreenDescription>
                </ErrorScreenHeader>
                <Button asChild size="lg" className="w-full">
                    <Link href="/">Go back to home</Link>
                </Button>
            </ErrorScreenWrapper>
        </ErrorScreen>
    );
}
