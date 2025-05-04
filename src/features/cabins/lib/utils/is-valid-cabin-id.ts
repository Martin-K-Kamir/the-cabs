export function isValidCabinId(value: string | null) {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
}
