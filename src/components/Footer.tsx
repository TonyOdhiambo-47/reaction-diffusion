import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-gradient-to-b from-slate-800 to-slate-900 text-gray-300">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            Reaction-Diffusion Studio
          </h3>
          <p className="text-sm mb-6 text-gray-400 font-light">
            Built as a visual exploration of chemistry, math, and pattern formation
          </p>
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} - Interactive Turing Pattern Generator
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
