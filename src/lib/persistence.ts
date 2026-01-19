import type { GrayScottParams } from '../simulation/grayScott';
import type { PaletteName } from '../simulation/colorPalettes';

/**
 * Application state structure for persistence.
 */
export interface PersistedState {
  version: number;
  params: GrayScottParams;
  resolution: number;
  paletteName: PaletteName;
  stepsPerFrame: number;
  seedType?: 'center' | 'random' | 'multiple';
}

const CURRENT_VERSION = 1;
const STORAGE_KEY = 'reaction-diffusion-state';

export const defaultState: PersistedState = {
  version: CURRENT_VERSION,
  params: {
    du: 0.16,
    dv: 0.08,
    f: 0.035,
    k: 0.065,
  },
  resolution: 256,
  paletteName: 'Fire',
  stepsPerFrame: 1,
  seedType: 'center',
};

/**
 * Load state from localStorage
 */
export function loadStateFromStorage(): PersistedState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as PersistedState;
    
    if (parsed.version !== CURRENT_VERSION) {
      console.warn(`State version mismatch: ${parsed.version} vs ${CURRENT_VERSION}`);
      return null;
    }

    return validateState(parsed) ? parsed : null;
  } catch (error) {
    console.warn('Error loading state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 */
export function saveStateToStorage(state: PersistedState): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const stateToSave: PersistedState = {
      ...state,
      version: CURRENT_VERSION,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded');
    } else {
      console.warn('Error saving state to localStorage:', error);
    }
    return false;
  }
}

/**
 * Validates state structure and value ranges.
 */
function validateState(state: any): state is PersistedState {
  if (!state || typeof state !== 'object') {
    return false;
  }

  if (!state.params || typeof state.params !== 'object') {
    return false;
  }

  const { du, dv, f, k } = state.params;
  if (
    typeof du !== 'number' ||
    typeof dv !== 'number' ||
    typeof f !== 'number' ||
    typeof k !== 'number' ||
    du < 0 || du > 1 ||
    dv < 0 || dv > 1 ||
    f < 0 || f > 1 ||
    k < 0 || k > 1
  ) {
    return false;
  }

  if (typeof state.resolution !== 'number' || ![128, 256, 512].includes(state.resolution)) {
    return false;
  }

  const validPalettes: PaletteName[] = [
    'Fire',
    'Cool',
    'Green',
  ];
  if (!validPalettes.includes(state.paletteName)) {
    return false;
  }

  if (typeof state.stepsPerFrame !== 'number' || state.stepsPerFrame < 1 || state.stepsPerFrame > 10) {
    return false;
  }

  return true;
}

/**
 * Convert state to URL parameters
 */
export function stateToUrlParams(state: Partial<PersistedState>): URLSearchParams {
  const params = new URLSearchParams();

  if (state.params) {
    params.set('du', state.params.du.toString());
    params.set('dv', state.params.dv.toString());
    params.set('f', state.params.f.toString());
    params.set('k', state.params.k.toString());
  }

  if (state.resolution !== undefined) {
    params.set('resolution', state.resolution.toString());
  }

  if (state.paletteName) {
    params.set('palette', state.paletteName);
  }

  if (state.stepsPerFrame !== undefined) {
    params.set('speed', state.stepsPerFrame.toString());
  }

  if (state.seedType) {
    params.set('seed', state.seedType);
  }

  return params;
}

/**
 * Parse URL parameters to state
 */
export function urlParamsToState(urlParams: URLSearchParams): Partial<PersistedState> {
  const state: Partial<PersistedState> = {};

  const du = urlParams.get('du');
  const dv = urlParams.get('dv');
  const f = urlParams.get('f');
  const k = urlParams.get('k');

  if (du && dv && f && k) {
    const duNum = parseFloat(du);
    const dvNum = parseFloat(dv);
    const fNum = parseFloat(f);
    const kNum = parseFloat(k);

    if (
      !isNaN(duNum) && duNum >= 0 && duNum <= 1 &&
      !isNaN(dvNum) && dvNum >= 0 && dvNum <= 1 &&
      !isNaN(fNum) && fNum >= 0 && fNum <= 1 &&
      !isNaN(kNum) && kNum >= 0 && kNum <= 1
    ) {
      state.params = { du: duNum, dv: dvNum, f: fNum, k: kNum };
    }
  }

  const resolution = urlParams.get('resolution');
  if (resolution) {
    const resNum = parseInt(resolution, 10);
    if (!isNaN(resNum) && [128, 256, 512].includes(resNum)) {
      state.resolution = resNum;
    }
  }

  const palette = urlParams.get('palette');
  if (palette) {
    const paletteMap: Record<string, PaletteName> = {
      'Inferno': 'Fire',
      'Electric': 'Cool',
      'Plasma': 'Green',
      'Fire': 'Fire',
      'Cool': 'Cool',
      'Green': 'Green',
    };
    
    const mappedPalette = paletteMap[palette];
    if (mappedPalette) {
      state.paletteName = mappedPalette;
    }
  }

  const speed = urlParams.get('speed');
  if (speed) {
    const speedNum = parseInt(speed, 10);
    if (!isNaN(speedNum) && speedNum >= 1 && speedNum <= 10) {
      state.stepsPerFrame = speedNum;
    }
  }

  const seed = urlParams.get('seed');
  if (seed && ['center', 'random', 'multiple'].includes(seed)) {
    state.seedType = seed as 'center' | 'random' | 'multiple';
  }

  return state;
}
