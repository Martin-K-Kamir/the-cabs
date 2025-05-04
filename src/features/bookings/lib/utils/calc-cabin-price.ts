export function calcCabinPrice({
    price,
    discount = 0,
    numOfNights,
}: {
    price: number;
    discount?: number;
    numOfNights: number;
}) {
    return (price - discount) * numOfNights;
}
