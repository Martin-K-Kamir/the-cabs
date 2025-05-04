import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { AppHeader } from "@/components/layouts/app-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { Toaster } from "sonner";

const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "The Cabs | %s",
        default: "The Cabs",
    },
    description:
        "The Cabs is a cabin rental platform that connects travelers with unique and cozy cabins in nature.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} relative flex min-h-svh flex-col bg-zinc-950 text-zinc-50 antialiased`}
            >
                <QueryProvider>
                    <SidebarProvider>
                        <AppHeader />
                        {children}
                    </SidebarProvider>
                    <Toaster position="top-right" />
                </QueryProvider>
            </body>
        </html>
    );
}
