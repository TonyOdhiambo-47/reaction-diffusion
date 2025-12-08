import { useState, useRef } from 'react';
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

function App() {
  const [resolution, setResolution] = useState(256);
  const [params, setParams] = useState({
    du: 0.16,
    dv: 0.08,
    f: 0.035,
    k: 0.065,
  });
  const [paletteName, setPaletteName] = useState<PaletteName>('Electric Yellow');
  const [seedType] = useState<'center' | 'random' | 'multiple'>('center');
  const [stepsPerFrame, setStepsPerFrame] = useState(1);
  
  const simulatorRef = useRef<HTMLDivElement>(null);
  const scienceRef = useRef<HTMLDivElement>(null);

  const simulator = useReactionDiffusion({
    width: resolution,
    height: resolution,
    params,
    palette: palettes[paletteName],
    stepsPerFrame,
    dt: 1.0,
    seedType,
  });

  // Update simulator when params change
  React.useEffect(() => {
    simulator.updateParams(params);
  }, [params, simulator]);

  // Update simulator when palette changes
  React.useEffect(() => {
    simulator.updatePalette(palettes[paletteName]);
  }, [paletteName, simulator]);

  const handlePresetSelect = (preset: Preset) => {
    setParams(preset.params);
    // Always use 'center' (single circle) unless explicitly changed
    // setSeedType(preset.seedType);
    simulator.reset();
    // Scroll to simulator
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

      {/* Simulator Section - THE STAR */}
      <section
        ref={simulatorRef}
        className="min-h-screen py-16 px-6 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 relative overflow-hidden"
      >
        {/* Animated background pattern */}
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
            {/* Canvas - LARGER AND MORE PROMINENT */}
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
              {/* Stats overlay */}
              <div className="mt-4 flex justify-center gap-6 text-sm">
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
                  <div className="text-gray-300">{simulator.isPlaying ? '▶ Playing' : '⏸ Paused'}</div>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
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

      {/* Science Section */}
      <div ref={scienceRef}>
        <ScienceSection />
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
