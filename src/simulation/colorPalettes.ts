export type ColorPalette = (value: number) => [number, number, number];

/**
 * Fire: Black → Deep Red → Orange → Yellow → White
 */
export const fire: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  
  if (v < 0.25) {
    const t = v / 0.25;
    return [
      Math.floor(t * 80),
      0,
      Math.floor(t * 40),
    ];
  } else if (v < 0.5) {
    // Deep red to orange
    const t = (v - 0.25) / 0.25;
    return [
      Math.floor(80 + t * 175),
      Math.floor(t * 50),
      Math.floor(40 - t * 40),
    ];
  } else if (v < 0.75) {
    // Orange to yellow
    const t = (v - 0.5) / 0.25;
    return [
      255,
      Math.floor(50 + t * 180),
      0,
    ];
  } else {
    // Yellow to white
    const t = (v - 0.75) / 0.25;
    return [
      255,
      Math.floor(230 + t * 25),
      Math.floor(t * 255),
    ];
  }
};

/**
 * Cool: Black → Deep Blue → Purple → Magenta → White
 */
export const cool: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  
  if (v < 0.25) {
    const t = v / 0.25;
    return [
      0,
      0,
      Math.floor(t * 80),
    ];
  } else if (v < 0.5) {
    // Deep blue to purple
    const t = (v - 0.25) / 0.25;
    return [
      Math.floor(t * 100),
      0,
      Math.floor(80 + t * 100),
    ];
  } else if (v < 0.75) {
    // Purple to magenta
    const t = (v - 0.5) / 0.25;
    return [
      Math.floor(100 + t * 155),
      0,
      255,
    ];
  } else {
    // Magenta to white
    const t = (v - 0.75) / 0.25;
    return [
      255,
      Math.floor(t * 255),
      255,
    ];
  }
};

/**
 * Green: Black → Dark Green → Cyan → White
 */
export const green: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  
  if (v < 0.25) {
    const t = v / 0.25;
    return [
      0,
      Math.floor(t * 60),
      0,
    ];
  } else if (v < 0.5) {
    // Dark green to teal
    const t = (v - 0.25) / 0.25;
    return [
      0,
      Math.floor(60 + t * 100),
      Math.floor(t * 120),
    ];
  } else if (v < 0.75) {
    // Teal to cyan
    const t = (v - 0.5) / 0.25;
    return [
      0,
      Math.floor(160 + t * 95),
      Math.floor(120 + t * 135),
    ];
  } else {
    // Cyan to white
    const t = (v - 0.75) / 0.25;
    return [
      Math.floor(t * 255),
      255,
      255,
    ];
  }
};

export const palettes = {
  'Fire': fire,
  'Cool': cool,
  'Green': green,
} as const;

export type PaletteName = keyof typeof palettes;

/**
 * Maps simulation concentrations (u, v) to RGB color using the specified palette.
 */
export function mapToColor(
  u: number,
  v: number,
  palette: ColorPalette,
  mode: 'u' | 'v' | 'uv' | 'difference' = 'uv'
): [number, number, number] {
  let value: number;
  
  switch (mode) {
    case 'u':
      value = u;
      break;
    case 'v':
      value = v;
      break;
    case 'uv':
      value = Math.pow((u * 0.6 + v * 0.4), 0.7);
      break;
    case 'difference':
      value = Math.abs(u - v);
      break;
    default:
      value = Math.pow((u * 0.6 + v * 0.4), 0.7);
  }
  
  const [r, g, b] = palette(value);
  return [r, g, b];
}
