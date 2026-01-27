import ColorThief from "colorthief";

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
