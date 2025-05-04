export function parseDateRange(dates?: string) {
    if (!dates) return undefined;
    try {
        return JSON.parse(dates) as { from: string; to?: string };
    } catch {
        return undefined;
    }
}
