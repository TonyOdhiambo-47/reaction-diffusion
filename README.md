# Reaction-Diffusion Studio

Interactive web application for simulating and visualizing reaction-diffusion patterns using the Gray-Scott model.

## Overview

This application simulates 2D reaction-diffusion systems using the Gray-Scott model of chemical pattern formation. It renders animated patterns in real-time and allows interactive parameter adjustment to observe pattern evolution.

## Features

- Real-time Gray-Scott reaction-diffusion simulation with Canvas 2D rendering
- Interactive parameter controls for diffusion rates, feed/kill rates, and simulation speed
- Multiple color palettes optimized for black backgrounds
- Resolution options: 128x128, 256x256, or 512x512 grid sizes
- PNG export functionality
- Responsive design with smooth animations

## Tech Stack

- React + TypeScript
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
│   ├── Hero.tsx        # Hero section
│   ├── SimulatorCanvas.tsx  # Canvas wrapper
│   ├── ControlPanel.tsx     # Parameter controls
│   ├── ScienceSection.tsx   # Science explanation
│   └── Footer.tsx          # Footer
├── simulation/         # Core simulation logic
│   ├── grayScott.ts    # Gray-Scott model
│   ├── colorPalettes.ts    # Color mapping
│   └── presets.ts      # Parameter presets
├── hooks/
│   └── useReactionDiffusion.ts  # Simulation hook
├── lib/
│   └── utils.ts        # Utilities
└── App.tsx             # Main component
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
- ∇²: Laplacian operator (5-point stencil)

## Usage

1. Click "Play" to start the simulation
2. Adjust parameters using the sliders
3. Select a preset from the dropdown
4. Change color palette to see different visual styles
5. Click "Download PNG" to export the current frame

## Performance

- Efficient Canvas 2D rendering with direct pixel manipulation
- Animation pauses when browser tab is hidden
- Resolution can be adjusted for performance
- Simulation speed can be increased for faster evolution

## License

MIT
