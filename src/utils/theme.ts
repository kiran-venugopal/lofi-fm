import svgToMiniDataURI from "mini-svg-data-uri";

export const defaultTheme: Record<ThemeColorType, string> = {
  primary: "#9493fb",
  secondary: "#f2f2f2",
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
  updateCursor();
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

export const getCursorImage = (primary?: string, secondary?: string) => {
  return `<svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_10_12)">
<path d="M6.64113 4.36858C6.40489 4.17388 6.11816 4.05036 5.81438 4.01244C5.5106 3.97451 5.2023 4.02374 4.92544 4.15439C4.64858 4.28503 4.41457 4.49171 4.25071 4.7503C4.08686 5.0089 3.9999 5.30875 4 5.61489V28.213C4 29.7096 5.85654 30.4005 6.83486 29.2705L12.5239 22.6951C12.7513 22.4326 13.0324 22.222 13.3483 22.0777C13.6642 21.9335 14.0074 21.8588 14.3547 21.8588H23.3823C24.8966 21.8588 25.5779 19.9603 24.409 18.9981L6.64113 4.36858Z" fill="${
    primary || "#d070ff"
  }"/>
<path d="M5.92241 5.24064L5.92282 5.24099L23.6907 19.8705L23.6908 19.8706C24.0403 20.1583 23.8372 20.7288 23.3823 20.7288H14.3548C14.3547 20.7288 14.3547 20.7288 14.3547 20.7288C13.8454 20.7287 13.342 20.8382 12.8788 21.0498C12.4155 21.2615 12.0031 21.5702 11.6697 21.9553L11.6694 21.9557L5.98048 28.5308C5.9804 28.5309 5.98033 28.531 5.98026 28.5311C5.68667 28.8698 5.13007 28.6629 5.13007 28.213V5.61489L5.13007 5.61454C5.13004 5.52269 5.15613 5.43274 5.20528 5.35516C5.25444 5.27758 5.32464 5.21558 5.4077 5.17639C5.49076 5.13719 5.58325 5.12242 5.67438 5.1338C5.76552 5.14518 5.85154 5.18223 5.92241 5.24064Z" stroke="${
    secondary || "#8b90ff"
  }" stroke-width="2.26014"/>
</g>
<defs>
<filter id="filter0_d_10_12" x="0.771232" y="0.771232" width="33.9151" height="38.7466" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="3.22877" dy="3.22877"/>
<feGaussianBlur stdDeviation="3.22877"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.28 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10_12"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10_12" result="shape"/>
</filter>
</defs>
</svg>
`;
};

export function updateCursor() {
  const primary = getThemeColor("primary");
  const secondary = getThemeColor("secondary");
  const svgString = getCursorImage(primary, secondary);
  document.body.style.setProperty(
    "cursor",
    `url("${svgToMiniDataURI(svgString)}"), auto`
  );
}
