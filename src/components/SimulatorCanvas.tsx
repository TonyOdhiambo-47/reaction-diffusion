import { motion } from 'framer-motion';

interface SimulatorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  className?: string;
}

export function SimulatorCanvas({ canvasRef, className }: SimulatorCanvasProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      <div className="relative rounded-3xl overflow-hidden bg-black p-2 shadow-2xl glow-yellow">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.4)',
              '0 0 60px rgba(251, 191, 36, 0.8), 0 0 120px rgba(251, 191, 36, 0.5)',
              '0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.4)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-yellow-500/30">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            role="img"
            aria-label="Reaction-diffusion simulation visualization"
            style={{ 
              imageRendering: 'auto',
              maxWidth: '100%',
              height: 'auto',
              filter: 'contrast(1.3) saturate(1.4) brightness(1.1)',
            }}
          />
          
          {/* Shine overlay effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                'linear-gradient(90deg, transparent 0%, rgba(255,255,0,0.1) 50%, transparent 100%)',
                'linear-gradient(90deg, transparent 0%, rgba(255,255,0,0.1) 50%, transparent 100%)',
              ],
              backgroundPosition: ['-200% 0', '200% 0'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
