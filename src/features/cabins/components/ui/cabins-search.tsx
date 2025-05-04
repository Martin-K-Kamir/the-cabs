"use client";
import { useEffect, useState } from "react";
import { MapPinIcon } from "lucide-react";
import {
    Search,
    SearchButton,
    SearchOverlay,
    SimpleSearchField,
} from "@/components/ui/search";
import type { DateRange, Guests } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { ItemsCounter } from "@/components/ui/counter";
import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteOptions,
    AutocompleteReset,
    AutocompleteTrigger,
    AutocompleteValue,
} from "@/components/ui/autocomplete";
import { cn, formatCompactDateRange, formatGuestsSummary } from "@/lib/utils";
import { useCabinsSearch } from "@/features/cabins/hooks";
import { tempGuests, tempLocations } from "@/features/cabins/data";

export type CabinsSearchProps = {
    className?: string;
};

export function CabinsSearch({ className }: CabinsSearchProps) {
    const {
        dates,
        guests,
        location,
        setDates,
        setGuests,
        setLocation,
        handleSearch,
    } = useCabinsSearch();

    return (
        <Search className={className}>
            <SearchLocationField value={location} onChange={setLocation} />
            <SearchDatesField value={dates} onChange={setDates} />
            <SearchGuestsField value={guests} onChange={setGuests} />
            <SearchButton onClick={handleSearch} />
            <SearchOverlay />
        </Search>
    );
}

type SearchItem<TValue> = {
    value: TValue;
    onChange: (value: TValue) => void;
    onOpenChange?: (open: boolean) => void;
};

function SearchDatesField({
    value,
    onChange,
    onOpenChange,
}: SearchItem<Partial<DateRange> | undefined>) {
    return (
        <SimpleSearchField
            label="Dates"
            value={formatCompactDateRange(value?.from, value?.to, {
                fallback: "Whenever",
            })}
            showReset={value?.from !== undefined || value?.to !== undefined}
            onReset={() => {
                onChange(undefined);
            }}
            onOpenChange={onOpenChange}
        >
            <Calendar
                initialFocus
                mode="range"
                selected={value as DateRange}
                onSelect={onChange}
                fromDate={new Date()}
                numberOfMonths={2}
            />
        </SimpleSearchField>
    );
}

function SearchGuestsField({
    value,
    onChange,
    onOpenChange,
}: SearchItem<Guests>) {
    return (
        <SimpleSearchField
            label="Guests"
            className="peer"
            value={formatGuestsSummary(value.adults, value.children, "Whoever")}
            showReset={value.adults > 0 || value.children > 0}
            onReset={() => {
                onChange({ adults: 0, children: 0 });
            }}
            onOpenChange={onOpenChange}
            contentProps={{
                align: "end",
                alignOffset: -52,
            }}
        >
            <ItemsCounter
                items={tempGuests}
                max={Infinity}
                className="min-w-64 space-y-8"
                value={value}
                onChange={values => onChange(values)}
            />
        </SimpleSearchField>
    );
}

function SearchLocationField({
    value,
    onChange,
    onOpenChange,
}: SearchItem<string>) {
    const [location, setLocation] = useState<string | null>(value);
    const [queryLocation, setQueryLocation] = useState<string>(value);

    useEffect(() => {
        onChange(location ?? queryLocation);
    }, [location, queryLocation]);

    return (
        <Autocomplete
            value={location}
            query={queryLocation}
            onValueChange={setLocation}
            onQueryChange={setQueryLocation}
            onOpenChange={open => {
                onOpenChange?.(open);
            }}
            options={tempLocations}
        >
            <div className="relative grid items-center">
                <AutocompleteTrigger
                    className={cn(
                        "group-data-[variant=compact]/search:min-w-25 peer flex h-full min-w-52 max-w-52 cursor-pointer flex-col items-start justify-center px-6 outline-none transition-[min-width] duration-200 focus-within:bg-zinc-800/70 hover:bg-zinc-800/70 focus-visible:bg-zinc-800/70 data-[state=open]:bg-zinc-800/70",
                    )}
                >
                    <span className="max-h-[16.5px] text-xs font-semibold leading-snug text-zinc-400 transition-[opacity,max-height] duration-200 group-data-[variant=compact]/search:max-h-0 group-data-[variant=compact]/search:opacity-0">
                        Location
                    </span>{" "}
                    <span className="h-5 cursor-text group-data-[variant=compact]/search:cursor-pointer">
                        <AutocompleteInput
                            className="w-38 absolute text-ellipsis text-sm outline-none placeholder:text-zinc-50 focus:placeholder:text-zinc-300 group-data-[variant=compact]/search:pointer-events-none group-data-[variant=compact]/search:cursor-pointer"
                            placeholder="Wherever"
                        />
                        <AutocompleteValue className="text-nowrap text-sm opacity-0" />
                    </span>
                </AutocompleteTrigger>
                <AutocompleteReset className="absolute right-2 -z-50 size-6 opacity-0 hover:z-50 hover:border-zinc-950/80 hover:bg-zinc-950/80 hover:opacity-100 focus-visible:z-50 focus-visible:opacity-100 peer-focus-within:z-50 peer-focus-within:opacity-100 peer-hover:z-50 peer-hover:opacity-100 peer-focus-visible:z-50 peer-focus-visible:opacity-100 group-data-[variant=compact]/search:!-z-50 group-data-[variant=compact]/search:!opacity-0 peer-data-[state=open]:z-50 peer-data-[state=open]:opacity-100" />
            </div>
            <AutocompleteContent align="start" sideOffset={10}>
                <AutocompleteOptions defaultOptionIcon={<MapPinIcon />} />
            </AutocompleteContent>
        </Autocomplete>
    );
}
