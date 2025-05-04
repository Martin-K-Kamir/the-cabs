"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { TextableBlock } from "@/components/ui/textable-block";

type CounterGroupContextValue = {
    groupCount: number;
    groupMin: number;
    groupMax: number;
    groupIncrement: () => void;
    groupDecrement: () => void;
};

const CounterGroupContext = createContext<CounterGroupContextValue | null>(
    null,
);

export type CounterGroupProps = {
    max: number;
    min?: number;
    value?: number;
} & React.ComponentProps<"div">;

export function CounterGroup({
    children,
    className,
    max,
    min = 0,
    value = 0,
    ...props
}: CounterGroupProps) {
    if (min > max) {
        throw new Error("min cannot be greater than max in <CounterGroup/>");
    }

    const [count, setCount] = useState(value);

    const increment = useCallback(() => {
        setCount(prevCount => Math.min(prevCount + 1, max));
    }, [max]);

    const decrement = useCallback(() => {
        setCount(prevCount => Math.max(prevCount - 1, min));
    }, [min]);

    return (
        <div {...props} className={cn("", className)}>
            <CounterGroupContext.Provider
                value={{
                    groupMin: min,
                    groupMax: max,
                    groupCount: count,
                    groupIncrement: increment,
                    groupDecrement: decrement,
                }}
            >
                {children}
            </CounterGroupContext.Provider>
        </div>
    );
}

export function useCounterGroup() {
    const context = useContext(CounterGroupContext);

    return context;
}

type CounterContextValue = {
    count: number;
    min: number;
    max: number;
    increment: () => void;
    decrement: () => void;
};

const CounterContext = createContext<CounterContextValue | null>(null);

export type CounterProps = {
    min?: number;
    max?: number;
    value?: number;
} & React.ComponentProps<"div">;

export function Counter({
    children,
    className,
    value = 0,
    min = 0,
    max = Infinity,
    ...props
}: CounterProps) {
    if (min > max) {
        throw new Error("min cannot be greater than max in <Counter/>");
    }

    const [count, setCount] = useState(value);

    const increment = useCallback(() => {
        setCount(prevCount => Math.min(prevCount + 1, max));
    }, [max]);

    const decrement = useCallback(() => {
        setCount(prevCount => Math.max(prevCount - 1, min));
    }, [min]);

    useEffect(() => {
        setCount(value);
    }, [value]);

    return (
        <div {...props} className={cn("flex items-center gap-3", className)}>
            <CounterContext.Provider
                value={{
                    count,
                    min,
                    max,
                    increment,
                    decrement,
                }}
            >
                {children}
            </CounterContext.Provider>
        </div>
    );
}

export function useCounter() {
    const context = useContext(CounterContext);
    if (!context) {
        throw new Error("useCounter must be used within a <Counter/>");
    }
    return context;
}

export function CounterDisplay({
    children,
    asChild,
    ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
    children?: React.ReactNode | ((count: number) => React.ReactNode);
    asChild?: boolean;
}) {
    const { count } = useCounter();
    const Comp = asChild ? Slot : "span";

    return (
        <Comp {...props}>
            {children !== undefined
                ? typeof children === "function"
                    ? children(count)
                    : children
                : count}
        </Comp>
    );
}

type CounterButtonProps = React.ComponentProps<typeof Button>;
type CounterIncrementHandlers = {
    onIncrement?: (count: number) => void;
    onGroupIncrement?: (count: number) => void;
};

type CounterDecrementHandlers = {
    onDecrement?: (count: number) => void;
    onGroupDecrement?: (count: number) => void;
};

export function CounterIncrementButton({
    children,
    className,
    variant = "tertiary",
    size = "icon",
    onIncrement,
    onGroupIncrement,
    ...props
}: CounterButtonProps & CounterIncrementHandlers) {
    const { increment, max, count } = useCounter();
    const { groupIncrement, groupMax, groupCount } = useCounterGroup() ?? {};

    return (
        <Button
            type="button"
            disabled={
                (groupCount && groupMax && groupCount >= groupMax) ||
                count >= max
            }
            onClick={() => {
                increment();
                groupIncrement?.();
                onIncrement?.(count + 1);
                onGroupIncrement?.(groupCount ? groupCount + 1 : 0);
            }}
            variant={variant}
            size={size}
            className={cn("disabled:opacity-40", className)}
            {...props}
        >
            {children ?? <PlusIcon />}
        </Button>
    );
}

export function CounterDecrementButton({
    children,
    className,
    variant = "tertiary",
    size = "icon",
    onDecrement,
    onGroupDecrement,
    ...props
}: CounterButtonProps & CounterDecrementHandlers) {
    const { decrement, min, count } = useCounter();
    const { groupDecrement, groupMin, groupCount } = useCounterGroup() ?? {};

    return (
        <Button
            type="button"
            disabled={
                (groupCount && groupMin && groupCount <= groupMin) ||
                count <= min
            }
            onClick={() => {
                decrement();
                groupDecrement?.();
                onDecrement?.(count - 1);
                onGroupDecrement?.(groupCount ? groupCount - 1 : 0);
            }}
            variant={variant}
            size={size}
            className={cn("disabled:opacity-40", className)}
            {...props}
        >
            {children ?? <MinusIcon />}
        </Button>
    );
}

export function SimpleCounter({
    onChange,
    onGroupChange,
    onIncrement,
    onGroupIncrement,
    onDecrement,
    onGroupDecrement,
    value,
    variant,
    size,
    classNameButtons,
    ...props
}: Omit<CounterProps, "onChange"> &
    CounterDecrementHandlers &
    CounterIncrementHandlers &
    Pick<CounterButtonProps, "variant" | "size"> & {
        value?: number;
        onChange?: (count: number) => void;
        onGroupChange?: (count: number) => void;
        classNameButtons?: string;
    }) {
    return (
        <Counter {...props} value={value}>
            <CounterDecrementButton
                className={classNameButtons}
                variant={variant}
                size={size}
                onDecrement={count => {
                    onDecrement?.(count);
                    onChange?.(count);
                }}
                onGroupDecrement={count => {
                    onGroupDecrement?.(count);
                    onGroupChange?.(count);
                }}
            />
            <CounterDisplay />
            <CounterIncrementButton
                className={classNameButtons}
                variant={variant}
                size={size}
                onIncrement={count => {
                    onIncrement?.(count);
                    onChange?.(count);
                }}
                onGroupIncrement={count => {
                    onGroupIncrement?.(count);
                    onGroupChange?.(count);
                }}
            />
        </Counter>
    );
}

export function ItemsCounter<TKey extends string>({
    items,
    value,
    onChange,
    ...props
}: {
    items: readonly {
        id: TKey;
        title: string;
        description: string;
        icon?: React.ReactNode;
        min?: number;
        max?: number;
    }[];
    value: Record<TKey, number>;
    onChange: (values: Record<TKey, number>) => void;
} & Omit<CounterGroupProps, "value" | "onChange">) {
    return (
        <CounterGroup
            {...props}
            value={(Object.values(value) as number[]).reduce(
                (acc, curr) => acc + curr,
            )}
        >
            {items.map(item => (
                <div
                    key={item.id}
                    className="flex items-center justify-between"
                >
                    <TextableBlock
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        classNameTitle="text-base leading-none"
                    />
                    <SimpleCounter
                        value={value[item.id]}
                        min={item.min ?? 0}
                        max={item.max ?? Infinity}
                        onChange={count => {
                            onChange({
                                ...value,
                                [item.id]: count,
                            });
                        }}
                    />
                </div>
            ))}
        </CounterGroup>
    );
}
