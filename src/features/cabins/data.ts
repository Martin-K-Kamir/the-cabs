import type { CabinInfoItem, CabinCategorizedItem } from "./lib/types";

export const fakeCabinAmenities = [
    { icon: "chefHat", label: "Chef-Prepared Breakfast" },
    { icon: "refreshCw", label: "24/7 Concierge Service" },
    { icon: "cylinder", label: "Private Hot Tub" },
    { icon: "wifi", label: "High-Speed Wi-Fi" },
    { icon: "flame", label: "Indoor Fireplace" },
    { icon: "tvMinimalPlay", label: "Streaming Services Included" },
    { icon: "popcorn", label: "Home Cinema" },
    { icon: "plugZap", label: "EV Charging Station" },
    { icon: "squareParking", label: "Private Parking" },
    { icon: "beef", label: "Outdoor Grill" },
    { icon: "heater", label: "Heated Floors" },
    { icon: "utensils", label: "Fully Equipped Kitchen" },
] satisfies CabinInfoItem[];

export const fakeCabinCategorizedAmenities = [
    {
        label: "Comfort & Sleeping",
        items: [
            { icon: "bedDouble", label: "King-Sized Bed" },
            { icon: "cloud", label: "Memory Foam Mattress" },
            { icon: "heater", label: "Heated Floors" },
            { icon: "flame", label: "Underfloor Heating" },
            { icon: "shirt", label: "Walk-in Closet" },
            { icon: "blinds", label: "Remote-Controlled Blinds" },
            { icon: "lampCeiling", label: "Mood Lighting" },
            { icon: "baby", label: "Baby Crib (on request)" },
        ],
    },
    {
        label: "Kitchen & Dining",
        items: [
            { icon: "chefHat", label: "Chef-Prepared Breakfast" },
            { icon: "utensils", label: "Fully Equipped Kitchen" },
            { icon: "coffee", label: "Espresso Machine" },
            { icon: "wine", label: "Wine Fridge" },
            { icon: "beef", label: "Outdoor Grill" },
            { icon: "apple", label: "Pantry Essentials" },
            { icon: "cookingPot", label: "High-End Cookware" },
            { icon: "glassWater", label: "Filtered Drinking Water" },
            { icon: "beer", label: "Mini Bar" },
            { icon: "coffee", label: "Complimentary Coffee & Tea" },
            { icon: "handPlatter", label: "Outdoor Dining Area" },
            { icon: "martini", label: "Welcome Basket" },
        ],
    },
    {
        label: "Wellness & Bathroom",
        items: [
            { icon: "cylinder", label: "Private Hot Tub" },
            { icon: "bath", label: "Soaking Bathtub" },
            { icon: "showerHead", label: "Rainfall Shower" },
            { icon: "flame", label: "Indoor Fireplace" },
            { icon: "heater", label: "Private Sauna" },
            { icon: "axe", label: "Hair Dryer" },
        ],
    },
    {
        label: "Entertainment & Leisure",
        items: [
            { icon: "tv", label: "Smart TV" },
            { icon: "popcorn", label: "Home Cinema" },
            { icon: "tvMinimalPlay", label: "Streaming Services Included" },
            { icon: "projector", label: "Streaming Projector" },
            { icon: "speaker", label: "Sound System" },
            { icon: "speaker", label: "Bluetooth Speaker" },
            { icon: "gamepad2", label: "Game Console" },
            { icon: "dices", label: "Board Games & Cards" },
            { icon: "library", label: "Library / Book Collection" },
            { icon: "blocks", label: "Children’s Books & Toys" },
            { icon: "shoppingBasket", label: "Picnic Area" },
        ],
    },

    {
        label: "Work & Technology",
        items: [
            { icon: "monitorSmartphone", label: "Work Desk" },
            { icon: "armchair", label: "Office Chair" },
            { icon: "wifi", label: "High-Speed Wi-Fi" },
            { icon: "lightbulb", label: "Smart Lighting System" },
            { icon: "tabletSmartphone", label: "Smart Thermostat" },
            { icon: "keyRound", label: "Keyless Entry" },
            { icon: "cctv", label: "Security System" },
        ],
    },
    {
        label: "Outdoors & Views",
        items: [
            { icon: "mountainSnow", label: "Mountain Views" },
            { icon: "fence", label: "Balcony / Terrace" },
            { icon: "flameKindling", label: "Fire Pit" },
            { icon: "footprints", label: "Hiking Trails Nearby" },
            { icon: "bike", label: "Bike Storage" },
            { icon: "grid2x2", label: "Panoramic Windows" },
        ],
    },
    {
        label: "Parking & Travel",
        items: [
            { icon: "plugZap", label: "EV Charging Station" },
            { icon: "squareParking", label: "Private Parking" },
            { icon: "luggage", label: "Luggage Rack" },
        ],
    },
    {
        label: "Family & Pets",
        items: [
            { icon: "pawPrint", label: "Pet-Friendly" },
            { icon: "baby", label: "Baby Crib (on request)" },
            { icon: "blocks", label: "Children’s Books & Toys" },
        ],
    },
    {
        label: "Guest Experience",
        items: [
            { icon: "refreshCw", label: "24/7 Concierge Service" },
            { icon: "donut", label: "Locally Sourced Snacks" },
            { icon: "book", label: "Personalized Guest Book" },
        ],
    },
    {
        label: "Safety & Essentials",
        items: [
            { icon: "washingMachine", label: "Washer & Dryer" },
            { icon: "anvil", label: "Cleaning Supplies Provided" },
            { icon: "briefcaseMedical", label: "First Aid Kit" },
            { icon: "alarmSmoke", label: "Smoke & CO Detectors" },
        ],
    },
] satisfies CabinCategorizedItem[];

export const tempLocations = [
    "Austria",
    "Czechia",
    "Greece",
    "Iceland",
    "Italy",
    "Norway",
    "Portugal",
    "Switzerland",
];

export const tempGuests = [
    {
        id: "adults",
        title: "Adults",
        description: "Ages 18 and up",
        min: 0,
    },
    {
        id: "children",
        title: "Children",
        description: "Ages 17 and under",
        min: 0,
    },
] as const;
