export function generateRandomSlug(length = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
