/**
 * Gray-Scott Reaction-Diffusion Simulation
 * 
 * ∂U/∂t = DU * ∇²U − U * V² + F * (1 − U)
 * ∂V/∂t = DV * ∇²V + U * V² − (F + k) * V
 */

export interface GrayScottParams {
  /** Diffusion coefficient for species U */
  du: number;
  /** Diffusion coefficient for species V */
  dv: number;
  /** Feed rate */
  f: number;
  /** Kill rate */
  k: number;
}

export interface SimulationState {
  /** Grid width */
  width: number;
  /** Grid height */
  height: number;
  /** Species U concentration (flat array) */
  u: Float32Array;
  /** Species V concentration (flat array) */
  v: Float32Array;
}

/**
 * Initialize simulation state with seed pattern
 */
export function createSimulationState(
  width: number,
  height: number,
  seedType: 'center' | 'random' | 'multiple' = 'center'
): SimulationState {
  const size = width * height;
  const u = new Float32Array(size);
  const v = new Float32Array(size);

  u.fill(1.0);
  v.fill(0.0);

  if (seedType === 'center') {
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radius = Math.min(width, height) * 0.1;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < radius) {
          const idx = y * width + x;
          u[idx] = 0.5;
          v[idx] = 0.25;
        }
      }
    }
  } else if (seedType === 'random') {
    const numSeeds = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numSeeds; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const radius = 5 + Math.random() * 10;
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              const idx = ny * width + nx;
              u[idx] = 0.5;
              v[idx] = 0.25;
            }
          }
        }
      }
    }
  } else if (seedType === 'multiple') {
    const gridSize = 3;
    const spacingX = width / (gridSize + 1);
    const spacingY = height / (gridSize + 1);
    const radius = Math.min(spacingX, spacingY) * 0.15;
    
    for (let gy = 1; gy <= gridSize; gy++) {
      for (let gx = 1; gx <= gridSize; gx++) {
        const centerX = Math.floor(gx * spacingX);
        const centerY = Math.floor(gy * spacingY);
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < radius) {
              const idx = y * width + x;
              u[idx] = 0.5;
              v[idx] = 0.25;
            }
          }
        }
      }
    }
  }

  return { width, height, u, v };
}

/**
 * Computes Laplacian using 5-point stencil with periodic boundary conditions.
 */
function laplacian(
  grid: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number
): number {
  const idx = y * width + x;
  const center = grid[idx];
  
  const left = grid[y * width + ((x - 1 + width) % width)];
  const right = grid[y * width + ((x + 1) % width)];
  const up = grid[((y - 1 + height) % height) * width + x];
  const down = grid[((y + 1) % height) * width + x];
  
  return left + right + up + down - 4 * center;
}

/**
 * Performs one time step of Gray-Scott simulation using explicit Euler method.
 */
export function stepSimulation(
  state: SimulationState,
  params: GrayScottParams,
  dt: number = 1.0
): void {
  const { width, height, u, v } = state;
  const { du, dv, f, k } = params;
  
  const uNew = new Float32Array(width * height);
  const vNew = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      
      const lapU = laplacian(u, width, height, x, y);
      const lapV = laplacian(v, width, height, x, y);
      
      const uVal = u[idx];
      const vVal = v[idx];
      const reaction = uVal * vVal * vVal;
      
      const dUdt = du * lapU - reaction + f * (1.0 - uVal);
      const dVdt = dv * lapV + reaction - (f + k) * vVal;
      
      uNew[idx] = Math.max(0, Math.min(1, uVal + dt * dUdt));
      vNew[idx] = Math.max(0, Math.min(1, vVal + dt * dVdt));
    }
  }
  
  u.set(uNew);
  v.set(vNew);
}

/**
 * Resets simulation state with new seed pattern.
 */
export function resetSimulation(
  state: SimulationState,
  seedType: 'center' | 'random' | 'multiple' = 'center'
): void {
  const { width, height } = state;
  const newState = createSimulationState(width, height, seedType);
  state.u.set(newState.u);
  state.v.set(newState.v);
}

