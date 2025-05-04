"use client";
import {
    createContext,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchContext } from "@/components/ui/search";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AutocompleteOptionObject = {
    value: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
};

type AutocompleteOption = AutocompleteOptionObject | string;

type AutocompleteContextValue = {
    focusedIndex: number | null;
    id: string;
    inputRef: React.RefObject<HTMLInputElement>;
    resetRef: React.RefObject<HTMLButtonElement>;
    options: AutocompleteOption[];
    open: boolean;
    query: string;
    tempQuery: string | null;
    value: string | null;
    maxOptions: number;
    inputPlaceholder?: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setTempQuery: React.Dispatch<React.SetStateAction<string | null>>;
    setValue: React.Dispatch<React.SetStateAction<string | null>>;
    setFocusedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    onQueryChange?: (query: string) => void;
    onValueChange?: (value: string | null) => void;
    onTempQueryChange?: (tempQuery: string | null) => void;
    onSelect?: (value: string) => void;
    setInputPlaceholder?: (placeholder: string) => void;
};

const AutocompleteContext = createContext<AutocompleteContextValue | null>(
    null,
);

export function useAutocomplete() {
    const context = useContext(AutocompleteContext);
    if (!context) {
        throw new Error(
            "useAutocomplete must be used within a <Autocomplete/>",
        );
    }
    return context;
}

export type AutocompleteProps = {
    children: React.ReactNode;
    options: AutocompleteOption[];
    maxOptions?: number;
    value?: string | null;
    query?: string;
    tempQuery?: string | null;
    open?: boolean;
    onQueryChange?: (query: string) => void;
    onValueChange?: (value: string | null) => void;
    onTempQueryChange?: (tempQuery: string | null) => void;
    onOpenChange?: (open: boolean) => void;
    onSelect?: (value: string) => void;
};

export function Autocomplete({
    options,
    maxOptions,
    children,
    open: openProp = false,
    value: valueProp = null,
    query: queryProp = "",
    tempQuery: tempQueryProp = null,
    onQueryChange,
    onValueChange,
    onTempQueryChange,
    onOpenChange,
    onSelect,
}: AutocompleteProps) {
    const id = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const resetRef = useRef<HTMLButtonElement>(null);
    const [inputPlaceholder, setInputPlaceholder] = useState<
        string | undefined
    >(undefined);
    const [query, setQuery] = useState(queryProp);
    const [tempQuery, setTempQuery] = useState<string | null>(tempQueryProp);
    const [value, setValue] = useState<string | null>(valueProp);
    const [open, setOpen] = useState(openProp);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const searchContext = useContext(SearchContext);

    useEffect(() => {
        if (!value) {
            return;
        }

        setTimeout(() => {
            setQuery(value);
            onQueryChange?.(value);
        }, 100);
    }, [value]);

    const filteredOptions = options?.filter(option => {
        const optionValue = typeof option === "string" ? option : option.value;
        return optionValue.toLowerCase().includes(query.toLowerCase());
    });

    return (
        <AutocompleteContext.Provider
            value={{
                id,
                open,
                query,
                tempQuery,
                value,
                focusedIndex,
                maxOptions: maxOptions ?? Infinity,
                inputPlaceholder,
                options: filteredOptions,
                inputRef: inputRef as React.RefObject<HTMLInputElement>,
                resetRef: resetRef as React.RefObject<HTMLButtonElement>,
                setOpen,
                setQuery,
                setTempQuery,
                setValue,
                setFocusedIndex,
                onQueryChange,
                onValueChange,
                onTempQueryChange,
                onSelect,
                setInputPlaceholder,
            }}
        >
            <Popover
                open={open}
                onOpenChange={open => {
                    setOpen(open);
                    onOpenChange?.(open);
                    if (!open) {
                        setFocusedIndex(null);
                    }

                    if (open) {
                        searchContext?.setIsCompact(false);
                        searchContext?.setShowOverlay(window.scrollY > 0);
                    }
                }}
            >
                {children}
            </Popover>
        </AutocompleteContext.Provider>
    );
}

export function AutocompleteTrigger({
    children,
    ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
    return (
        <PopoverTrigger {...props} tabIndex={-1}>
            {children}
        </PopoverTrigger>
    );
}

export function AutocompleteReset({
    variant = "ghost",
    size = "icon",
    className,
    children,
    onClick,
    onKeyDown,
    ...props
}: React.ComponentProps<typeof Button>) {
    const {
        resetRef,
        inputRef,
        query,
        value,
        setQuery,
        setValue,
        setTempQuery,
        setFocusedIndex,
        onQueryChange,
        onValueChange,
        onTempQueryChange,
    } = useAutocomplete();

    if (!query.trim() && !value) {
        return null;
    }

    function reset() {
        setQuery("");
        setTempQuery(null);
        setValue(null);
        setFocusedIndex(null);
        onQueryChange?.("");
        onValueChange?.(null);
        onTempQueryChange?.(null);
        inputRef.current?.focus();
    }

    return (
        <Button
            ref={resetRef}
            variant={variant}
            size={size}
            data-slot="autocomplete-reset"
            onClick={e => {
                onClick?.(e);
                reset();
            }}
            onKeyDown={e => {
                onKeyDown?.(e);
                if (e.key === "Enter") {
                    reset();
                }
            }}
            className={cn("[&_svg:not([class*='size-'])]:size-3.5", className)}
            {...props}
        >
            {children ?? <XIcon />}
        </Button>
    );
}

export function AutocompleteEmpty({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("p-2", className)}
            data-slot="autocomplete-empty"
        />
    );
}

export function AutocompleteInput({
    onChange,
    onFocus,
    onClick,
    onKeyDown,
    ...props
}: React.ComponentProps<"input">) {
    const {
        id,
        inputRef,
        query,
        tempQuery,
        value,
        open,
        focusedIndex,
        setQuery,
        setOpen,
        setValue,
        setTempQuery,
        onQueryChange,
        onValueChange,
        onTempQueryChange,
        setInputPlaceholder,
        setFocusedIndex,
    } = useAutocomplete();
    const searchContext = useContext(SearchContext);

    useEffect(() => {
        if (!props.placeholder) {
            return;
        }

        setInputPlaceholder?.(props.placeholder);
    }, [props.placeholder]);

    return (
        <input
            {...props}
            ref={inputRef}
            id={`autocomplete-${id}-input`}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`autocomplete-${id}-options`}
            aria-activedescendant={
                focusedIndex !== null
                    ? `autocomplete-${id}-option-${focusedIndex}`
                    : undefined
            }
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            role="combobox"
            data-slot="autocomplete-input"
            value={value || tempQuery || query}
            onChange={e => {
                onChange?.(e);
                setTempQuery(null);
                setValue(null);
                setQuery(e.target.value);
                onQueryChange?.(e.target.value);
                onValueChange?.(null);
                onTempQueryChange?.(null);
                setFocusedIndex(null);

                if (!open) {
                    setOpen(true);
                }
            }}
            onFocus={e => {
                onFocus?.(e);
                if (!open) {
                    setOpen(true);
                    searchContext?.setIsCompact(false);
                    searchContext?.setShowOverlay(window.scrollY > 0);
                }
            }}
            onClick={e => {
                onClick?.(e);
                if (!open) {
                    return;
                }
                e.stopPropagation();
            }}
            onKeyDown={e => {
                onKeyDown?.(e);
                if (e.key === "Enter" && !open) {
                    setOpen(true);
                }
            }}
        />
    );
}

export function AutocompleteValue(props: React.ComponentProps<"span">) {
    const { value, query, tempQuery, inputPlaceholder } = useAutocomplete();

    return (
        <span {...props} data-slot="autocomplete-value">
            {query || tempQuery || value || inputPlaceholder}
        </span>
    );
}

export type AutocompleteOptionProps = {
    value: string;
    classNameIcon?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
} & React.ComponentProps<"div">;

export function AutocompleteOption({
    children,
    className,
    classNameIcon,
    icon,
    value,
    onClick,
    ...props
}: AutocompleteOptionProps) {
    const { setValue, setFocusedIndex, setOpen, onValueChange, onSelect } =
        useAutocomplete();

    return (
        <div
            {...props}
            onClick={e => {
                onClick?.(e);
                setOpen(false);
                setFocusedIndex(null);
                setValue(value);
                onSelect?.(value);
                onValueChange?.(value);
            }}
            data-slot="autocomplete-item"
            // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
            role="option"
            className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-zinc-50 hover:bg-zinc-800/70 data-[selected=true]:bg-zinc-800/70",
                className,
            )}
        >
            {icon && (
                <div
                    className={cn(
                        "flex size-8 items-center justify-center rounded-xl bg-zinc-700 [&_svg:not([class*='size-'])]:size-1/2 [&_svg:not([class*='text-'])]:text-zinc-200",
                        classNameIcon,
                    )}
                >
                    {icon}
                </div>
            )}
            {children}
        </div>
    );
}

export function AutocompleteContent({
    className,
    onOpenAutoFocus,
    onInteractOutside,
    ...props
}: React.ComponentProps<typeof PopoverContent>) {
    const { inputRef, resetRef, setFocusedIndex } = useAutocomplete();

    return (
        <PopoverContent
            className={cn("p-3.5", className)}
            onOpenAutoFocus={e => {
                onOpenAutoFocus?.(e);
                e.preventDefault();
                inputRef.current?.focus();
            }}
            onInteractOutside={e => {
                onInteractOutside?.(e);

                if (
                    e.target === inputRef.current ||
                    e.target === resetRef.current
                ) {
                    e.preventDefault();
                }

                setFocusedIndex(null);
            }}
            {...props}
        />
    );
}

export type AutocompleteOptionsProps = {
    labelText?: string;
    emptyText?: string;
    className?: string;
    classNameOption?: string;
    classNameOptionIcon?: string;
    classNameEmpty?: string;
    defaultOptionIcon?: React.ReactNode;
    renderOption?:
        | React.ReactNode
        | ((
              option: AutocompleteOption,
              index: number,
              focusedIndex: number | null,
          ) => React.ReactNode);
    renderEmpty?: React.ReactNode;
} & Omit<React.ComponentProps<"div">, "children">;

export function AutocompleteOptions({
    className,
    classNameOption,
    classNameOptionIcon,
    classNameEmpty,
    defaultOptionIcon,
    renderOption,
    renderEmpty,
    labelText = "Autocomplete options",
    emptyText = "No results found",
    ...props
}: AutocompleteOptionsProps) {
    const {
        id,
        options,
        focusedIndex,
        maxOptions,
        setFocusedIndex,
        setValue,
        setTempQuery,
        setOpen,
        onValueChange,
        onTempQueryChange,
        onSelect,
    } = useAutocomplete();

    const visibleOptions = options.slice(0, maxOptions);

    function getOptionValue(option: AutocompleteOption): string | undefined {
        return isOptionObject(option) ? option?.value : option;
    }

    function handleArrowDown() {
        setFocusedIndex(prev => {
            if (prev === null) {
                const value = getOptionValue(visibleOptions[0]);
                setTempQuery(value ?? "");
                onTempQueryChange?.(value ?? "");
                return 0;
            }

            if (prev === visibleOptions.length - 1) {
                setTempQuery(null);
                onTempQueryChange?.(null);
                return null;
            }

            const nextIndex = prev + 1;
            const value = getOptionValue(visibleOptions[nextIndex]);
            setTempQuery(value ?? "");
            onTempQueryChange?.(value ?? "");
            return nextIndex;
        });
    }

    function handleArrowUp() {
        setFocusedIndex(prev => {
            if (prev === null) {
                const value = getOptionValue(
                    visibleOptions[visibleOptions.length - 1],
                );
                setTempQuery(value ?? "");
                onTempQueryChange?.(value ?? "");
                return visibleOptions.length - 1;
            }

            if (prev === 0) {
                setTempQuery(null);
                onTempQueryChange?.(null);
                return null;
            }

            const prevIndex = prev - 1;
            const value = getOptionValue(visibleOptions[prevIndex]);
            setTempQuery(value ?? "");
            onTempQueryChange?.(value ?? "");
            return prevIndex;
        });
    }

    function handleEnter() {
        if (focusedIndex === null) return;
        const value = getOptionValue(visibleOptions[focusedIndex]);
        setValue(value ?? "");
        onSelect?.(value ?? "");
        setTempQuery(null);
        setOpen(false);
        onValueChange?.(value ?? "");
        onTempQueryChange?.(null);
        setFocusedIndex(null);
    }

    function handleKeyDown(e: KeyboardEvent) {
        const activeElement = document.activeElement;
        const isAutocompleteInput =
            activeElement?.getAttribute("data-slot") === "autocomplete-input";

        if (
            isAutocompleteInput &&
            !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)
        ) {
            return;
        }

        if (!visibleOptions.length) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                handleArrowDown();
                break;
            case "ArrowUp":
                e.preventDefault();
                handleArrowUp();
                break;
            case "Enter":
                e.preventDefault();
                handleEnter();
                break;
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [visibleOptions, focusedIndex]);

    useEffect(() => {
        if (focusedIndex !== null) {
            const focusedElement = document.querySelector(
                `[data-index="${focusedIndex}"]`,
            );
            focusedElement?.scrollIntoView({
                block: "nearest",
            });
        }
    }, [focusedIndex]);

    return (
        <div
            {...props}
            data-slot="autocomplete-options"
            role="listbox"
            tabIndex={-1}
            aria-label={labelText}
            aria-labelledby={`autocomplete-${id}-input`}
            aria-activedescendant={
                focusedIndex !== null
                    ? `autocomplete-${id}-option-${focusedIndex}`
                    : undefined
            }
            className={className}
        >
            {visibleOptions.length === 0 ? (
                <AutocompleteEmpty className={classNameEmpty}>
                    {renderEmpty ?? emptyText}
                </AutocompleteEmpty>
            ) : (
                visibleOptions.map((item, index) => {
                    const normalizedItem =
                        typeof item === "string"
                            ? {
                                  value: item,
                                  content: item,
                                  icon: defaultOptionIcon,
                              }
                            : {
                                  ...item,
                                  icon: item.icon ?? defaultOptionIcon,
                              };

                    return renderOption ? (
                        typeof renderOption === "function" ? (
                            renderOption(normalizedItem, index, focusedIndex)
                        ) : (
                            renderOption
                        )
                    ) : (
                        <AutocompleteOption
                            className={classNameOption}
                            classNameIcon={classNameOptionIcon}
                            key={normalizedItem.value}
                            value={normalizedItem.value}
                            icon={normalizedItem.icon}
                            data-value={normalizedItem.value}
                            data-index={index}
                            aria-selected={focusedIndex === index}
                            data-selected={focusedIndex === index}
                            id={`autocomplete-${id}-option-${index}`}
                        >
                            {normalizedItem.content}
                        </AutocompleteOption>
                    );
                })
            )}
        </div>
    );
}

function isOptionObject(
    option: AutocompleteOption,
): option is AutocompleteOptionObject {
    return (
        typeof option === "object" &&
        option !== null &&
        "value" in option &&
        "content" in option
    );
}
