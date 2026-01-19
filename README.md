# Reaction-Diffusion Studio

Interactive web application for simulating and visualizing reaction-diffusion patterns using the Gray-Scott model.

## Overview

This application simulates 2D reaction-diffusion systems using the Gray-Scott model of chemical pattern formation. It renders animated patterns in real-time and allows interactive parameter adjustment to observe pattern evolution.

## Features

- Real-time Gray-Scott reaction-diffusion simulation with Canvas 2D rendering
- Interactive parameter controls for diffusion rates, feed/kill rates, and simulation speed
- Multiple high-contrast color palettes optimized for black backgrounds
- Resolution options: 128x128, 256x256, or 512x512 grid sizes
- PNG export functionality
- State persistence via localStorage and URL parameters
- Keyboard shortcuts for simulation control
- FPS monitoring
- Responsive design with smooth animations

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Radix UI components
- lucide-react icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── Hero.tsx        # Landing page hero section
│   ├── SimulatorCanvas.tsx  # Canvas wrapper component
│   ├── ControlPanel.tsx     # Parameter controls
│   ├── ScienceSection.tsx   # Educational content
│   └── Footer.tsx          # Footer component
├── simulation/         # Core simulation logic
│   ├── grayScott.ts    # Gray-Scott model implementation
│   ├── colorPalettes.ts    # Color mapping functions
│   └── presets.ts      # Parameter presets
├── hooks/
│   ├── useReactionDiffusion.ts  # Main simulation hook
│   ├── useKeyboardShortcuts.ts  # Keyboard shortcuts
│   ├── useFPS.ts       # FPS monitoring
│   ├── useLocalStorage.ts  # State persistence
│   └── useUrlParams.ts # URL parameter sync
├── lib/
│   ├── utils.ts        # Utility functions
│   └── persistence.ts  # State persistence utilities
└── App.tsx             # Main application component
```

## Gray-Scott Model

The simulation implements the Gray-Scott reaction-diffusion equations:

```
∂U/∂t = DU · ∇²U − U · V² + F · (1 − U)
∂V/∂t = DV · ∇²V + U · V² − (F + k) · V
```

Where:
- U, V: Concentrations of two chemical species
- DU, DV: Diffusion coefficients
- F: Feed rate
- k: Kill rate
- ∇²: Laplacian operator (5-point stencil with periodic boundary conditions)

## Usage

1. Click "Play" to start the simulation
2. Adjust parameters using the sliders
3. Select a preset from the dropdown
4. Change color palette to see different visual styles
5. Click "Download PNG" to export the current frame

### Keyboard Shortcuts

- Space: Play/Pause
- S: Step forward
- R: Reset simulation
- Shift+R: Random seed
- E: Export PNG
- Escape: Pause

## Performance

- Efficient Canvas 2D rendering with direct pixel manipulation via ImageData
- Animation automatically pauses when browser tab is hidden
- Resolution can be adjusted for performance (128x128 for faster, 512x512 for higher quality)
- Simulation speed can be increased (1-10 steps per frame) for faster evolution

## Implementation Details

- Uses Float32Array for efficient numerical computation
- Explicit Euler method for time stepping
- Periodic boundary conditions
- Debounced localStorage writes to prevent excessive I/O
- URL parameter synchronization for shareable configurations
