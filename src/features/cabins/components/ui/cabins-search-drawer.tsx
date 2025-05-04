"use client";
import { useEffect, useState } from "react";
import {
    CalendarDaysIcon,
    MapPinIcon,
    SearchIcon,
    UsersIcon,
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/ui/wrapper";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Autocomplete,
    AutocompleteInput,
    AutocompleteOptions,
} from "@/components/ui/autocomplete";
import { SimplePopoverBlock } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ItemsCounter } from "@/components/ui/counter";
import { cn, formatCompactDateRange, formatGuestsSummary } from "@/lib/utils";
import type { DateRange, Guests } from "@/lib/types";
import { useCabinsSearch } from "@/features/cabins/hooks";
import { tempGuests, tempLocations } from "@/features/cabins/data";

type CabinsSearchDrawerProps = {
    classNameTrigger?: string;
};

export function CabinsSearchDrawer({
    classNameTrigger,
}: CabinsSearchDrawerProps) {
    const [open, setOpen] = useState(false);
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
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("rounded-xl", classNameTrigger)}
                >
                    <SearchIcon className="size-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent showThumb className="py-14">
                <DrawerTitle className="sr-only">Search for cabins</DrawerTitle>
                <DrawerDescription className="sr-only">
                    Search for cabins in your desired location, dates, and
                    number of guests.
                </DrawerDescription>

                <Wrapper className="space-y-6">
                    <div className="space-y-2.5">
                        <SearchGuestsBlock
                            value={guests}
                            onChange={setGuests}
                        />

                        <SearchDatesBlock value={dates} onChange={setDates} />

                        <SearchLocationBlock
                            value={location}
                            onChange={setLocation}
                        />
                    </div>

                    <Button
                        className="w-full"
                        size="xl"
                        onClick={() => {
                            handleSearch();
                            setOpen(false);
                        }}
                    >
                        Search
                    </Button>
                </Wrapper>
            </DrawerContent>
        </Drawer>
    );
}

type SearchItem<TValue> = {
    value: TValue;
    onChange: (value: TValue) => void;
    onOpenChange?: (open: boolean) => void;
};

function SearchDatesBlock({
    value,
    onChange,
}: SearchItem<Partial<DateRange> | undefined>) {
    const [open, setOpen] = useState(false);

    const isSm = useMediaQuery("(min-width: 40rem)", {
        defaultValue: false,
        initializeWithValue: false,
    });

    return (
        <SimplePopoverBlock
            label="Dates"
            value={formatCompactDateRange(value?.from, value?.to, {
                fallback: "Whenever",
            })}
            icon={<CalendarDaysIcon />}
            classNameContent="bg-zinc-950 w-(--radix-popover-trigger-width) space-y-4"
            showReset={value?.from !== undefined || value?.to !== undefined}
            onReset={() => {
                onChange(undefined);
            }}
            contentProps={{
                side: "top",
                inPortal: false,
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <p className="max-w-10/12 text-pretty font-semibold">
                When are you going?
            </p>
            <Calendar
                initialFocus
                mode="range"
                selected={value as DateRange}
                onSelect={onChange}
                fromDate={new Date()}
                numberOfMonths={isSm ? 2 : 1}
            />
        </SimplePopoverBlock>
    );
}

function SearchGuestsBlock({ value, onChange }: SearchItem<Guests>) {
    const [open, setOpen] = useState(false);

    return (
        <SimplePopoverBlock
            label="Guests"
            value={formatGuestsSummary(value.adults, value.children, "Whoever")}
            icon={<UsersIcon />}
            classNameContent="bg-zinc-950 w-(--radix-popover-trigger-width) space-y-4"
            showReset={value.adults > 0 || value.children > 0}
            onReset={() => {
                onChange({ adults: 0, children: 0 });
            }}
            contentProps={{
                side: "top",
                inPortal: false,
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <p className="max-w-10/12 text-pretty font-semibold">
                How many guests will be staying?
            </p>
            <ItemsCounter
                items={tempGuests}
                className="space-y-4"
                max={Infinity}
                value={value}
                onChange={values => onChange(values)}
            />
        </SimplePopoverBlock>
    );
}

function SearchLocationBlock({ value, onChange }: SearchItem<string>) {
    const [open, setOpen] = useState(false);
    const [queryLocation, setQueryLocation] = useState<string>(value);

    useEffect(() => {
        onChange(queryLocation);
    }, [queryLocation]);

    return (
        <SimplePopoverBlock
            label="Location"
            value={value.length > 0 ? value : "Wherever"}
            icon={<MapPinIcon />}
            classNameContent="bg-zinc-950 w-(--radix-popover-trigger-width) space-y-4"
            classNameValue="capitalize"
            showReset={value.length > 0}
            onReset={() => {
                onChange("");
            }}
            contentProps={{
                side: "top",
                inPortal: false,
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <p className="max-w-10/12 text-pretty font-semibold">
                Start typing to search for a location
            </p>
            <Autocomplete
                maxOptions={3}
                options={tempLocations}
                onSelect={value => {
                    onChange(value);
                    setOpen(false);
                }}
                onQueryChange={setQueryLocation}
            >
                <AutocompleteOptions
                    defaultOptionIcon={<MapPinIcon />}
                    classNameOption="text-sm gap-2.5"
                    classNameOptionIcon="size-4 bg-transparent [&>svg]:!size-4 [&>svg]:!text-zinc-400"
                />

                <div
                    className={cn(
                        "mt-2 flex items-center gap-2 rounded-xl border border-zinc-800 px-3",
                    )}
                >
                    <SearchIcon className="size-4 shrink-0 opacity-50" />
                    <AutocompleteInput
                        placeholder="Search location..."
                        className="outline-hidden flex h-10 w-full bg-transparent py-3 placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </Autocomplete>
        </SimplePopoverBlock>
    );
}
