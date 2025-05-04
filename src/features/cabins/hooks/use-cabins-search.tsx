import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseDates, parseGuests } from "@/lib/utils";
import {
    setCabinsListKeyQueryParam,
    setDatesQueryParam,
    setGuestsQueryParam,
    setLocationQueryParam,
} from "@/features/cabins/lib/utils";

export function useCabinsSearch() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [location, setLocation] = useState(
        searchParams.get("location") ?? "",
    );
    const [dates, setDates] = useState(parseDates(searchParams));
    const [guests, setGuests] = useState(parseGuests(searchParams));

    function handleSearch() {
        const params = new URLSearchParams(searchParams);

        setLocationQueryParam(params, location);
        setDatesQueryParam(params, dates);
        setGuestsQueryParam(params, guests);
        setCabinsListKeyQueryParam(params);

        if (params.toString() === "" && searchParams.toString() === "") {
            return;
        }

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    }

    return {
        location,
        setLocation,
        dates,
        setDates,
        guests,
        setGuests,
        handleSearch,
    };
}
