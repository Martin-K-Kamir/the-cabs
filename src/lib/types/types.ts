/* eslint-disable @typescript-eslint/no-explicit-any */

declare const brand: unique symbol;

export type Brand<T, TBrand> = T & { [brand]: TBrand };

type GetEventHandlers<T extends keyof React.JSX.IntrinsicElements> = Extract<
    keyof React.JSX.IntrinsicElements[T],
    `on${string}`
>;

export type EventFor<
    TElement extends keyof React.JSX.IntrinsicElements,
    THandler extends GetEventHandlers<TElement>,
> = React.JSX.IntrinsicElements[TElement][THandler] extends
    | ((e: infer TEvent) => any)
    | undefined
    ? TEvent
    : never;

export type DateRange = {
    from: Date;
    to: Date;
};

export type Location = {
    address: string;
    city: string;
    country: string;
};

export type Guests = {
    adults: number;
    children: number;
};

export type Url = Brand<`https://${string}`, "Url">;

export type UploadableEntity = {
    orderId: number;
    file: File;
    name: string;
    urlPath: Url;
};
