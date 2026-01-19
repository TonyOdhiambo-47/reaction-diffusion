# Debug Prompt for Color Palettes in Reaction-Diffusion Simulator

## Problem Statement

I have a React/TypeScript reaction-diffusion simulator that visualizes Gray-Scott patterns on a black canvas. The current color palettes have **poor contrast** and are **hard to distinguish from each other**. I need 2-3 color palettes that:

1. Have **maximum contrast** - patterns should be clearly visible against the black background
2. Are **visually distinct** from each other - switching between palettes should show obvious differences
3. Work well for visualizing reaction-diffusion patterns (which typically have values in the 0-1 range)

## Current Implementation

The color palettes map a scalar value [0, 1] to RGB colors. Here's the current code:

```typescript
// src/simulation/colorPalettes.ts

export type ColorPalette = (value: number) => [number, number, number];

/**
 * Cyan: Bright cyan/blue on black - maximum contrast, very distinct.
 * Pure cyan to white gradient for excellent visibility.
 */
export const cyan: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  // Pure cyan (0, 255, 255) to white (255, 255, 255)
  const intensity = Math.pow(v, 0.4); // Very sharp contrast curve
  return [
    intensity * 255,
    255,
    255,
  ];
};

/**
 * Green: Bright green on black - maximum contrast, very distinct.
 * Pure green to white gradient for excellent visibility.
 */
export const green: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  // Pure green (0, 255, 0) to white (255, 255, 255)
  const intensity = Math.pow(v, 0.4); // Very sharp contrast curve
  return [
    intensity * 255,
    255,
    intensity * 255,
  ];
};

/**
 * Magenta: Bright magenta/pink on black - maximum contrast, very distinct.
 * Pure magenta to white gradient for excellent visibility.
 */
export const magenta: ColorPalette = (value: number) => {
  const v = Math.max(0, Math.min(1, value));
  // Pure magenta (255, 0, 255) to white (255, 255, 255)
  const intensity = Math.pow(v, 0.4); // Very sharp contrast curve
  return [
    255,
    intensity * 255,
    255,
  ];
};

export const palettes = {
  'Cyan': cyan,
  'Green': green,
  'Magenta': magenta,
} as const;
```

## How Colors Are Applied

The `mapToColor` function processes the simulation values before applying the palette:

```typescript
export function mapToColor(
  u: number,
  v: number,
  palette: ColorPalette,
  mode: 'u' | 'v' | 'uv' | 'difference' = 'uv'
): [number, number, number] {
  let value: number;
  
  switch (mode) {
    case 'uv':
      // Enhanced combination with better contrast
      value = Math.pow((u * 0.6 + v * 0.4), 0.7);
      break;
    // ... other cases
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
```

## Rendering Code

Colors are rendered to a canvas using ImageData:

```typescript
// From useReactionDiffusion.ts
const render = useCallback(() => {
  const canvas = canvasRef.current;
  const state = stateRef.current;
  if (!canvas || !state) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = width;
  canvas.height = height;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Map simulation state to colors
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const u = state.u[idx];
      const v = state.v[idx];
      
      const [r, g, b] = mapToColor(u, v, paletteRef.current, 'uv');
      
      const pixelIdx = (y * width + x) * 4;
      data[pixelIdx] = r;     // R
      data[pixelIdx + 1] = g; // G
      data[pixelIdx + 2] = b; // B
      data[pixelIdx + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}, [width, height]);
```

## The Issue

The current palettes:
- Don't have enough contrast - patterns are hard to see
- Look too similar to each other - switching palettes doesn't show clear differences
- The gradient approach (pure color to white) might not be optimal

## What I Need

Please provide 2-3 color palette functions that:

1. **Maximize contrast** - Use the full brightness range effectively
2. **Are visually distinct** - Each palette should look completely different
3. **Work well for reaction-diffusion patterns** - Should highlight pattern details clearly
4. **Are optimized for black backgrounds** - The canvas background is pure black (#000000)

Consider:
- Using non-linear curves for better contrast
- Different color schemes (not just pure color to white)
- Maybe using complementary colors or high-saturation colors
- Ensuring the palettes are visually distinct from each other

Please provide the complete TypeScript code for 2-3 new palette functions that solve these issues.
