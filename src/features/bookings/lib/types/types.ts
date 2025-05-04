import type {
    CabinId,
    CabinItem,
    CabinLocation,
    CabinPreviewLocation,
} from "@/features/cabins";
import type { User, UserId } from "@/features/user";
import type { Brand } from "@/lib/types";
import type { Tables } from "@/services/supabase";

export type BookingId = Brand<Tables<"bookings">["id"], "BookingId">;
export type BookingSettings = Omit<Tables<"settings">, "id" | "createdAt">;

export type WithCabin = {
    cabins: CabinItem;
};

export type WithCabinLocation = {
    cabins: CabinItem & {
        locations: CabinLocation;
    };
};

export type WithCabinPreviewLocation = {
    cabins: CabinItem & {
        locations: CabinPreviewLocation;
    };
};

export type WithCabinName = {
    cabins: { name: CabinItem["name"] };
};

export type WithUser = {
    guests: User;
};

export type WithId = {
    id: BookingId;
};

export type WithUserId = {
    guestId: UserId;
};

export type WithBookingStatus = {
    status: BookingStatus;
};

export type BaseBookingItem = Omit<
    Tables<"bookings">,
    "status" | "id" | "guestId"
> &
    WithId &
    WithBookingStatus &
    WithUserId;
export type BookingStatus =
    | "confirmed"
    | "checked-in"
    | "checked-out"
    | "canceled"
    | "pending";

export type BookingItem = BaseBookingItem & WithCabinLocation & WithUser;

export type BookingPreviewItem = Pick<
    Tables<"bookings">,
    "startDate" | "endDate" | "totalPrice" | "isBreakfast" | "numOfGuests"
> & {
    id: BookingId;
    guestId: UserId;
    startDate: Date;
    endDate: Date;
    cabin: Pick<CabinItem, "name" | "images"> & {
        location: CabinPreviewLocation;
        id: CabinId;
    };
    status: BookingStatus;
};

export type BookingPreviewItemRaw = Pick<
    Tables<"bookings">,
    "startDate" | "endDate" | "totalPrice" | "isBreakfast" | "numOfGuests"
> & {
    id: BookingId;
    guestId: UserId;
    status: BookingStatus;
    cabins: Pick<CabinItem, "name" | "images"> & {
        locations: CabinPreviewLocation;
        id: CabinId;
    };
};

export type NewBookingRaw = Pick<
    Tables<"bookings">,
    | "cabinPrice"
    | "breakfastPrice"
    | "isBreakfast"
    | "numOfGuests"
    | "totalPrice"
> & {
    cabinId: CabinId;
    startDate: Date;
    endDate: Date;
};

export type NewBooking = Omit<
    Tables<"bookings">,
    | "id"
    | "cabinId"
    | "guestId"
    | "status"
    | "createdAt"
    | "startDate"
    | "endDate"
> & {
    cabinId: CabinId;
    guestId: UserId;
    status: BookingStatus;
    startDate: Date;
    endDate: Date;
};
