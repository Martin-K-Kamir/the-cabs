export function calcBreakfastPrice({
    breakfastPrice,
    numOfNights,
    numOfGuests,
}: {
    breakfastPrice: number;
    numOfNights: number;
    numOfGuests: number;
}) {
    return breakfastPrice * numOfNights * numOfGuests;
}
