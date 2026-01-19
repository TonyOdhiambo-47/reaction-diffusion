import type { GrayScottParams } from './grayScott';

export interface Preset {
  name: string;
  description: string;
  params: GrayScottParams;
  seedType: 'center' | 'random' | 'multiple';
}

/**
 * Parameter presets for common pattern types.
 */
export const presets: Preset[] = [
  {
    name: 'Leopard Spots',
    description: 'Classic spotted pattern resembling animal coat markings',
    params: {
      du: 0.16,
      dv: 0.08,
      f: 0.035,
      k: 0.065,
    },
    seedType: 'center',
  },
  {
    name: 'Zebra Stripes',
    description: 'Parallel stripes forming wave-like patterns',
    params: {
      du: 0.14,
      dv: 0.06,
      f: 0.025,
      k: 0.06,
    },
    seedType: 'center',
  },
  {
    name: 'Coral Reefs',
    description: 'Branching, organic structures like coral formations',
    params: {
      du: 0.16,
      dv: 0.08,
      f: 0.062,
      k: 0.062,
    },
    seedType: 'random',
  },
  {
    name: 'Fingerprint',
    description: 'Swirling patterns reminiscent of fingerprints',
    params: {
      du: 0.19,
      dv: 0.05,
      f: 0.06,
      k: 0.062,
    },
    seedType: 'multiple',
  },
  {
    name: 'Waves',
    description: 'Oscillating wave patterns',
    params: {
      du: 0.16,
      dv: 0.08,
      f: 0.04,
      k: 0.06,
    },
    seedType: 'center',
  },
  {
    name: 'Maze',
    description: 'Labyrinth-like interconnected patterns',
    params: {
      du: 0.14,
      dv: 0.06,
      f: 0.03,
      k: 0.055,
    },
    seedType: 'multiple',
  },
  {
    name: 'Pulsing Spots',
    description: 'Dynamic spots that pulse and merge',
    params: {
      du: 0.16,
      dv: 0.08,
      f: 0.05,
      k: 0.065,
    },
    seedType: 'random',
  },
  {
    name: 'Spirals',
    description: 'Rotating spiral patterns',
    params: {
      du: 0.18,
      dv: 0.09,
      f: 0.045,
      k: 0.06,
    },
    seedType: 'center',
  },
];

export function getPresetByName(name: string): Preset | undefined {
  return presets.find(p => p.name === name);
}

