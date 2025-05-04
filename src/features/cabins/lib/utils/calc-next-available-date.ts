export function calcNextAvailableDate(
    bookings: { startDate: string; endDate: string }[],
    now: Date,
): { from?: Date; to?: Date } {
    if (bookings.length === 0) return { from: now };

    let current = now;
    for (let i = 0; i < bookings.length; i++) {
        const start = new Date(bookings[i].startDate);
        const end = new Date(bookings[i].endDate);

        if (current < start) {
            const gapInDays =
                (start.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
            if (gapInDays >= 2) {
                return { from: current, to: start };
            } else {
                current = end;
                continue;
            }
        }

        if (current >= start && current <= end) {
            current = end;
        }

        if (i === bookings.length - 1) {
            const gapInDays =
                (current.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
            return gapInDays >= 2 ? { from: current } : {};
        }
    }

    return {};
}
