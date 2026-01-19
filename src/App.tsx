import { useState, useRef, useEffect } from 'react';
import * as React from 'react';
import { motion } from 'framer-motion';
import { useReactionDiffusion } from './hooks/useReactionDiffusion';
import { palettes, type PaletteName } from './simulation/colorPalettes';
import { type Preset } from './simulation/presets';
import { Hero } from './components/Hero';
import { SimulatorCanvas } from './components/SimulatorCanvas';
import { ControlPanel } from './components/ControlPanel';
import { ScienceSection } from './components/ScienceSection';
import { Footer } from './components/Footer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFPS } from './hooks/useFPS';
import { useDebouncedLocalStorage } from './hooks/useLocalStorage';
import { urlParamsToState, stateToUrlParams, defaultState, type PersistedState } from './lib/persistence';

function App() {
  const [initialState] = useState<PersistedState>(() => {
    if (typeof window === 'undefined') {
      return defaultState;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlState = urlParamsToState(urlParams);
    
    if (Object.keys(urlState).length > 0) {
      const merged = { ...defaultState, ...urlState };
      if (!palettes[merged.paletteName]) {
        merged.paletteName = defaultState.paletteName;
      }
      return merged;
    }
    try {
      const stored = window.localStorage.getItem('reaction-diffusion-state');
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedState;
        if (parsed.version === defaultState.version) {
          const merged = { ...defaultState, ...parsed };
          if (!palettes[merged.paletteName]) {
            merged.paletteName = defaultState.paletteName;
          }
          return merged;
        }
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }

    return defaultState;
  });

  const [resolution, setResolution] = useState(initialState.resolution);
  const [params, setParams] = useState(initialState.params);
  const [paletteName, setPaletteName] = useState<PaletteName>(initialState.paletteName);
  const [seedType] = useState<'center' | 'random' | 'multiple'>(initialState.seedType || 'center');
  const [stepsPerFrame, setStepsPerFrame] = useState(initialState.stepsPerFrame);
  
  const simulatorRef = useRef<HTMLDivElement>(null);
  const scienceRef = useRef<HTMLDivElement>(null);

  const [, setStoredState] = useDebouncedLocalStorage<PersistedState>(
    'reaction-diffusion-state',
    defaultState,
    500
  );

  useEffect(() => {
    const stateToSave: PersistedState = {
      version: defaultState.version,
      params,
      resolution,
      paletteName,
      stepsPerFrame,
      seedType,
    };
    setStoredState(stateToSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, resolution, paletteName, stepsPerFrame, seedType]);

  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (typeof window === 'undefined') return;

      const urlParams = stateToUrlParams({
        params,
        resolution,
        paletteName,
        stepsPerFrame,
        seedType,
      });

      const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;

      window.history.replaceState({}, '', newUrl);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, resolution, paletteName, stepsPerFrame, seedType]);

  const simulator = useReactionDiffusion({
    width: resolution,
    height: resolution,
    params,
    palette: palettes[paletteName],
    stepsPerFrame,
    dt: 1.0,
    seedType,
  });

  React.useEffect(() => {
    simulator.updateParams(params);
  }, [params, simulator]);

  React.useEffect(() => {
    const palette = palettes[paletteName];
    if (palette) {
      simulator.updatePalette(palette);
    }
  }, [paletteName, simulator]);

  const fps = useFPS(simulator.isPlaying);

  useKeyboardShortcuts({
    onPlayPause: () => {
      if (simulator.isPlaying) {
        simulator.pause();
      } else {
        simulator.play();
      }
    },
    onStep: () => simulator.step(),
    onReset: () => simulator.reset(),
    onRandomSeed: () => simulator.randomSeed(),
    onExport: () => simulator.exportPNG(),
  });

  const handlePresetSelect = (preset: Preset) => {
    setParams(preset.params);
    simulator.reset();
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToScience = () => {
    scienceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Hero
        onScrollToSimulator={handleScrollToSimulator}
        onScrollToScience={handleScrollToScience}
      />

      <section
        ref={simulatorRef}
        className="min-h-screen py-16 px-6 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden"
        aria-label="Interactive reaction-diffusion simulator"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
              Interactive Simulator
            </h2>
            <p className="text-xl text-gray-300 font-light">
              Adjust parameters and watch patterns evolve in real-time
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sticky top-8 w-full"
            >
              <SimulatorCanvas
                canvasRef={simulator.canvasRef}
                className="w-full"
              />
              <div className="mt-4 flex justify-center gap-6 text-sm flex-wrap">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/30">
                  <div className="text-yellow-400 font-semibold">Resolution</div>
                  <div className="text-gray-300">{resolution}×{resolution}</div>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/30">
                  <div className="text-yellow-400 font-semibold">Speed</div>
                  <div className="text-gray-300">{stepsPerFrame} step{stepsPerFrame !== 1 ? 's' : ''}/frame</div>
                </div>
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/30">
                  <div className="text-yellow-400 font-semibold">Status</div>
                  <div className="text-gray-300">{simulator.isPlaying ? 'Playing' : 'Paused'}</div>
                </div>
                {simulator.isPlaying && fps > 0 && (
                  <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-yellow-500/30">
                    <div className="text-yellow-400 font-semibold">FPS</div>
                    <div className="text-gray-300">{fps}</div>
                  </div>
                )}
              </div>
            </motion.div>

            <div>
              <ControlPanel
                simulator={simulator}
                params={params}
                onParamsChange={setParams}
                paletteName={paletteName}
                onPaletteChange={setPaletteName}
                resolution={resolution}
                onResolutionChange={setResolution}
                stepsPerFrame={stepsPerFrame}
                onStepsPerFrameChange={setStepsPerFrame}
                onPresetSelect={handlePresetSelect}
              />
            </div>
          </div>
        </div>
      </section>

      <div ref={scienceRef}>
        <ScienceSection />
      </div>

      <Footer />
    </div>
  );
}

export default App;
