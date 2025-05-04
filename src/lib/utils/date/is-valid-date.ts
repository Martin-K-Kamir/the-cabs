export function isValidDate(value: string | null): value is string {
    const date = new Date(value ?? "");
    return !isNaN(date.getTime());
}
