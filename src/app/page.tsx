// import { Suspense } from "react";
import { Wrapper } from "@/components/ui/wrapper";
// import {
//     CabinsPreviewList,
//     CabinsPreviewListSkeleton,
// } from "@/features/cabins";

type PageProps = {
    searchParams: Promise<Record<string, string | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
    const { ["cabins-list-key"]: cabinsListKey } = await searchParams;

    return (
        <Wrapper
            size="2xl"
            className="@container/main flex-1 py-24 lg:py-40"
            as="main"
        >
            {/* <Suspense
                key={cabinsListKey}
                fallback={<CabinsPreviewListSkeleton />}
            >
                <CabinsPreviewList queryParams={{ ...(await searchParams) }} />
            </Suspense> */}
            hi
        </Wrapper>
    );
}
