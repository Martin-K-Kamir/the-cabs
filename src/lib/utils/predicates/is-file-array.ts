export function isFileArray(value: unknown): value is File[] {
    return Array.isArray(value) && value.every(f => f instanceof File);
}
