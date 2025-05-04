import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
);
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                    extensions?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            bookings: {
                Row: {
                    breakfastPaid: number;
                    breakfastPrice: number;
                    breakfastRefund: number;
                    cabinId: number;
                    cabinPaid: number;
                    cabinPrice: number;
                    cabinRefund: number;
                    createdAt: string;
                    endDate: string;
                    guestId: number;
                    id: number;
                    isBreakfast: boolean;
                    numOfGuests: number;
                    observations: string;
                    startDate: string;
                    status: string;
                    totalPaid: number;
                    totalPrice: number;
                    totalRefund: number;
                };
                Insert: {
                    breakfastPaid?: number;
                    breakfastPrice: number;
                    breakfastRefund?: number;
                    cabinId: number;
                    cabinPaid?: number;
                    cabinPrice: number;
                    cabinRefund?: number;
                    createdAt?: string;
                    endDate: string;
                    guestId: number;
                    id?: number;
                    isBreakfast: boolean;
                    numOfGuests: number;
                    observations: string;
                    startDate: string;
                    status: string;
                    totalPaid?: number;
                    totalPrice: number;
                    totalRefund?: number;
                };
                Update: {
                    breakfastPaid?: number;
                    breakfastPrice?: number;
                    breakfastRefund?: number;
                    cabinId?: number;
                    cabinPaid?: number;
                    cabinPrice?: number;
                    cabinRefund?: number;
                    createdAt?: string;
                    endDate?: string;
                    guestId?: number;
                    id?: number;
                    isBreakfast?: boolean;
                    numOfGuests?: number;
                    observations?: string;
                    startDate?: string;
                    status?: string;
                    totalPaid?: number;
                    totalPrice?: number;
                    totalRefund?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "bookings_cabinId_fkey";
                        columns: ["cabinId"];
                        isOneToOne: false;
                        referencedRelation: "cabins";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "bookings_guestId_fkey";
                        columns: ["guestId"];
                        isOneToOne: false;
                        referencedRelation: "guests";
                        referencedColumns: ["id"];
                    },
                ];
            };
            cabins: {
                Row: {
                    createdAt: string;
                    description: string;
                    discount: number;
                    id: number;
                    images: string[];
                    locationId: number;
                    maxNumOfGuests: number;
                    name: string;
                    price: number;
                };
                Insert: {
                    createdAt?: string;
                    description?: string;
                    discount?: number;
                    id?: number;
                    images: string[];
                    locationId?: number;
                    maxNumOfGuests?: number;
                    name?: string;
                    price?: number;
                };
                Update: {
                    createdAt?: string;
                    description?: string;
                    discount?: number;
                    id?: number;
                    images?: string[];
                    locationId?: number;
                    maxNumOfGuests?: number;
                    name?: string;
                    price?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "cabins_locationId_fkey";
                        columns: ["locationId"];
                        isOneToOne: false;
                        referencedRelation: "locations";
                        referencedColumns: ["id"];
                    },
                ];
            };
            guests: {
                Row: {
                    avatar: string | null;
                    createdAt: string;
                    email: string;
                    id: number;
                    name: string;
                    phone: string | null;
                };
                Insert: {
                    avatar?: string | null;
                    createdAt?: string;
                    email: string;
                    id?: number;
                    name: string;
                    phone?: string | null;
                };
                Update: {
                    avatar?: string | null;
                    createdAt?: string;
                    email?: string;
                    id?: number;
                    name?: string;
                    phone?: string | null;
                };
                Relationships: [];
            };
            locations: {
                Row: {
                    address: string;
                    city: string;
                    country: string;
                    createdAt: string;
                    id: number;
                    postalCode: string;
                };
                Insert: {
                    address: string;
                    city: string;
                    country: string;
                    createdAt?: string;
                    id?: number;
                    postalCode: string;
                };
                Update: {
                    address?: string;
                    city?: string;
                    country?: string;
                    createdAt?: string;
                    id?: number;
                    postalCode?: string;
                };
                Relationships: [];
            };
            reviews: {
                Row: {
                    cabinId: number;
                    categoryRatings: Json[];
                    createdAt: string;
                    description: string;
                    guestId: number;
                    id: number;
                    rating: number;
                    title: string;
                };
                Insert: {
                    cabinId: number;
                    categoryRatings?: Json[];
                    createdAt?: string;
                    description?: string;
                    guestId: number;
                    id?: number;
                    rating: number;
                    title?: string;
                };
                Update: {
                    cabinId?: number;
                    categoryRatings?: Json[];
                    createdAt?: string;
                    description?: string;
                    guestId?: number;
                    id?: number;
                    rating?: number;
                    title?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "reviews_cabinId_fkey";
                        columns: ["cabinId"];
                        isOneToOne: false;
                        referencedRelation: "cabins";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "reviews_guestId_fkey";
                        columns: ["guestId"];
                        isOneToOne: false;
                        referencedRelation: "guests";
                        referencedColumns: ["id"];
                    },
                ];
            };
            settings: {
                Row: {
                    breakfastPrice: number;
                    createdAt: string;
                    id: number;
                    maxNights: number;
                    minNights: number;
                };
                Insert: {
                    breakfastPrice: number;
                    createdAt?: string;
                    id?: number;
                    maxNights: number;
                    minNights: number;
                };
                Update: {
                    breakfastPrice?: number;
                    createdAt?: string;
                    id?: number;
                    maxNights?: number;
                    minNights?: number;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof Database },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
    ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const;
