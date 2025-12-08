/**
 * Color palette functions for visualizing reaction-diffusion patterns.
 * Each function maps a scalar value [0, 1] to RGB color.
 * Optimized for black backgrounds with high contrast.
 */

export type ColorPalette = (value: number) => [number, number, number];

/**
 * Electric Yellow: High contrast yellow/cyan gradient for black backgrounds.
 */
export const electricYellow: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  // Bright yellow to cyan gradient
  if (v < 0.5) {
    const t = v * 2;
    return [255, 255 * t, 0];
  } else {
    const t = (v - 0.5) * 2;
    return [255 * (1 - t), 255, 255 * t];
  }
};

/**
 * Neon Gold: Rich gold/yellow with high brightness.
 */
export const neonGold: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  const intensity = Math.pow(v, 0.7);
  return [
    255 * intensity,
    215 * intensity,
    0,
  ];
};

/**
 * Plasma Fire: Yellow/orange/red gradient.
 */
export const plasmaFire: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  if (v < 0.33) {
    const t = v / 0.33;
    return [255, 255 * t, 0];
  } else if (v < 0.66) {
    const t = (v - 0.33) / 0.33;
    return [255, 255, t * 100];
  } else {
    const t = (v - 0.66) / 0.34;
    return [255, 255 - t * 100, t * 50];
  }
};

/**
 * Cyber Yellow: Electric yellow with cyan highlights.
 */
export const cyberYellow: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  const phase = v * Math.PI * 2;
  const r = Math.sin(phase) * 0.5 + 0.5;
  const g = Math.sin(phase + Math.PI * 0.3) * 0.5 + 0.5;
  const b = Math.sin(phase + Math.PI) * 0.3 + 0.2;
  return [
    Math.pow(r, 0.5) * 255,
    Math.pow(g, 0.5) * 255,
    Math.pow(b, 0.5) * 200,
  ];
};

/**
 * Aurora Gold: Yellow/green/cyan aurora effect.
 */
export const auroraGold: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  const phase = v * Math.PI * 3;
  const r = Math.sin(phase) * 0.4 + 0.6;
  const g = Math.sin(phase + Math.PI * 0.3) * 0.4 + 0.6;
  const b = Math.sin(phase + Math.PI * 1.5) * 0.3 + 0.3;
  return [
    Math.pow(r, 0.6) * 255,
    Math.pow(g, 0.6) * 255,
    Math.pow(b, 0.6) * 200,
  ];
};

/**
 * Solar Flare: Bright yellow/white with orange.
 */
export const solarFlare: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  if (v < 0.6) {
    const t = v / 0.6;
    return [255, 200 + t * 55, t * 100];
  } else {
    const t = (v - 0.6) / 0.4;
    return [255, 255, 100 + t * 155];
  }
};

/**
 * Monochrome: High contrast white for black backgrounds.
 */
export const monochrome: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  const intensity = Math.pow(v, 0.6);
  return [intensity * 255, intensity * 255, intensity * 255];
};

export const palettes = {
  'Electric Yellow': electricYellow,
  'Neon Gold': neonGold,
  'Plasma Fire': plasmaFire,
  'Cyber Yellow': cyberYellow,
  'Aurora Gold': auroraGold,
  'Solar Flare': solarFlare,
  'Monochrome': monochrome,
} as const;

export type PaletteName = keyof typeof palettes;

/**
 * Map simulation state to color using a palette.
 * Enhanced with better contrast and vibrancy for black backgrounds.
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
      // Enhanced combination with better contrast
      value = Math.pow((u * 0.6 + v * 0.4), 0.7);
      break;
    case 'difference':
      value = Math.abs(u - v);
      break;
    default:
      value = Math.pow((u * 0.6 + v * 0.4), 0.7);
  }
  
  // Apply palette
  const [r, g, b] = palette(value);
  
  // Boost brightness for black backgrounds
  const max = Math.max(r, g, b);
  if (max > 0) {
    const factor = 1.2; // Increased brightness
    return [
      Math.min(255, r * factor),
      Math.min(255, g * factor),
      Math.min(255, b * factor),
    ];
  }
  
  return [r, g, b];
}
