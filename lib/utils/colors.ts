export function stringToColor(str: string) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 60 + (hash % 20);
    const lightness = 45 + (hash % 10);

    return `linear-gradient(135deg, hsl(${hue},70%,50%), hsl(${(hue + 40) % 360},70%,50%))`
}