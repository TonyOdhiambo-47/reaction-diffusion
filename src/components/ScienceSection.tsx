import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function ScienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
            Science Behind the Patterns
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Understanding how simple chemical reactions create complex, beautiful patterns
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Single column: Text content */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-yellow-500/20"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                What is a reaction-diffusion system?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                A reaction-diffusion system describes how two or more chemical substances
                interact and spread through space. As these chemicals react with each other
                and diffuse (spread out), they can spontaneously form intricate patterns:
                spots, stripes, spirals, and waves. These patterns emerge from the interplay
                between local chemical reactions and long-range diffusion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-yellow-500/20"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                The Gray-Scott model
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Gray-Scott model is a mathematical framework that captures this behavior
                using two coupled partial differential equations:
              </p>
              <div className="bg-black p-6 rounded-xl font-mono text-sm space-y-3 text-yellow-300 shadow-xl border border-yellow-500/30">
                <div>
                  <span className="text-cyan-400">∂U/∂t = </span>
                  <span>DU · ∇²U − U · V² + F · (1 − U)</span>
                </div>
                <div>
                  <span className="text-cyan-400">∂V/∂t = </span>
                  <span>DV · ∇²V + U · V² − (F + k) · V</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mt-4">
                Here, <strong className="text-yellow-400">U</strong> and <strong className="text-yellow-400">V</strong> represent the concentrations
                of two chemical species. <strong className="text-yellow-400">DU</strong> and <strong className="text-yellow-400">DV</strong> are
                diffusion coefficients controlling how fast each species spreads. <strong className="text-yellow-400">F</strong>
                is the feed rate (how quickly U is replenished), and <strong className="text-yellow-400">k</strong> is the
                kill rate (how quickly V is removed). The Laplacian term (∇²) models diffusion,
                while the reaction terms (U·V²) capture chemical interactions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-yellow-500/20"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Why do patterns emerge?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Patterns emerge through a mechanism called <strong className="text-yellow-400">local activation and
                long-range inhibition</strong>. When a small region has slightly more of
                one chemical, it can trigger a reaction that amplifies this difference
                locally. At the same time, diffusion spreads the chemicals
                outward, creating zones of inhibition around active regions. This balance
                between activation and inhibition leads to stable, repeating patterns.
                Small perturbations in the initial conditions can amplify into dramatic
                structures - spots become spots, stripes become stripes, all driven by the
                underlying mathematics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-yellow-500/20"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                From chemistry to morphogenesis
              </h3>
              <p className="text-gray-300 leading-relaxed">
                While reaction-diffusion systems were originally studied in chemistry, they
                have profound implications for biology. Similar mathematical principles help
                explain how patterns form in nature: the spots on a leopard, the stripes on
                a zebra, the spirals on a seashell, and even the branching of blood vessels.
                These patterns arise not from a blueprint, but from the self-organizing
                properties of chemical and biological systems. By exploring these simulations,
                we gain insight into the universal principles that shape the natural world.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
