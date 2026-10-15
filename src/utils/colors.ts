import ColorThief from "colorthief";
import { setThemeColor } from "./theme";

export const extractColorsFromImage = (
    imageUrl: string
): Promise<[number, number, number][]> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            try {
                const colorThief = new ColorThief();
                const palette = colorThief.getPalette(img, 2); // Get 2 dominant colors
                resolve(palette);
            } catch (error) {
                console.error("Error extracting colors:", error);
                reject(error);
            }
        };

        img.onerror = (error) => {
            console.error("Error loading image for color extraction:", error);
            reject(error);
        };
    });
};

export function rgbToHex(rgb: [number, number, number]): string {
    return `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

export function getThemeSourceImageUrl(
    bgImgUrl?: string,
    activeSong?: string,
    isPlaying?: boolean
): string | undefined {
    if (bgImgUrl) {
        return bgImgUrl;
    }
    if (!isPlaying) {
        return "/synthwave-visualizer-bg.svg";
    }
    if (activeSong) {
        return `https://img.youtube.com/vi/${activeSong}/maxresdefault.jpg`;
    }
}

async function extractAndApply(imageUrl: string) {
    const colors = await extractColorsFromImage(imageUrl);
    if (!colors || colors.length < 2) {
        return null;
    }
    const primary = rgbToHex(colors[0]);
    const secondary = rgbToHex(colors[1]);
    setThemeColor("primary", primary);
    setThemeColor("secondary", secondary);
    return { primary, secondary };
}

export async function applyThemeFromImageUrl(imageUrl: string) {
    if (imageUrl.includes("synthwave-visualizer-bg.svg")) {
        const primary = "#893f92";
        let secondary = "#ffe600";
        try {
            const colors = await extractColorsFromImage(imageUrl);
            if (colors && colors.length > 0) {
                for (const c of colors) {
                    const hex = rgbToHex(c);
                    const [r, g, b] = c;
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    if (hex.toLowerCase() !== primary.toLowerCase() && brightness > 50) {
                        secondary = hex;
                        break;
                    }
                }
            }
        } catch {
            // Fallback to vibrant synthwave secondary color
        }
        setThemeColor("primary", primary);
        setThemeColor("secondary", secondary);
        return { primary, secondary };
    }

    try {
        return await extractAndApply(imageUrl);
    } catch (e) {
        if (imageUrl.includes("maxresdefault")) {
            try {
                return await extractAndApply(
                    imageUrl.replace("maxresdefault", "hqdefault")
                );
            } catch (e2) {
                console.error("Failed to extract colors from fallback thumbnail", e2);
                return null;
            }
        }
        console.error("Failed to extract colors", e);
        return null;
    }
}
