export function parseGuests(guests?: string): number {
    if (!guests) return 0;

    try {
        const guestCounts = JSON.parse(guests) as Record<string, string>;
        return Object.values(guestCounts).reduce((sum, value) => {
            const num = parseInt(value, 10);
            return sum + (isNaN(num) ? 0 : num);
        }, 0);
    } catch {
        return 0;
    }
}
