export function formatGuestsSummary(
    adultsNum: number,
    childrenNum: number,
    fallbackMessage = "no guests",
) {
    const adultWord = adultsNum === 1 ? "adult" : "adults";
    const childWord = childrenNum === 1 ? "child" : "children";

    if (adultsNum === 0 && childrenNum === 0) {
        return fallbackMessage;
    }

    if (adultsNum > 0 && childrenNum <= 0) {
        return `${adultsNum} ${adultWord}`;
    }

    if (adultsNum <= 0 && childrenNum > 0) {
        return `${childrenNum} ${childWord}`;
    }

    return `${adultsNum} ${adultWord}, ${childrenNum} ${childWord}`;
}
