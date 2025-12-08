import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card } from './ui/card';
import { presets, type Preset } from '../simulation/presets';

interface PresetsGalleryProps {
  onPresetSelect: (preset: Preset) => void;
}

export function PresetsGallery({ onPresetSelect }: PresetsGalleryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const gradientColors = [
    'from-yellow-500/20 via-cyan-500/20 to-yellow-500/20',
    'from-cyan-500/20 via-yellow-500/20 to-cyan-500/20',
    'from-yellow-500/20 via-cyan-500/20 to-yellow-500/20',
    'from-cyan-500/20 via-yellow-500/20 to-cyan-500/20',
    'from-yellow-500/20 via-cyan-500/20 to-yellow-500/20',
    'from-cyan-500/20 via-yellow-500/20 to-cyan-500/20',
    'from-yellow-500/20 via-cyan-500/20 to-yellow-500/20',
    'from-cyan-500/20 via-yellow-500/20 to-cyan-500/20',
  ];

  return (
    <section ref={ref} className="py-24 px-6 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent">
            Pattern Presets
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Explore curated parameter combinations that produce stunning patterns
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset, index) => (
            <motion.div
              key={preset.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer h-full transition-all hover:shadow-2xl border-yellow-500/30 bg-slate-900/80 backdrop-blur-sm overflow-hidden group"
                onClick={() => onPresetSelect(preset)}
              >
                <div className="p-6">
                  <div className={`bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-xl aspect-square mb-4 flex items-center justify-center backdrop-blur-sm border border-yellow-500/30 shadow-lg group-hover:shadow-2xl transition-all`}>
                    <motion.p
                      className="text-yellow-400 text-sm text-center px-4 font-bold"
                      whileHover={{ scale: 1.1 }}
                    >
                      {preset.name}
                    </motion.p>
                  </div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">
                    {preset.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {preset.description}
                  </p>
                  <div className="pt-4 border-t border-yellow-500/20 text-xs text-gray-400 space-y-1 font-mono">
                    <div>F: <span className="text-yellow-400">{preset.params.f.toFixed(4)}</span></div>
                    <div>k: <span className="text-yellow-400">{preset.params.k.toFixed(4)}</span></div>
                    <div>DU: <span className="text-yellow-400">{preset.params.du.toFixed(4)}</span></div>
                    <div>DV: <span className="text-yellow-400">{preset.params.dv.toFixed(4)}</span></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
