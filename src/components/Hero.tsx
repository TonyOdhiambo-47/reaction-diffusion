import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Button } from './ui/button';

interface HeroProps {
  onScrollToSimulator: () => void;
  onScrollToScience: () => void;
}

export function Hero({ onScrollToSimulator, onScrollToScience }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.15),transparent_50%)]" />
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.1), transparent)',
              'radial-gradient(circle at 30% 70%, rgba(34,211,238,0.1), transparent)',
              'radial-gradient(circle at 70% 30%, rgba(251,191,36,0.1), transparent)',
              'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.1), transparent)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-6 tracking-tight leading-none"
          >
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
              Reaction
            </span>
            {' '}
            <span className="bg-gradient-to-r from-cyan-400 via-yellow-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
              Diffusion
            </span>
            {' '}
            <span className="bg-gradient-to-r from-yellow-300 via-cyan-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
              Studio
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="text-2xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Interactive Turing pattern generator built from real chemistry
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={onScrollToSimulator}
                className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black border-0 shadow-2xl shadow-yellow-500/50 font-bold"
              >
                Play with the patterns
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={onScrollToScience}
                className="text-lg px-10 py-7 border-2 border-yellow-400/50 bg-slate-800/50 backdrop-blur-sm text-yellow-400 hover:bg-slate-700/50 hover:border-yellow-400 font-semibold"
              >
                Learn the science
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <ArrowDown className="h-8 w-8 text-yellow-400/80" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800 to-transparent pointer-events-none" />
    </section>
  );
}
