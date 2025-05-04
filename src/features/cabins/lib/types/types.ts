import type { Brand } from "@/lib/types";
import type { Tables } from "@/services/supabase";
import { CABIN_ICONS_MAP } from "../constants";

export type CabinId = Brand<Tables<"cabins">["id"], "CabinId">;
export type CabinItem = Omit<Tables<"cabins">, "id"> & {
    id: CabinId;
};

export type CabinLocation = Tables<"locations">;

export type CabinPreviewLocation = Pick<
    CabinLocation,
    "city" | "country" | "address"
>;

export type CabinPreview = Omit<
    CabinItem,
    "createdAt" | "description" | "maxNumOfGuests" | "locationId"
> & {
    location: CabinPreviewLocation;
    nextAvailableDate?: {
        from?: Date;
        to?: Date;
    };
};

export type CabinWithPreviewLocation = CabinItem & {
    locations: CabinPreviewLocation;
};

export type CabinInfoItem = {
    icon: keyof typeof CABIN_ICONS_MAP;
    label: string;
};

export type CabinCategorizedItem = {
    label: string;
    items: CabinInfoItem[];
};

type Guest = Tables<"guests">;

export type CabinCategoryItem = {
    id: string;
    name: string;
    rating: number;
};

export type CabinReviewItem = Omit<
    Tables<"reviews">,
    "categoryRatings" | "cabinId"
> & {
    categoryRatings: CabinCategoryItem[];
    guestName: Guest["name"];
    guestAvatar: string;
    cabinId: CabinId;
};
