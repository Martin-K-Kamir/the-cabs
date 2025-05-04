export function getFileExtension(url: string): string | null {
    const match = url.match(/\.(jpg|jpeg|webp)$/i);
    return match ? match[1] : null;
}
