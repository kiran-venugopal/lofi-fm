export const defaultTheme: Record<ThemeColorType, string> = {
  primary: "#d070ff",
  secondary: "#8b91ff",
};

export type ThemeColorType = "primary" | "secondary";

export function initTheme() {
  (Object.keys(defaultTheme) as ThemeColorType[]).forEach((type) => {
    const color = getThemeColor(type);
    const docColor = document.body.style
      .getPropertyValue(`--${type}_color`)
      .trim();
    if (docColor !== color) {
      setThemeColor(type, color);
    }
  });
}

export function getThemeColor(type: ThemeColorType = "primary") {
  const color = window.localStorage.getItem(`${type}_color`);

  if (color) {
    return color;
  } else {
    setThemeColor(type, defaultTheme[type]);
    return defaultTheme[type];
  }
}

export function setThemeColor(type: ThemeColorType, color: string) {
  window.document.body.style.setProperty(`--${type}_color`, color);
  window.localStorage.setItem(`${type}_color`, color);
}

export function hexToRgb(hex: string, opacity = 1) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb${parseInt(result[1], 16)},
    ${parseInt(result[2], 16)},
    ${parseInt(result[3], 16)} / ${opacity ?? 1})`
    : null;
}
