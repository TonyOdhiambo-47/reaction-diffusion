import { useRef, useEffect, useState, useCallback } from 'react';
import {
  createSimulationState,
  stepSimulation,
  resetSimulation,
  type SimulationState,
  type GrayScottParams,
} from '../simulation/grayScott';
import { mapToColor, type ColorPalette } from '../simulation/colorPalettes';

export interface UseReactionDiffusionOptions {
  width: number;
  height: number;
  params: GrayScottParams;
  palette: ColorPalette;
  stepsPerFrame?: number;
  dt?: number;
  seedType?: 'center' | 'random' | 'multiple';
}

export interface UseReactionDiffusionReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  randomSeed: () => void;
  updateParams: (params: Partial<GrayScottParams>) => void;
  updatePalette: (palette: ColorPalette) => void;
  exportPNG: () => void;
}

/**
 * Hook for managing reaction-diffusion simulation state and rendering.
 */
export function useReactionDiffusion({
  width,
  height,
  params: initialParams,
  palette: initialPalette,
  stepsPerFrame = 1,
  dt = 1.0,
  seedType = 'center',
}: UseReactionDiffusionOptions): UseReactionDiffusionReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stateRef = useRef<SimulationState | null>(null);
  const paramsRef = useRef<GrayScottParams>(initialParams);
  const paletteRef = useRef<ColorPalette>(initialPalette);
  const stepsPerFrameRef = useRef(stepsPerFrame);
  
  const [isPlaying, setIsPlaying] = useState(false);

  // Update stepsPerFrame ref
  useEffect(() => {
    stepsPerFrameRef.current = stepsPerFrame;
  }, [stepsPerFrame]);

  /**
   * Render current simulation state to canvas
   */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!canvas || !state) {
      console.warn('Render skipped: canvas or state not ready', { canvas: !!canvas, state: !!state });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create ImageData for efficient pixel manipulation
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

    // Put image data to canvas
    ctx.putImageData(imageData, 0, 0);
  }, [width, height]);

  // Initialize or recreate simulation state when dimensions change
  useEffect(() => {
    if (!stateRef.current || stateRef.current.width !== width || stateRef.current.height !== height) {
      stateRef.current = createSimulationState(width, height, seedType);
    }
    // Render after state is created/updated
    const timer = setTimeout(() => {
      if (stateRef.current && canvasRef.current) {
        render();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [width, height, seedType, render]);

  // Update params ref when it changes
  useEffect(() => {
    paramsRef.current = initialParams;
  }, [initialParams]);

  // Update palette ref when it changes
  useEffect(() => {
    paletteRef.current = initialPalette;
  }, [initialPalette]);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;

    // Perform simulation steps
    const steps = stepsPerFrameRef.current;
    for (let i = 0; i < steps; i++) {
      stepSimulation(state, paramsRef.current, dt);
    }

    // Render
    render();

    // Continue animation if playing
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, dt, render]);

  // Start/stop animation based on isPlaying
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate]);

  // Pause when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Initial render - wait for state and canvas to be ready
  useEffect(() => {
    if (stateRef.current && canvasRef.current) {
      render();
    }
  }, [render]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const step = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;

    const steps = stepsPerFrameRef.current;
    for (let i = 0; i < steps; i++) {
      stepSimulation(state, paramsRef.current, dt);
    }
    render();
  }, [dt, render]);

  const reset = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;
    resetSimulation(state, seedType);
    render();
  }, [seedType, render]);

  const randomSeed = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;
    resetSimulation(state, 'random');
    render();
  }, [render]);

  const updateParams = useCallback((newParams: Partial<GrayScottParams>) => {
    paramsRef.current = { ...paramsRef.current, ...newParams };
  }, []);

  const updatePalette = useCallback((newPalette: ColorPalette) => {
    paletteRef.current = newPalette;
    render();
  }, [render]);

  const exportPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `reaction-diffusion-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return {
    canvasRef,
    isPlaying,
    play,
    pause,
    step,
    reset,
    randomSeed,
    updateParams,
    updatePalette,
    exportPNG,
  };
}

